'use client'
import { api } from '../shared/api/axios'

export interface Project {
  id: string
  userId: string
  user?: { id: string; email: string }
  name: string
  description?: string
  createdAt: string
  updatedAt?: string // Optional since backend might not have it
  organization?: { id: string; name: string } | null
}
export interface CreateProjectPayload {
  name: string
  description?: string
}

export interface UpdateProjectPayload {
  name?: string
  description?: string
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get('/projects')
  return response.data.data || []
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const response = await api.post('/projects', payload)
  return response.data.data
}

export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
  const response = await api.put(`/projects/${id}`, payload)
  return response.data.data
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`)
}