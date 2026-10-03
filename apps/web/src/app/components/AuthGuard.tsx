'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { TOKEN_KEY } from '../shared/api/axios'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

function getLocalToken(): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  } catch {
    return null
  }
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)
  const [localToken, setLocalToken] = useState<string | null>(null)
  const [tokenChecked, setTokenChecked] = useState(false)

  // Leer localStorage solo en el cliente (evita hydration mismatch en Safari)
  useEffect(() => {
    setLocalToken(getLocalToken())
    setTokenChecked(true)
  }, [])

  useEffect(() => {
    if (!tokenChecked) return
    if (!isLoading && !hasRedirected.current) {
      const isAuthed = !!user || !!localToken
      if (requireAuth && !isAuthed && pathname !== '/login') {
        hasRedirected.current = true
        router.replace('/login')
      } else if (!requireAuth && !!user && (pathname === '/login' || pathname === '/register')) {
        hasRedirected.current = true
        router.replace('/dashboard')
      }
    }
  }, [user, isLoading, requireAuth, router, pathname, localToken, tokenChecked])

  useEffect(() => {
    hasRedirected.current = false
    setLocalToken(getLocalToken())
  }, [user])

  // Mostrar spinner mientras carga auth o mientras verificamos localStorage
  if (isLoading || !tokenChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    )
  }

  if (!requireAuth) {
    return <>{children}</>
  }

  if (requireAuth && !user && !localToken) {
    return null
  }

  return <>{children}</>
}
