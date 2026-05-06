'use client'

import React, { useState } from 'react'
import { FiBell, FiCheck, FiCheckCircle, FiX, FiUsers, FiFileText } from 'react-icons/fi'
import { useNotifications, useUnreadNotificationsCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/app/hooks/useNotifications'
import { useAcceptInvitation, useRejectInvitation } from '@/app/hooks/useMembers'
import { useAuth } from '@/app/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const { data: notifications, isLoading } = useNotifications(20, false, { enabled: isAuthenticated })
  const { data: unreadCount } = useUnreadNotificationsCount({ enabled: isAuthenticated })
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()
  const acceptInvitationMutation = useAcceptInvitation()
  const rejectInvitationMutation = useRejectInvitation()

  if (!isAuthenticated) return null

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id)
    }
  }

  const handleAcceptInvitation = (token: string, notificationId: string) => {
    acceptInvitationMutation.mutate(token, {
      onSuccess: () => {
        markAsReadMutation.mutate(notificationId)
        setIsOpen(false)
      }
    })
  }

  const handleRejectInvitation = (token: string, notificationId: string) => {
    rejectInvitationMutation.mutate(token, {
      onSuccess: () => {
        markAsReadMutation.mutate(notificationId)
      }
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_INVITATION':
        return <FiUsers className="h-4 w-4 text-blue-600" />
      case 'TASK_ASSIGNED':
        return <FiFileText className="h-4 w-4 text-green-600" />
      default:
        return <FiBell className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <FiBell size={20} />
        {unreadCount && unreadCount.count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount.count > 9 ? '9+' : unreadCount.count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount && unreadCount.count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsReadMutation.mutate()}
                    loading={markAllAsReadMutation.isPending}
                  >
                    <FiCheckCircle size={14} />
                    Mark all read
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-slate-500">Loading notifications...</div>
              ) : !notifications || notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <FiBell className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                {notification.message}
                              </p>
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                            </div>

                            {!notification.isRead && (
                              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>

                          {/* Invitation Actions */}
                          {notification.type === 'PROJECT_INVITATION' && !notification.isRead && (
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const token = notification.invitation?.token || notification.data?.token
                                  if (token) handleAcceptInvitation(token, notification.id)
                                }}
                                loading={acceptInvitationMutation.isPending}
                              >
                                <FiCheck size={14} />
                                Accept
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const token = notification.invitation?.token || notification.data?.token
                                  if (token) handleRejectInvitation(token, notification.id)
                                }}
                                loading={rejectInvitationMutation.isPending}
                              >
                                <FiX size={14} />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  )
}
