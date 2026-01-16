import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, ProjectSchema } from '../schemas/project.schema'
import { api } from '../../../shared/api/axios'
import { useNavigate } from 'react-router-dom'

export function NewProjectPage() {
  const navigate = useNavigate()
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema)
  })

  const onSubmit = async (data: ProjectSchema) => {
    await api.post('/projects', data)
    navigate('/dashboard/projects')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      <button type="submit">Create Project</button>
    </form>
  )
}
