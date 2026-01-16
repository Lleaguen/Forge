import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { organizationSchema } from '../schema/organization.schema' 
import { api } from '../../../shared/api/axios'
import { useNavigate } from 'react-router-dom'

export function OrganizationOnboardingPage() {
  const navigate = useNavigate()
  
  const form = useForm({
    resolver: zodResolver(organizationSchema)
  })

  const onSubmit = async (data: z.infer<typeof organizationSchema>) => {
    await api.post('/organizations', data)
    navigate('/dashboard')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      <button type="submit">Create Organization</button>
    </form>
  )
}
