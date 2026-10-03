'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'true') {
      // OAuth exitoso — la cookie ya fue seteada por el backend
      // Redirigir al dashboard
      router.replace('/dashboard')
    } else {
      // Algo salió mal
      router.replace(`/login?error=${error || 'oauth_failed'}`)
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Iniciando sesión...</p>
      </div>
    </div>
  )
}
