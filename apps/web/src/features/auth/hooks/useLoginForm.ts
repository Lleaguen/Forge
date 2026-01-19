import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '../schemas/auth.schema'
import type { z } from 'zod'
import { useLogin } from './useLogin'
import { useNavigate } from 'react-router-dom'

type LoginForm = z.infer<typeof LoginSchema>

export function useLoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    const result = await loginMutation.mutateAsync(data)
    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)

    navigate('/dashboard')
  }

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending
  }
}
