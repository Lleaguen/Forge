import { useQuery } from '@tanstack/react-query'
import { api } from '../../../shared/api/axios'

export function DashboardHomePage() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/dashboard')).data
  })

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
