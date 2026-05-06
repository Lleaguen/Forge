import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixInvitations() {
  console.log('🔧 Fixing invitations...')
  
  try {
    // 1. Find and remove duplicate invitations
    console.log('\n📋 1. Checking for duplicate invitations...')
    const invitations = await prisma.invitation.findMany({
      include: {
        project: {
          select: {
            name: true
          }
        },
        invitedBy: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by email + projectId
    const invitationGroups = new Map<string, any[]>()
    for (const inv of invitations) {
      const key = `${inv.email}-${inv.projectId}`
      if (!invitationGroups.has(key)) {
        invitationGroups.set(key, [])
      }
      invitationGroups.get(key)!.push(inv)
    }

    // Find duplicates
    const duplicateGroups = Array.from(invitationGroups.entries())
      .filter(([_, invs]) => invs.length > 1)

    if (duplicateGroups.length > 0) {
      console.log(`⚠️  Found ${duplicateGroups.length} groups with duplicate invitations:`)
      
      for (const [key, duplicates] of duplicateGroups) {
        console.log(`\n   📧 ${key}:`)
        console.log(`      Total invitations: ${duplicates.length}`)
        
        // Keep the first one, delete the rest
        const [keep, ...remove] = duplicates
        console.log(`      ✅ Keeping: ${keep.id} (${keep.status}) - Created: ${keep.createdAt}`)
        
        for (const inv of remove) {
          console.log(`      🗑️  Deleting: ${inv.id} (${inv.status}) - Created: ${inv.createdAt}`)
          
          // Delete associated notifications first
          await prisma.notification.deleteMany({
            where: { invitationId: inv.id }
          })
          
          // Delete invitation
          await prisma.invitation.delete({
            where: { id: inv.id }
          })
        }
      }
    } else {
      console.log('✅ No duplicate invitations found')
    }

    // 2. Find pending invitations without notifications
    console.log('\n📋 2. Checking for pending invitations without notifications...')
    const pendingInvitations = await prisma.invitation.findMany({
      where: {
        status: 'PENDING',
        invitedUserId: { not: null }
      },
      include: {
        project: {
          select: {
            name: true
          }
        },
        invitedBy: {
          select: {
            fullName: true,
            email: true
          }
        },
        invitedUser: {
          select: {
            id: true,
            email: true
          }
        },
        notifications: true
      }
    })

    const invitationsWithoutNotifications = pendingInvitations.filter(inv => inv.notifications.length === 0)

    if (invitationsWithoutNotifications.length > 0) {
      console.log(`⚠️  Found ${invitationsWithoutNotifications.length} pending invitations without notifications:`)
      
      for (const invitation of invitationsWithoutNotifications) {
        console.log(`\n   📧 ${invitation.email} → "${invitation.project?.name}"`)
        console.log(`      Creating notification...`)
        
        if (invitation.invitedUser) {
          await prisma.notification.create({
            data: {
              userId: invitation.invitedUser.id,
              type: 'PROJECT_INVITATION',
              title: 'Invitación a Proyecto',
              message: `${invitation.invitedBy?.fullName || invitation.invitedBy?.email || 'Alguien'} te ha invitado a unirte al proyecto "${invitation.project?.name || 'Proyecto'}"`,
              data: {
                projectName: invitation.project?.name,
                inviterName: invitation.invitedBy?.fullName || invitation.invitedBy?.email,
                token: invitation.token,
                actionUrl: `/invitations/${invitation.token}`
              },
              invitationId: invitation.id
            }
          })
          
          console.log(`      ✅ Notification created`)
        }
      }
    } else {
      console.log('✅ All pending invitations have notifications')
    }

    // 3. Show final state
    console.log('\n📊 Final state:')
    const finalInvitations = await prisma.invitation.findMany({
      include: {
        project: {
          select: {
            name: true
          }
        },
        notifications: true
      }
    })

    console.log(`   Total invitations: ${finalInvitations.length}`)
    for (const inv of finalInvitations) {
      console.log(`   - ${inv.email} → "${inv.project?.name}" (${inv.status}) - Notifications: ${inv.notifications.length}`)
    }

    console.log('\n✅ Invitations fixed!')

  } catch (error) {
    console.error('❌ Error fixing invitations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixInvitations()