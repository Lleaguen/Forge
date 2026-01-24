'use client'
import { api } from '../shared/api/axios'

export interface Task {
  id: string
  title: string
  status?: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskPayload {
  projectId: string
  title: string
  status?: string
}

export interface UpdateTaskPayload {
  title?: string
  status?: string
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const { data } = await api.get<Task[]>(`/tasks?projectId=${projectId}`)
  return data
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', payload)
  return data
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${taskId}`, payload)
  return data
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`)
}
