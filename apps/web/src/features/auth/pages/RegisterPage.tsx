import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {  RegisterSchema } from '../schemas/auth.schema'
import { api } from '../../../shared/api/axios'
import { useNavigate } from 'react-router-dom'

export function RegisterPage() {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(RegisterSchema)  // Usa el esquema de Register
  })

  const onSubmit = async (data: any) => {
    await api.post('/auth/register', data)
    navigate('/onboarding/organization')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      <input type="password" {...form.register('password')} />
      <button type="submit">Register</button>
    </form>
  )
}
