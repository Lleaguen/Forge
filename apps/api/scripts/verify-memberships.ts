import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyMemberships() {
  console.log('🔍 Verifying memberships and project access...')
  
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true
      }
    })

    console.log(`👥 Found ${users.length} users`)

    for (const user of users) {
      console.log(`\n👤 User: ${user.email} (${user.fullName})`)
      
      // Get user's memberships
      const memberships = await prisma.membership.findMany({
        where: { userId: user.id },
        include: {
          organization: {
            include: {
              projects: {
                select: {
                  id: true,
                  name: true,
                  userId: true
                }
              }
            }
          }
        }
      })

      console.log(`  📋 Memberships: ${memberships.length}`)
      
      for (const membership of memberships) {
        const org = membership.organization
        console.log(`    🏢 Organization: ${org.name} (Role: ${membership.role})`)
        console.log(`      📁 Projects in this org: ${org.projects.length}`)
        
        for (const project of org.projects) {
          const isOwner = project.userId === user.id
          console.log(`        - ${project.name} ${isOwner ? '(OWNER)' : '(MEMBER)'}`)
        }
      }

      // Get projects user should have access to
      const accessibleProjects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: user.id }, // Projects owned by user
            { 
              organization: {
                memberships: {
                  some: { userId: user.id }
                }
              }
            }
          ]
        },
        include: {
          organization: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              email: true
            }
          }
        }
      })

      console.log(`  🎯 Total accessible projects: ${accessibleProjects.length}`)
      for (const project of accessibleProjects) {
        const isOwner = project.userId === user.id
        console.log(`    - ${project.name} (${project.organization?.name}) ${isOwner ? '[OWNED]' : '[MEMBER]'} - Created by: ${project.user.email}`)
      }
    }

    // Check for pending invitations
    console.log('\n📨 Checking pending invitations...')
    const pendingInvitations = await prisma.invitation.findMany({
      where: { status: 'PENDING' },
      include: {
        project: {
          select: {
            name: true
          }
        },
        organization: {
          select: {
            name: true
          }
        },
        invitedBy: {
          select: {
            email: true
          }
        }
      }
    })

    console.log(`📬 Found ${pendingInvitations.length} pending invitations`)
    for (const invitation of pendingInvitations) {
      console.log(`  - ${invitation.email} invited to "${invitation.project?.name}" by ${invitation.invitedBy?.email}`)
      console.log(`    Organization: ${invitation.organization?.name}`)
      console.log(`    Token: ${invitation.token}`)
    }

  } catch (error) {
    console.error('❌ Error verifying memberships:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
verifyMemberships()