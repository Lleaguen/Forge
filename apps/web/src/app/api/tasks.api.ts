'use client'
import { api } from '../shared/api/axios'

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  priority: string
  status: string
  assigneeId?: string
  assignee?: {
    id: string
    fullName?: string
    email?: string
    avatarUrl?: string
  } | null
  createdById: string
  estimatedHours?: number
  actualHours: number
  dueDate?: string
  startedAt?: string
  completedAt?: string
  tags: string[]
  position: number
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskPayload {
  projectId: string
  title: string
  description?: string
  category: string
  priority: string
  tags: string[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  category?: string
  priority?: string
  assigneeId?: string
  estimatedHours?: number
  dueDate?: string
  tags?: string[]
  status?: string
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  try {
    const response = await api.get(`/tasks?projectId=${projectId}`)
    
    // Handle both direct array and wrapped response
    if (response.data.success) {
      return response.data.data || []
    }
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await api.post('/tasks', payload)
  return response.data.success ? response.data.data : response.data
}

export async function moveTask(taskId: string, status: string): Promise<Task> {
  const response = await api.get(`/tasks?moveTask=${taskId}&newStatus=${status}`)
  return response.data.success ? response.data.data : response.data
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
  const response = await api.patch(`/tasks/${taskId}`, payload)
  return response.data.success ? response.data.data : response.data
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`)
}
