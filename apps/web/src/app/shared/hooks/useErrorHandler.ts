'use client'

import { useCallback, useRef } from 'react'
import { notificationService } from '../services/notification.service'
import { AxiosError } from 'axios'

interface ApiError {
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
  method: string
  errors?: string[]
}

export function useErrorHandler() {
  const isHandlingError = useRef(false)

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    // Prevent multiple error handling calls during render
    if (isHandlingError.current) {
      return
    }

    // Use setTimeout to ensure error handling happens outside of render cycle
    setTimeout(() => {
      isHandlingError.current = true
      
      try {
        if (error instanceof AxiosError) {
          const apiError = error.response?.data as ApiError
          const status = error.response?.status || 500
          const context = apiError?.path || ''
          const backendMessage = apiError?.message

          // Special handling for 401 errors to prevent loops
          if (status === 401) {
            if (!context.includes('/auth/login') && !context.includes('/auth/me')) {
              // Session expired - not a login attempt
              notificationService.sessionExpired()
              setTimeout(() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/login'
                }
              }, 1000)
            } else if (context.includes('/auth/login')) {
              // Show the exact message from the backend
              notificationService.error(backendMessage || 'Invalid credentials')
            }
            return
          }

          // For all other errors, show the backend message if available
          if (backendMessage) {
            notificationService.error(backendMessage)
          } else {
            notificationService.handleHttpError(status, customMessage, context)
          }
        } else if (error instanceof Error) {
          notificationService.error(error.message || customMessage || 'An unexpected error occurred.')
        } else {
          notificationService.error(customMessage || 'An unexpected error occurred.')
        }
      } finally {
        isHandlingError.current = false
      }
    }, 0)
  }, [])

  const handleSuccess = useCallback((message: string) => {
    notificationService.success(message)
  }, [])

  const handleInfo = useCallback((message: string) => {
    notificationService.info(message)
  }, [])

  const handleWarning = useCallback((message: string) => {
    notificationService.warning(message)
  }, [])

  return {
    handleError,
    handleSuccess,
    handleInfo,
    handleWarning,
  }
}