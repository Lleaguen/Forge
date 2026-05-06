'use client'

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { notificationService } from '../shared/services/notification.service'

// Types
interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys?: string[][] | ((data: TData, variables: TVariables) => string[][])
  successMessage?: string | ((data: TData, variables: TVariables) => string)
  errorMessage?: string
  redirectTo?: string
  onSuccessCallback?: (data: TData, variables: TVariables) => void
  onErrorCallback?: (error: any) => void
}

/**
 * Generic mutation hook that handles common patterns:
 * - Query invalidation
 * - Success/error notifications
 * - Navigation after success
 * - Custom callbacks
 */
export function useGenericMutation<TData = unknown, TVariables = void>({
  mutationFn,
  invalidateKeys = [],
  successMessage,
  errorMessage,
  redirectTo,
  onSuccessCallback,
  onErrorCallback,
}: MutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate queries
      const keysToInvalidate = typeof invalidateKeys === 'function' 
        ? invalidateKeys(data, variables)
        : invalidateKeys

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })

      // Show success notification
      if (successMessage) {
        const message = typeof successMessage === 'function'
          ? successMessage(data, variables)
          : successMessage
        notificationService.success(message)
      }

      // Navigate if needed
      if (redirectTo) {
        router.push(redirectTo)
      }

      // Custom callback
      if (onSuccessCallback) {
        onSuccessCallback(data, variables)
      }
    },
    onError: (error: any) => {
      // Show error notification
      const message = error.response?.data?.message || errorMessage || 'An error occurred'
      notificationService.error(message)

      // Custom callback
      if (onErrorCallback) {
        onErrorCallback(error)
      }
    },
  })
}

/**
 * Specialized mutation hooks for common CRUD operations
 */

// Create operation
export function useCreateMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  entityName: string,
  invalidateKeys: string[][],
  redirectTo?: string
) {
  return useGenericMutation({
    mutationFn,
    invalidateKeys,
    successMessage: notificationService.getCreateMessage(entityName),
    redirectTo,
  })
}

// Update operation
export function useUpdateMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  entityName: string,
  invalidateKeys: string[][]
) {
  return useGenericMutation({
    mutationFn,
    invalidateKeys,
    successMessage: notificationService.getUpdateMessage(entityName),
  })
}

// Delete operation
export function useDeleteMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  entityName: string,
  invalidateKeys: string[][],
  redirectTo?: string
) {
  return useGenericMutation({
    mutationFn,
    invalidateKeys,
    successMessage: notificationService.getDeleteMessage(entityName),
    redirectTo,
  })
}
