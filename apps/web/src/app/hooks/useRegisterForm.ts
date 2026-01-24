import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { RegisterSchema } from '../schemas/auth.schema'
import { register as registerApi } from '../api/auth.api'

export type RegisterFormValues = z.infer<typeof RegisterSchema>

export function useRegisterForm() {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: (registerFormValues: RegisterFormValues) => {
      const { confirmPassword, ...payload } = registerFormValues
      return registerApi(payload)
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
      }
      router.push('/dashboard')
    },
  })

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    mutation.mutate(data)
  }

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
  }
}