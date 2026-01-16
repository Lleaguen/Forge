import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/api/axios'

export function ProjectsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await api.get('/projects')).data
  })

  if (isLoading) return null

  return (
    <ul>
      {data.map((p: any) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}
