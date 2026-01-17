import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import { api } from '../../../shared/api/axios'
import { RegisterSchema } from '../schemas/auth.schema'

export type RegisterFormValues = z.infer<typeof RegisterSchema>

export function useRegisterForm() {
  const navigate = useNavigate()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema)
  })

  const onSubmit = async (data: RegisterFormValues) => {
    await api.post('/auth/register', data)
    navigate('/dashboard')
  }

  return {
    form,
    onSubmit
  }
}