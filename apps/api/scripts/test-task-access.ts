import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testTaskAccess() {
  console.log('🔍 Testing task access for different users...')
  
  try {
    // Get users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true
      }
    })

    console.log(`👥 Found ${users.length} users:`)
    for (const user of users) {
      console.log(`  - ${user.email} (ID: ${user.id})`)
    }

    // Get projects
    const projects = await prisma.project.findMany({
      include: {
        organization: {
          include: {
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
        },
        tasks: true
      }
    })

    console.log(`\n📁 Found ${projects.length} projects:`)
    
    for (const project of projects) {
      console.log(`\n📁 Project: ${project.name} (ID: ${project.id})`)
      console.log(`   Owner: ${project.userId}`)
      console.log(`   Organization: ${project.organization?.name}`)
      console.log(`   Members:`)
      
      for (const membership of project.organization?.memberships || []) {
        console.log(`     - ${membership.user.email} (${membership.role})`)
      }
      
      console.log(`   Tasks: ${project.tasks.length}`)
      for (const task of project.tasks) {
        // Get task creator info
        const taskCreator = await prisma.user.findUnique({
          where: { id: task.createdById },
          select: { email: true }
        })
        console.log(`     - "${task.title}" by ${taskCreator?.email || 'Unknown'} (Status: ${task.status})`)
      }

      // Test access for each user
      console.log(`\n   🔐 Testing access for each user:`)
      for (const user of users) {
        // Check if user has access to this project
        const hasAccess = project.userId === user.id || 
          project.organization?.memberships.some(m => m.userId === user.id)
        
        console.log(`     ${user.email}: ${hasAccess ? '✅ HAS ACCESS' : '❌ NO ACCESS'}`)
        
        if (hasAccess) {
          // Simulate the query that would be used in TasksCrudService.findByProject
          const accessibleTasks = await prisma.task.findMany({
            where: { projectId: project.id }
          })
          
          console.log(`       Should see ${accessibleTasks.length} tasks`)
        }
      }
    }

  } catch (error) {
    console.error('❌ Error testing task access:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
testTaskAccess()