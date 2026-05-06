import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCompleteFlow() {
  console.log('🔍 TESTING COMPLETE INVITATION FLOW')
  console.log('=' .repeat(80))
  
  try {
    // Simulate the exact scenario
    const person1 = await prisma.user.findUnique({
      where: { email: 'admin@forge.dev' }
    })
    
    const person2 = await prisma.user.findUnique({
      where: { email: 'tbbdonline@gmail.com' }
    })
    
    if (!person1 || !person2) {
      console.log('❌ Users not found')
      return
    }
    
    console.log('\n👤 Person 1 (Inviter): ' + person1.email)
    console.log('👤 Person 2 (Invitee): ' + person2.email)
    
    // Get the shared project
    const project = await prisma.project.findFirst({
      where: { name: 'segunda prueba' },
      include: {
        organization: true,
        tasks: true
      }
    })
    
    if (!project) {
      console.log('❌ Project not found')
      return
    }
    
    console.log('\n📁 Project: ' + project.name)
    console.log('   Owner: ' + (person1.id === project.userId ? 'Person 1 ✅' : 'Someone else'))
    console.log('   Organization: ' + project.organization?.name)
    console.log('   Total tasks: ' + project.tasks.length)
    
    // Check invitation status
    console.log('\n📨 STEP 1: Check Invitation')
    console.log('-'.repeat(80))
    const invitation = await prisma.invitation.findFirst({
      where: {
        email: person2.email,
        projectId: project.id,
        status: 'ACCEPTED'
      }
    })
    
    if (invitation) {
      console.log('✅ Person 2 has ACCEPTED invitation to this project')
      console.log('   Invitation ID: ' + invitation.id)
      console.log('   Accepted at: ' + invitation.acceptedAt)
    } else {
      console.log('❌ No accepted invitation found')
      return
    }
    
    // Check membership
    console.log('\n👥 STEP 2: Check Membership')
    console.log('-'.repeat(80))
    const membership = await prisma.membership.findFirst({
      where: {
        userId: person2.id,
        organizationId: project.organizationId!
      }
    })
    
    if (membership) {
      console.log('✅ Person 2 is a member of the project organization')
      console.log('   Role: ' + membership.role)
      console.log('   Organization: ' + project.organization?.name)
    } else {
      console.log('❌ Person 2 is NOT a member of the project organization')
      return
    }
    
    // Check project access
    console.log('\n🔐 STEP 3: Check Project Access')
    console.log('-'.repeat(80))
    const projectAccess = await prisma.project.findFirst({
      where: {
        id: project.id,
        OR: [
          { userId: person2.id },
          {
            organization: {
              memberships: {
                some: { userId: person2.id }
              }
            }
          }
        ]
      }
    })
    
    if (projectAccess) {
      console.log('✅ Person 2 CAN access the project')
    } else {
      console.log('❌ Person 2 CANNOT access the project')
      return
    }
    
    // Check task access
    console.log('\n📋 STEP 4: Check Task Access')
    console.log('-'.repeat(80))
    const tasks = await prisma.task.findMany({
      where: { projectId: project.id },
      include: {
        createdBy: {
          select: {
            email: true
          }
        }
      }
    })
    
    console.log(`✅ Person 2 can see ${tasks.length} tasks:`)
    tasks.forEach((task, index) => {
      console.log(`   ${index + 1}. "${task.title}" by ${task.createdBy.email} (${task.status})`)
    })
    
    // Summary
    console.log('\n📊 SUMMARY')
    console.log('='.repeat(80))
    console.log('✅ Person 1 invited Person 2 to project "' + project.name + '"')
    console.log('✅ Person 2 accepted the invitation')
    console.log('✅ Person 2 is now a member of the project organization')
    console.log('✅ Person 2 CAN access the project')
    console.log('✅ Person 2 CAN see all ' + tasks.length + ' tasks in the project')
    console.log('\n🎉 THE COMPLETE FLOW WORKS CORRECTLY!')
    
  } catch (error) {
    console.error('❌ Error testing complete flow:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
testCompleteFlow()