import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function comprehensiveTest() {
  console.log('🔍 COMPREHENSIVE APPLICATION TEST')
  console.log('=' .repeat(80))
  
  try {
    // 1. TEST USERS
    console.log('\n📋 1. TESTING USERS')
    console.log('-'.repeat(80))
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    })
    console.log(`✅ Found ${users.length} users:`)
    users.forEach(u => console.log(`   - ${u.email} (${u.fullName}) - Role: ${u.role}`))

    // 2. TEST ORGANIZATIONS
    console.log('\n📋 2. TESTING ORGANIZATIONS')
    console.log('-'.repeat(80))
    const organizations = await prisma.organization.findMany({
      include: {
        projects: {
          select: {
            id: true,
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
    console.log(`✅ Found ${organizations.length} organizations:`)
    organizations.forEach(org => {
      console.log(`\n   🏢 ${org.name} (ID: ${org.id})`)
      console.log(`      Projects: ${org.projects.length}`)
      org.projects.forEach(p => console.log(`        - ${p.name}`))
      console.log(`      Members: ${org.memberships.length}`)
      org.memberships.forEach(m => console.log(`        - ${m.user.email} (${m.role})`))
    })

    // 3. TEST PROJECTS
    console.log('\n📋 3. TESTING PROJECTS')
    console.log('-'.repeat(80))
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        organization: {
          select: {
            name: true
          }
        },
        tasks: true
      }
    })
    console.log(`✅ Found ${projects.length} projects:`)
    projects.forEach(p => {
      console.log(`\n   📁 ${p.name} (ID: ${p.id})`)
      console.log(`      Owner: ${p.user.email}`)
      console.log(`      Organization: ${p.organization?.name}`)
      console.log(`      Tasks: ${p.tasks.length}`)
    })

    // 4. TEST PROJECT ACCESS FOR EACH USER
    console.log('\n📋 4. TESTING PROJECT ACCESS')
    console.log('-'.repeat(80))
    for (const user of users) {
      console.log(`\n   👤 ${user.email}:`)
      
      // Get projects user can access
      const accessibleProjects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: user.id },
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
          }
        }
      })
      
      console.log(`      Can access ${accessibleProjects.length} projects:`)
      accessibleProjects.forEach(p => {
        const isOwner = p.userId === user.id
        console.log(`        ${isOwner ? '👑' : '👥'} ${p.name} (${p.organization?.name})`)
      })
    }

    // 5. TEST TASKS
    console.log('\n📋 5. TESTING TASKS')
    console.log('-'.repeat(80))
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          select: {
            name: true
          }
        },
        createdBy: {
          select: {
            email: true
          }
        }
      }
    })
    console.log(`✅ Found ${tasks.length} tasks:`)
    tasks.forEach(t => {
      console.log(`   - "${t.title}" in ${t.project.name} by ${t.createdBy.email} (${t.status})`)
    })

    // 6. TEST TASK ACCESS FOR EACH USER
    console.log('\n📋 6. TESTING TASK ACCESS')
    console.log('-'.repeat(80))
    for (const user of users) {
      console.log(`\n   👤 ${user.email}:`)
      
      // Get all projects user can access
      const userProjects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: user.id },
            {
              organization: {
                memberships: {
                  some: { userId: user.id }
                }
              }
            }
          ]
        },
        select: {
          id: true,
          name: true
        }
      })
      
      // Get tasks from those projects
      const projectIds = userProjects.map(p => p.id)
      const userTasks = await prisma.task.findMany({
        where: {
          projectId: { in: projectIds }
        },
        include: {
          project: {
            select: {
              name: true
            }
          },
          createdBy: {
            select: {
              email: true
            }
          }
        }
      })
      
      console.log(`      Can see ${userTasks.length} tasks across ${userProjects.length} projects:`)
      userProjects.forEach(p => {
        const projectTasks = userTasks.filter(t => t.projectId === p.id)
        console.log(`        📁 ${p.name}: ${projectTasks.length} tasks`)
        projectTasks.forEach(t => {
          console.log(`           - "${t.title}" by ${t.createdBy.email}`)
        })
      })
    }

    // 7. TEST INVITATIONS
    console.log('\n📋 7. TESTING INVITATIONS')
    console.log('-'.repeat(80))
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
        },
        invitedUser: {
          select: {
            email: true
          }
        }
      }
    })
    console.log(`✅ Found ${invitations.length} invitations:`)
    invitations.forEach(inv => {
      console.log(`   - ${inv.email} invited to "${inv.project?.name}" by ${inv.invitedBy?.email}`)
      console.log(`     Status: ${inv.status}, Expires: ${inv.expiresAt.toLocaleDateString()}`)
    })

    // 8. TEST NOTIFICATIONS
    console.log('\n📋 8. TESTING NOTIFICATIONS')
    console.log('-'.repeat(80))
    const notifications = await prisma.notification.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })
    console.log(`✅ Found ${notifications.length} notifications:`)
    notifications.forEach(n => {
      console.log(`   - ${n.user.email}: "${n.title}" (${n.type}) - Read: ${n.isRead}`)
    })

    // 9. SUMMARY
    console.log('\n📋 9. SUMMARY')
    console.log('='.repeat(80))
    console.log(`✅ Users: ${users.length}`)
    console.log(`✅ Organizations: ${organizations.length}`)
    console.log(`✅ Projects: ${projects.length}`)
    console.log(`✅ Tasks: ${tasks.length}`)
    console.log(`✅ Invitations: ${invitations.length}`)
    console.log(`✅ Notifications: ${notifications.length}`)

    // 10. ISSUES CHECK
    console.log('\n📋 10. CHECKING FOR ISSUES')
    console.log('='.repeat(80))
    
    // Check for organizations with multiple projects
    const orgsWithMultipleProjects = organizations.filter(o => o.projects.length > 1)
    if (orgsWithMultipleProjects.length > 0) {
      console.log(`⚠️  WARNING: ${orgsWithMultipleProjects.length} organizations have multiple projects:`)
      orgsWithMultipleProjects.forEach(o => {
        console.log(`   - ${o.name}: ${o.projects.length} projects`)
      })
    } else {
      console.log(`✅ All organizations have at most 1 project (correct isolation)`)
    }
    
    // Check for orphan organizations
    const orphanOrgs = organizations.filter(o => o.projects.length === 0)
    if (orphanOrgs.length > 0) {
      console.log(`⚠️  WARNING: ${orphanOrgs.length} orphan organizations (no projects):`)
      orphanOrgs.forEach(o => console.log(`   - ${o.name}`))
    } else {
      console.log(`✅ No orphan organizations`)
    }
    
    // Check for duplicate memberships
    const membershipGroups = new Map<string, number>()
    for (const org of organizations) {
      for (const membership of org.memberships) {
        const key = `${membership.userId}-${org.id}`
        membershipGroups.set(key, (membershipGroups.get(key) || 0) + 1)
      }
    }
    const duplicates = Array.from(membershipGroups.entries()).filter(([_, count]) => count > 1)
    if (duplicates.length > 0) {
      console.log(`⚠️  WARNING: ${duplicates.length} duplicate memberships found`)
    } else {
      console.log(`✅ No duplicate memberships`)
    }

    console.log('\n' + '='.repeat(80))
    console.log('✅ COMPREHENSIVE TEST COMPLETED')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ Error during comprehensive test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
comprehensiveTest()