import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import type { z } from 'zod'

import { LoginSchema } from '../schemas/auth.schema'
import { api } from '../../../shared/api/axios'

export type LoginFormValues = z.infer<typeof LoginSchema>

export function useLoginForm() {
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: LoginFormValues) => {
    await api.post('/auth/login', data)
    navigate('/dashboard')
  }

  return {
    form,
    onSubmit
  }
}
