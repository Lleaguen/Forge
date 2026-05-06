import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RegisterSchema } from '../schemas/auth.schema'
import { register as registerApi } from '../api/auth.api'
import { notificationService } from '../shared/services/notification.service'
import { useErrorHandler } from '../shared/hooks/useErrorHandler'

export type RegisterFormValues = z.infer<typeof RegisterSchema>

export function useRegisterForm() {
  const router = useRouter()
  const { handleError } = useErrorHandler()

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) => {
      // Strip confirm fields before sending to API
      const { confirmPassword, confirmEmail, ...payload } = values
      return registerApi(payload)
    },
    onSuccess: (data) => {
      notificationService.registerSuccess()
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    },
    onError: (error) => {
      handleError(error)
    },
  })

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur', // Validate on blur for better UX
  })

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data)
  }

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  }
}
