import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugMemberships() {
  console.log('🔍 Debugging memberships in detail...')
  
  try {
    // Get the specific user
    const user = await prisma.user.findUnique({
      where: { email: 'tbbdonline@gmail.com' }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log(`👤 User: ${user.email} (ID: ${user.id})`)

    // Get all memberships for this user
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        organization: {
          include: {
            projects: true
          }
        }
      }
    })

    console.log(`📋 Found ${memberships.length} memberships:`)

    for (const membership of memberships) {
      console.log(`\n🏢 Membership ID: ${membership.id}`)
      console.log(`   Organization ID: ${membership.organizationId}`)
      console.log(`   Organization Name: ${membership.organization.name}`)
      console.log(`   Role: ${membership.role}`)
      console.log(`   Projects in org: ${membership.organization.projects.length}`)
      
      for (const project of membership.organization.projects) {
        console.log(`     - ${project.name} (ID: ${project.id}) - Owner: ${project.userId}`)
      }
    }

    // Check for duplicate organization IDs
    const orgIds = memberships.map(m => m.organizationId)
    const duplicateOrgIds = orgIds.filter((id, index) => orgIds.indexOf(id) !== index)
    
    if (duplicateOrgIds.length > 0) {
      console.log(`\n⚠️  Found duplicate organization memberships:`)
      for (const orgId of [...new Set(duplicateOrgIds)]) {
        const duplicates = memberships.filter(m => m.organizationId === orgId)
        console.log(`   Organization ${orgId}: ${duplicates.length} memberships`)
        for (const dup of duplicates) {
          console.log(`     - Membership ${dup.id}: Role ${dup.role}`)
        }
      }
    } else {
      console.log(`\n✅ No duplicate organization memberships found`)
    }

  } catch (error) {
    console.error('❌ Error debugging memberships:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
debugMemberships()