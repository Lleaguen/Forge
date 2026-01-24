'use client'
import { api } from '../shared/api/axios'

export interface Project {
  id: string
  name: string
  description?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectPayload {
  organizationId: string
  name: string
  description?: string
}

export interface UpdateProjectPayload {
  name?: string
  description?: string
}

export async function getProjects(organizationId: string): Promise<Project[]> {
  const { data } = await api.get<Project[]>(`/projects?organizationId=${organizationId}`)
  return data
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>('/projects', payload)
  return data
}

export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
  const { data } = await api.put<Project>(`/projects/${id}`, payload)
  return data
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`)
}
