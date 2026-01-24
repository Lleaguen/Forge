import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '../schemas/auth.schema'
import type { z } from 'zod'
import { useLogin } from './useLogin'
import { useRouter } from 'next/navigation'

type LoginForm = z.infer<typeof LoginSchema>

export function useLoginForm() {
  const router = useRouter()
  const loginMutation = useLogin()

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: (result) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', result.accessToken)
          localStorage.setItem('refreshToken', result.refreshToken)
        }
        router.push('/dashboard')
      },
    })
  }

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
  }
}
