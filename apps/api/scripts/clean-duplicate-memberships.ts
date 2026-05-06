import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDuplicateMemberships() {
  console.log('🧹 Cleaning duplicate memberships...')
  
  try {
    // Find all memberships grouped by user and organization
    const memberships = await prisma.membership.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        organization: {
          select: {
            name: true,
            projects: {
              select: {
                id: true,
                name: true,
                userId: true
              }
            }
          }
        }
      },
      orderBy: [
        { userId: 'asc' },
        { organizationId: 'asc' }
      ]
    })

    // Group memberships by user + organization
    const membershipGroups = new Map<string, any[]>()
    
    for (const membership of memberships) {
      const key = `${membership.userId}-${membership.organizationId}`
      if (!membershipGroups.has(key)) {
        membershipGroups.set(key, [])
      }
      membershipGroups.get(key)!.push(membership)
    }

    // Find duplicates
    const duplicateGroups = Array.from(membershipGroups.entries())
      .filter(([key, memberships]) => memberships.length > 1)

    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicate memberships found!')
      return
    }

    console.log(`⚠️  Found ${duplicateGroups.length} users with duplicate memberships:`)

    for (const [key, duplicateMemberships] of duplicateGroups) {
      const [userId, organizationId] = key.split('-')
      const user = duplicateMemberships[0].user
      const org = duplicateMemberships[0].organization
      
      console.log(`\n👤 User: ${user.email}`)
      console.log(`🏢 Organization: ${org.name}`)
      console.log(`📋 Duplicate memberships: ${duplicateMemberships.length}`)
      
      // Check if user owns any projects in this organization
      const ownedProjects = org.projects.filter(p => p.userId === userId)
      const shouldBeOwner = ownedProjects.length > 0
      
      console.log(`  📁 Owns ${ownedProjects.length} projects in this org`)
      if (ownedProjects.length > 0) {
        console.log(`    Projects owned: ${ownedProjects.map(p => p.name).join(', ')}`)
      }
      
      // Determine the correct role
      const correctRole = shouldBeOwner ? 'OWNER' : 'MEMBER'
      console.log(`  🎯 Correct role should be: ${correctRole}`)
      
      // Show current memberships
      for (const membership of duplicateMemberships) {
        console.log(`    - Membership ID: ${membership.id}, Role: ${membership.role}, Created: ${membership.createdAt}`)
      }
      
      // Keep the first membership and update its role if needed
      const [keepMembership, ...deleteMemberships] = duplicateMemberships
      
      // Update the kept membership to have the correct role
      if (keepMembership.role !== correctRole) {
        console.log(`  🔧 Updating kept membership role from ${keepMembership.role} to ${correctRole}`)
        await prisma.membership.update({
          where: { id: keepMembership.id },
          data: { role: correctRole }
        })
      }
      
      // Delete the duplicate memberships
      for (const membership of deleteMemberships) {
        console.log(`  🗑️  Deleting duplicate membership: ${membership.id} (Role: ${membership.role})`)
        await prisma.membership.delete({
          where: { id: membership.id }
        })
      }
      
      console.log(`  ✅ Cleaned up ${deleteMemberships.length} duplicate memberships`)
    }

    console.log('\n🎉 Finished cleaning duplicate memberships!')
    
    // Verify the cleanup
    console.log('\n🔍 Verifying cleanup...')
    const remainingMemberships = await prisma.membership.findMany({
      include: {
        user: { select: { email: true } },
        organization: { select: { name: true } }
      }
    })

    const verifyGroups = new Map<string, any[]>()
    for (const membership of remainingMemberships) {
      const key = `${membership.userId}-${membership.organizationId}`
      if (!verifyGroups.has(key)) {
        verifyGroups.set(key, [])
      }
      verifyGroups.get(key)!.push(membership)
    }

    const stillDuplicates = Array.from(verifyGroups.entries())
      .filter(([key, memberships]) => memberships.length > 1)

    if (stillDuplicates.length === 0) {
      console.log('✅ Verification successful! No duplicate memberships remain.')
    } else {
      console.log(`❌ Still have ${stillDuplicates.length} duplicate memberships. Manual intervention needed.`)
    }

  } catch (error) {
    console.error('❌ Error cleaning duplicate memberships:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
cleanDuplicateMemberships()