'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login as loginApi } from '../api/auth.api'
import type { User, LoginCredentials } from '../types/auth.types'

const USER_STORAGE_KEY = 'user'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error('Error parsing stored user:', e)
          localStorage.removeItem(USER_STORAGE_KEY)
        }
      }
      setIsLoading(false)
    }
  }, [])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
        setUser(data.user)
      }
      router.push('/dashboard')
    },
  })

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem(USER_STORAGE_KEY)
        setUser(null)
      }
      queryClient.clear()
    },
    onSuccess: () => {
      router.push('/login')
    },
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
