'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login as loginApi, getMe } from '../api/auth.api'
import { notificationService } from '../shared/services/notification.service'
import { useErrorHandler } from '../shared/hooks/useErrorHandler'
import type { User, LoginCredentials } from '../types/auth.types'

// Shared query key for the current user
export const USER_QUERY_KEY = ['auth', 'me']

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  // Use React Query to manage user state globally
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getMe()
      } catch {
        return null
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      if (data.user) {
        // Update the user in the query cache immediately
        queryClient.setQueryData(USER_QUERY_KEY, data.user)
        notificationService.loginSuccess(data.user.fullName || data.user.email)
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    },
    onError: (error) => {
      handleError(error)
    }
  })

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      queryClient.setQueryData(USER_QUERY_KEY, null)
      queryClient.clear()
    },
    onSuccess: () => {
      notificationService.logoutSuccess()
      router.push('/login')
    },
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  // Helper to refresh user data (used after avatar/profile updates)
  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
  }

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout,
    refreshUser,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
