'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!isLoading && !hasRedirected.current) {
      if (requireAuth && !user && pathname !== '/login') {
        // Only redirect to login if not already on login page
        hasRedirected.current = true
        router.replace('/login')
      } else if (!requireAuth && user && (pathname === '/login' || pathname === '/register')) {
        // Only redirect to dashboard if on auth pages
        hasRedirected.current = true
        router.replace('/dashboard')
      }
    }
  }, [user, isLoading, requireAuth, router, pathname])

  // Reset redirect flag when user state changes
  useEffect(() => {
    hasRedirected.current = false
  }, [user])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    )
  }

  // Always render children for login/register pages to allow form submission
  if (!requireAuth) {
    return <>{children}</>
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}