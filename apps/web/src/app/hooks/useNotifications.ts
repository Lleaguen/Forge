'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notifications.api'
import { api } from '../shared/api/axios'
import { notificationService } from '../shared/services/notification.service'

export function useNotifications(limit?: number, unreadOnly?: boolean, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['notifications', limit, unreadOnly],
    queryFn: async () => {
      // First sync any missing invitation notifications
      try {
        await api.get('/notifications/sync-invitations')
      } catch (error) {
        // Ignore sync errors, continue with normal flow
      }
      
      // Then fetch notifications normally
      const result = await getUserNotifications(limit, unreadOnly)
      return result
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: options?.enabled ?? true,
  })
}

export function useUnreadNotificationsCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadNotificationsCount,
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: options?.enabled ?? true,
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      notificationService.success('All notifications marked as read.')
    },
  })
}