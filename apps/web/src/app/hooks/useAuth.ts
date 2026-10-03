'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login as loginApi, getMe } from '../api/auth.api'
import { notificationService } from '../shared/services/notification.service'
import { useErrorHandler } from '../shared/hooks/useErrorHandler'
import type { User, LoginCredentials } from '../types/auth.types'
import { TOKEN_KEY } from '../shared/api/axios'

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
        // Si falla getMe, limpiar el token inválido
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY)
        }
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    // Si ya hay token en localStorage, asumir autenticado mientras carga
    initialData: () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY)
        // Retornar undefined para que ejecute queryFn, pero no null (null = no autenticado)
        return token ? undefined : undefined
      }
      return undefined
    },
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      if (data.user) {
        // Guardar token en localStorage para mobile (cross-domain cookies bloqueadas)
        if (typeof window !== 'undefined' && data.accessToken) {
          localStorage.setItem(TOKEN_KEY, data.accessToken)
        }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
      }
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
