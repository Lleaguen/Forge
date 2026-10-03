'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { TOKEN_KEY } from '../shared/api/axios'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)

  // Verificar si hay token en localStorage (para mobile cross-domain)
  const hasLocalToken = typeof window !== 'undefined'
    ? !!localStorage.getItem(TOKEN_KEY)
    : false

  useEffect(() => {
    if (!isLoading && !hasRedirected.current) {
      if (requireAuth && !user && !hasLocalToken && pathname !== '/login') {
        hasRedirected.current = true
        router.replace('/login')
      } else if (!requireAuth && user && (pathname === '/login' || pathname === '/register')) {
        hasRedirected.current = true
        router.replace('/dashboard')
      }
    }
  }, [user, isLoading, requireAuth, router, pathname, hasLocalToken])

  useEffect(() => {
    hasRedirected.current = false
  }, [user])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!requireAuth) {
    return <>{children}</>
  }

  // Permitir acceso si hay user en cache O si hay token en localStorage (mobile)
  if (requireAuth && !user && !hasLocalToken) {
    return null
  }

  return <>{children}</>
}
