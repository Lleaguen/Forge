import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixProjectOrganizations() {
  console.log('🔍 Checking for projects sharing organizations...')
  
  try {
    // Get all projects with their organizations
    const projects = await prisma.project.findMany({
      include: {
        organization: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`📊 Found ${projects.length} projects`)

    // Group projects by organization
    const organizationGroups = new Map<string, any[]>()
    
    for (const project of projects) {
      if (project.organizationId) {
        const orgId = project.organizationId
        if (!organizationGroups.has(orgId)) {
          organizationGroups.set(orgId, [])
        }
        organizationGroups.get(orgId)!.push(project)
      }
    }

    // Find organizations with multiple projects
    const sharedOrganizations = Array.from(organizationGroups.entries())
      .filter(([orgId, projects]) => projects.length > 1)

    if (sharedOrganizations.length === 0) {
      console.log('✅ All projects have unique organizations!')
      return
    }

    console.log(`⚠️  Found ${sharedOrganizations.length} organizations with multiple projects:`)
    
    for (const [orgId, projectsInOrg] of sharedOrganizations) {
      console.log(`\n🏢 Organization ${orgId} has ${projectsInOrg.length} projects:`)
      
      for (const project of projectsInOrg) {
        console.log(`  - Project: ${project.name} (ID: ${project.id}) - Owner: ${project.user.email}`)
      }

      // Fix: Create separate organizations for each project (except the first one)
      const [firstProject, ...otherProjects] = projectsInOrg

      console.log(`  ✅ Keeping first project "${firstProject.name}" in original organization`)

      for (const project of otherProjects) {
        console.log(`  🔧 Creating new organization for project "${project.name}"...`)
        
        // Create new organization for this project
        const newOrganization = await prisma.organization.create({
          data: {
            name: `${project.name} Organization`
          }
        })

        // Update project to use new organization
        await prisma.project.update({
          where: { id: project.id },
          data: { organizationId: newOrganization.id }
        })

        // Move the project owner's membership to the new organization
        const ownerMembership = await prisma.membership.findFirst({
          where: {
            userId: project.userId,
            organizationId: orgId
          }
        })

        if (ownerMembership) {
          // Create new membership in new organization
          await prisma.membership.create({
            data: {
              userId: project.userId,
              organizationId: newOrganization.id,
              role: 'OWNER'
            }
          })

          // Only delete old membership if this user doesn't own the first project
          if (project.userId !== firstProject.userId) {
            await prisma.membership.delete({
              where: { id: ownerMembership.id }
            })
          }
        }

        // Move any invitations for this specific project to the new organization
        await prisma.invitation.updateMany({
          where: {
            projectId: project.id,
            organizationId: orgId
          },
          data: {
            organizationId: newOrganization.id
          }
        })

        console.log(`  ✅ Created organization "${newOrganization.name}" (ID: ${newOrganization.id}) for project "${project.name}"`)
      }
    }

    console.log('\n🎉 Fixed all shared organizations!')
    
    // Verify the fix
    console.log('\n🔍 Verifying fix...')
    const updatedProjects = await prisma.project.findMany({
      include: {
        organization: true
      }
    })

    const updatedOrgGroups = new Map<string, any[]>()
    for (const project of updatedProjects) {
      if (project.organizationId) {
        const orgId = project.organizationId
        if (!updatedOrgGroups.has(orgId)) {
          updatedOrgGroups.set(orgId, [])
        }
        updatedOrgGroups.get(orgId)!.push(project)
      }
    }

    const stillSharedOrgs = Array.from(updatedOrgGroups.entries())
      .filter(([orgId, projects]) => projects.length > 1)

    if (stillSharedOrgs.length === 0) {
      console.log('✅ Verification successful! All projects now have unique organizations.')
    } else {
      console.log(`❌ Still have ${stillSharedOrgs.length} shared organizations. Manual intervention may be needed.`)
    }

  } catch (error) {
    console.error('❌ Error fixing project organizations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixProjectOrganizations()