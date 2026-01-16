import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/api/axios'

export function ProjectTasksPage() {
  const { id } = useParams()

  const { data } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => (await api.get(`/projects/${id}/tasks`)).data
  })

  return (
    <ul>
      {data?.map((t: any) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  )
}
