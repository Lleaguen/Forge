'use client'
import { api } from '../shared/api/axios'

export interface Activity {
  id: string
  type: 'task_moved' | 'task_created' | 'task_updated' | 'comment_added' | 'project_created' | 'project_updated'
  user: {
    id: string
    fullName: string
    avatarUrl?: string
  }
  action: string
  highlight: string
  target?: string
  projectId?: string
  taskId?: string
  createdAt: string
}

export async function getActivities(projectId?: string): Promise<Activity[]> {
  const url = projectId ? `/activities?projectId=${projectId}` : '/activities'
  const response = await api.get(url)
  return response.data.data || [] // Handle the nested data structure
}

export async function getDashboardStats(): Promise<{
  activeProjects: number
  pendingTasks: number
  teamMembers: number
  activityToday: number
}> {
  const response = await api.get('/dashboard/stats')
  return response.data.data || {} // Handle the nested data structure
}