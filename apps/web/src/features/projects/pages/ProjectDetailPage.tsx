import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/api/axios'

export function ProjectDetailPage() {
  const { id } = useParams()

  const { data } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => (await api.get(`/projects/${id}`)).data
  })

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
