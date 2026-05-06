import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/shared/database/prisma.service'

export interface CreateNotificationData {
  userId: string
  type: 'PROJECT_INVITATION' | 'TASK_ASSIGNED' | 'TASK_COMPLETED' | 'PROJECT_UPDATE' | 'SYSTEM_ANNOUNCEMENT'
  title: string
  message: string
  data?: any
  invitationId?: string
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(data: CreateNotificationData) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data || {},
          invitationId: data.invitationId
        }
      })

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  async createProjectInvitationNotification(
    userId: string, 
    invitationId: string, 
    projectName: string, 
    inviterName: string,
    token: string
  ) {
    return this.createNotification({
      userId,
      type: 'PROJECT_INVITATION',
      title: 'Invitación a Proyecto',
      message: `${inviterName} te ha invitado a unirte al proyecto "${projectName}"`,
      data: {
        projectName,
        inviterName,
        token,
        actionUrl: `/invitations/${token}`
      },
      invitationId
    })
  }

  async createTaskAssignedNotification(
    userId: string,
    taskTitle: string,
    projectName: string,
    assignedBy: string
  ) {
    return this.createNotification({
      userId,
      type: 'TASK_ASSIGNED',
      title: 'Nueva Tarea Asignada',
      message: `${assignedBy} te ha asignado la tarea "${taskTitle}" en el proyecto "${projectName}"`,
      data: {
        taskTitle,
        projectName,
        assignedBy
      }
    })
  }
}