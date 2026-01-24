'use client'
import { api } from '../shared/api/axios'

export interface Organization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationPayload {
  name: string
}

export interface UpdateOrganizationPayload {
  name?: string
}

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await api.get<Organization[]>('/organizations')
  return data
}

export async function createOrganization(payload: CreateOrganizationPayload): Promise<Organization> {
  const { data } = await api.post<Organization>('/organizations', payload)
  return data
}

export async function updateOrganization(id: string, payload: UpdateOrganizationPayload): Promise<Organization> {
  const { data } = await api.put<Organization>(`/organizations/${id}`, payload)
  return data
}

export async function deleteOrganization(id: string): Promise<void> {
  await api.delete(`/organizations/${id}`)
}
