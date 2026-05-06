import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanOrphanOrganizations() {
  console.log('🧹 Cleaning orphan organizations...')
  
  try {
    // Find all organizations
    const organizations = await prisma.organization.findMany({
      include: {
        projects: true,
        memberships: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })

    console.log(`🏢 Found ${organizations.length} organizations`)

    // Find organizations with no projects
    const orphanOrganizations = organizations.filter(org => org.projects.length === 0)
    
    console.log(`🗑️  Found ${orphanOrganizations.length} organizations with no projects:`)

    for (const org of orphanOrganizations) {
      console.log(`\n🏢 Organization: ${org.name} (ID: ${org.id})`)
      console.log(`   Projects: ${org.projects.length}`)
      console.log(`   Memberships: ${org.memberships.length}`)
      
      if (org.memberships.length > 0) {
        console.log(`   Members:`)
        for (const membership of org.memberships) {
          console.log(`     - ${membership.user.email} (${membership.role})`)
        }
      }

      // Check if there are any invitations for this organization
      const invitations = await prisma.invitation.findMany({
        where: { organizationId: org.id }
      })

      console.log(`   Invitations: ${invitations.length}`)

      // If no projects, no invitations, we can safely delete
      if (org.projects.length === 0 && invitations.length === 0) {
        console.log(`   🗑️  This organization can be safely deleted`)
        
        // Delete memberships first
        if (org.memberships.length > 0) {
          console.log(`   🗑️  Deleting ${org.memberships.length} memberships...`)
          await prisma.membership.deleteMany({
            where: { organizationId: org.id }
          })
        }
        
        // Delete organization
        console.log(`   🗑️  Deleting organization...`)
        await prisma.organization.delete({
          where: { id: org.id }
        })
        
        console.log(`   ✅ Deleted organization "${org.name}"`)
      } else {
        console.log(`   ⚠️  Cannot delete - has invitations or other dependencies`)
      }
    }

    console.log('\n🎉 Finished cleaning orphan organizations!')

    // Show remaining organizations
    console.log('\n📊 Remaining organizations:')
    const remainingOrgs = await prisma.organization.findMany({
      include: {
        projects: {
          select: {
            name: true
          }
        },
        memberships: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })

    for (const org of remainingOrgs) {
      console.log(`\n🏢 ${org.name} (ID: ${org.id})`)
      console.log(`   Projects: ${org.projects.map(p => p.name).join(', ') || 'None'}`)
      console.log(`   Members: ${org.memberships.map(m => `${m.user.email} (${m.role})`).join(', ') || 'None'}`)
    }

  } catch (error) {
    console.error('❌ Error cleaning orphan organizations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
cleanOrphanOrganizations()