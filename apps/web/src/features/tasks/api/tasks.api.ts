import { api } from '../../../shared/api/axios'

export const getTasksByProject = async (projectId: string) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`)
  return data
}

export const createTask = async (
  projectId: string,
  payload: { title: string; status: string }
) => {
  const { data } = await api.post(`/projects/${projectId}/tasks`, payload)
  return data
}
export const updateTask = async (
  taskId: string,
  payload: { title?: string; status?: string }
) => {
  const { data } = await api.put(`/tasks/${taskId}`, payload)
  return data
}

export const deleteTask = async (taskId: string) => {
  const { data } = await api.delete(`/tasks/${taskId}`)
  return data
}