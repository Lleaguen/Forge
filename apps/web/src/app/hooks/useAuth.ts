'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login as loginApi, getMe, logout as logoutApi } from '../api/auth.api'
import { notificationService } from '../shared/services/notification.service'
import { useErrorHandler } from '../shared/hooks/useErrorHandler'
import type { User, LoginCredentials } from '../types/auth.types'
import { TOKEN_KEY } from '../shared/api/axios'
import { AxiosError } from 'axios'

export const USER_QUERY_KEY = ['auth', 'me']

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getMe()
      } catch (err) {
        // Solo limpiar token si es 401 (token inválido/expirado)
        // No limpiar si es error de red (offline, servidor caído)
        const status = (err as AxiosError)?.response?.status
        if (status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY)
        }
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      if (data.user) {
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

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
      }
      // Llamar al backend para limpiar la cookie (best-effort)
      try { await logoutApi() } catch {}
      queryClient.setQueryData(USER_QUERY_KEY, null)
      queryClient.clear()
    },
    onSuccess: () => {
      notificationService.logoutSuccess()
      router.push('/login')
    },
  })

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: () => logoutMutation.mutate(),
    refreshUser: () => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY }),
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
