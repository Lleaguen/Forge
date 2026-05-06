import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/modules/auth/infrastructure/security/jwt-auth.guard'
import { ResponseUtil } from '@/shared/utils/response.util'
import { PrismaService } from '@/shared/database/prisma.service'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getUserNotifications(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string
  ) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId: req.user.sub,
          ...(unreadOnly === 'true' ? { isRead: false } : {})
        },
        include: {
          invitation: {
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
                  fullName: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit ? parseInt(limit) : 50
      })

      return ResponseUtil.success(notifications)
    } catch (error) {
      return ResponseUtil.error('Failed to fetch notifications')
    }
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId: req.user.sub,
          isRead: false
        }
      })

      return ResponseUtil.success({ count })
    } catch (error) {
      return ResponseUtil.error('Failed to get unread count')
    }
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string, @Request() req: any) {
    try {
      const notification = await this.prisma.notification.update({
        where: {
          id: notificationId,
          userId: req.user.sub // Ensure user owns this notification
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return ResponseUtil.success(notification, 'Notification marked as read')
    } catch (error) {
      return ResponseUtil.error('Failed to mark notification as read')
    }
  }

  @Post('mark-all-read')
  async markAllAsRead(@Request() req: any) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          userId: req.user.sub,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return ResponseUtil.success({ count: result.count }, 'All notifications marked as read')
    } catch (error) {
      return ResponseUtil.error('Failed to mark all notifications as read')
    }
  }

  @Get('sync-invitations')
  async syncInvitationNotifications(@Request() req: any) {
    try {
      // Find pending invitations for the current user that don't have notifications
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.sub }
      })

      if (!user) {
        return ResponseUtil.error('User not found')
      }

      // Find invitations for this user's email that don't have notifications
      const invitations = await this.prisma.invitation.findMany({
        where: {
          email: user.email,
          status: 'PENDING',
          notifications: {
            none: {}
          }
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
          }
        }
      })

      let created = 0
      for (const invitation of invitations) {
        await this.prisma.notification.create({
          data: {
            userId: req.user.sub,
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
        created++
      }

      return ResponseUtil.success({ created }, `Synced ${created} invitation notifications`)
    } catch (error) {
      return ResponseUtil.error('Failed to sync notifications')
    }
  }
}