'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { TOKEN_KEY } from '../shared/api/axios'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !user && !hasToken) {
      router.replace('/login')
    }

    if (!requireAuth && user) {
      router.replace('/dashboard')
    }
  }, [user, isLoading, requireAuth, router, hasToken])

  // Mientras carga, no redirigir
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    )
  }

  if (requireAuth && !user && !hasToken) return null

  return <>{children}</>
}
