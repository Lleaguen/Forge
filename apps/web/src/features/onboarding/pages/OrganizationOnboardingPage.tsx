import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { organizationSchema, OrganizationSchema } from '../schemas/organization.schema'
import { api } from '../../../shared/api/axios'
import { useNavigate } from 'react-router-dom'

export function OrganizationOnboardingPage() {
  const navigate = useNavigate()
  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema)
  })

  const onSubmit = async (data: OrganizationSchema) => {
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
