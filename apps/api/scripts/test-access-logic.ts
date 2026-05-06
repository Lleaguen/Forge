import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAccessLogic() {
  console.log('🔍 Testing access logic step by step...')
  
  try {
    // Get users
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@forge.dev' }
    })
    
    const memberUser = await prisma.user.findUnique({
      where: { email: 'tbbdonline@gmail.com' }
    })
    
    if (!adminUser || !memberUser) {
      console.log('❌ Users not found')
      return
    }
    
    console.log(`👤 Admin: ${adminUser.email} (ID: ${adminUser.id})`)
    console.log(`👤 Member: ${memberUser.email} (ID: ${memberUser.id})`)
    
    // Get the project
    const project = await prisma.project.findFirst({
      where: { name: 'segunda prueba' }
    })
    
    if (!project) {
      console.log('❌ Project not found')
      return
    }
    
    console.log(`\n📁 Project: ${project.name} (ID: ${project.id})`)
    console.log(`   Owner: ${project.userId}`)
    console.log(`   Organization: ${project.organizationId}`)
    
    // Test the exact access logic from TasksCrudService.findByProject
    console.log(`\n🔐 Testing project access logic:`)
    
    // For admin user
    console.log(`\n👤 Admin user access test:`)
    const adminProjectAccess = await prisma.project.findFirst({
      where: {
        id: project.id,
        OR: [
          { userId: adminUser.id }, // User owns the project
          { 
            organization: {
              memberships: {
                some: { userId: adminUser.id }
              }
            }
          } // User is a member of the project's organization
        ]
      }
    })
    
    console.log(`   Project access: ${adminProjectAccess ? '✅ YES' : '❌ NO'}`)
    
    // For member user
    console.log(`\n👤 Member user access test:`)
    const memberProjectAccess = await prisma.project.findFirst({
      where: {
        id: project.id,
        OR: [
          { userId: memberUser.id }, // User owns the project
          { 
            organization: {
              memberships: {
                some: { userId: memberUser.id }
              }
            }
          } // User is a member of the project's organization
        ]
      }
    })
    
    console.log(`   Project access: ${memberProjectAccess ? '✅ YES' : '❌ NO'}`)
    
    // If member has access, get tasks
    if (memberProjectAccess) {
      console.log(`\n📋 Getting tasks for member user:`)
      const tasks = await prisma.task.findMany({
        where: { projectId: project.id },
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`   Found ${tasks.length} tasks:`)
      for (const task of tasks) {
        const creator = await prisma.user.findUnique({
          where: { id: task.createdById },
          select: { email: true }
        })
        console.log(`     - "${task.title}" by ${creator?.email} (${task.status})`)
      }
    }
    
    // Check memberships for member user
    console.log(`\n🏢 Member user's memberships:`)
    const memberships = await prisma.membership.findMany({
      where: { userId: memberUser.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    
    for (const membership of memberships) {
      console.log(`   - ${membership.organization.name} (${membership.role}) - Org ID: ${membership.organizationId}`)
    }
    
    console.log(`\n📁 Project organization ID: ${project.organizationId}`)
    
  } catch (error) {
    console.error('❌ Error testing access logic:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
testAccessLogic()