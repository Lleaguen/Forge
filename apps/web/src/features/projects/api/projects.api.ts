import { api } from '../../../shared/api/axios'

export const getProjects = async () => {
  const { data } = await api.get('/projects')
  return data
}

export const getProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`)
  return data
}

export const createProject = async (payload: { name: string }) => {
  const { data } = await api.post('/projects', payload)
  return data
}
