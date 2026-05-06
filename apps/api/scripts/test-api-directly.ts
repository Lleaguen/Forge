import { PrismaClient } from '@prisma/client'
import { TasksCrudService } from '../src/modules/tasks/infrastructure/services/tasks-crud.service'

const prisma = new PrismaClient()

async function testApiDirectly() {
  console.log('🔍 Testing TasksCrudService directly...')
  
  try {
    const tasksService = new TasksCrudService(prisma)
    
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
    
    // Get the project with tasks
    const project = await prisma.project.findFirst({
      where: { name: 'segunda prueba' },
      include: { tasks: true }
    })
    
    if (!project) {
      console.log('❌ Project not found')
      return
    }
    
    console.log(`📁 Project: ${project.name} (ID: ${project.id})`)
    console.log(`   Total tasks in DB: ${project.tasks.length}`)
    
    // Test access for admin user
    console.log(`\n👤 Testing access for admin user (${adminUser.email}):`)
    try {
      const adminTasks = await tasksService.findByProject(project.id, {
        sub: adminUser.id,
        organizationId: undefined // This might be the issue
      })
      console.log(`   ✅ Admin can see ${adminTasks.length} tasks`)
      for (const task of adminTasks) {
        console.log(`     - "${task.title}" (${task.status})`)
      }
    } catch (error) {
      console.log(`   ❌ Admin access failed: ${error.message}`)
    }
    
    // Test access for member user
    console.log(`\n👤 Testing access for member user (${memberUser.email}):`)
    try {
      const memberTasks = await tasksService.findByProject(project.id, {
        sub: memberUser.id,
        organizationId: undefined // This might be the issue
      })
      console.log(`   ✅ Member can see ${memberTasks.length} tasks`)
      for (const task of memberTasks) {
        console.log(`     - "${task.title}" (${task.status})`)
      }
    } catch (error) {
      console.log(`   ❌ Member access failed: ${error.message}`)
    }
    
  } catch (error) {
    console.error('❌ Error testing API directly:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
testApiDirectly()