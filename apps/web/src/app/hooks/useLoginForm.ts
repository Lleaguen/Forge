import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '../schemas/auth.schema'
import type { z } from 'zod'
import { useAuth } from './useAuth' // Usar useAuth en lugar de useLogin directo

type LoginForm = z.infer<typeof LoginSchema>

export function useLoginForm() {
  const { login, isLoggingIn } = useAuth() // Usar el hook centralizado

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = (data: LoginForm) => {
    login(data)
  }

  return {
    form,
    onSubmit,
    isLoading: isLoggingIn,
  }
}
