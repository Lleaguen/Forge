'use client'
import { api } from '../shared/api/axios'

export interface Notification {
  id: string
  userId: string
  type: 'PROJECT_INVITATION' | 'TASK_ASSIGNED' | 'TASK_COMPLETED' | 'PROJECT_UPDATE' | 'SYSTEM_ANNOUNCEMENT'
  title: string
  message: string
  data?: any
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
  invitation?: {
    id: string
    token: string
    project?: {
      name: string
    }
    organization?: {
      name: string
    }
    invitedBy?: {
      fullName?: string
      email: string
    }
  }
}

export async function getUserNotifications(limit?: number, unreadOnly?: boolean): Promise<Notification[]> {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  if (unreadOnly) params.append('unreadOnly', 'true')
  
  const response = await api.get(`/notifications?${params.toString()}`)
  return response.data.success ? response.data.data : response.data
}

export async function getUnreadNotificationsCount(): Promise<{ count: number }> {
  const response = await api.get('/notifications/unread-count')
  return response.data.success ? response.data.data : response.data
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  const response = await api.patch(`/notifications/${notificationId}/read`)
  return response.data.success ? response.data.data : response.data
}

export async function markAllNotificationsAsRead(): Promise<{ count: number }> {
  const response = await api.post('/notifications/mark-all-read')
  return response.data.success ? response.data.data : response.data
}

// Debug functions - remove in production
export async function createTestNotification(type?: string): Promise<Notification> {
  const url = type ? `/notifications/debug/create-test?type=${type}` : '/notifications/debug/create-test'
  const response = await api.post(url)
  return response.data.success ? response.data.data : response.data
}

export async function getAllNotificationsDebug(): Promise<Notification[]> {
  const response = await api.get('/notifications/debug/all')
  return response.data.success ? response.data.data : response.data
}

export async function getNotificationsByEmail(email: string): Promise<any> {
  const response = await api.get(`/notifications/debug/user/${email}`)
  return response.data.success ? response.data.data : response.data
}

export async function createMissingNotifications(): Promise<any> {
  const response = await api.post('/notifications/debug/create-missing-notifications')
  return response.data.success ? response.data.data : response.data
}

export async function getExistingInvitations(): Promise<any> {
  const response = await api.get('/notifications/debug/invitations')
  return response.data.success ? response.data.data : response.data
}