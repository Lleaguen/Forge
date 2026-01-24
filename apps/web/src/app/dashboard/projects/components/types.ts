export type TaskStatus = string
export type ProjectView = 'board' | 'settings'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  label: string
  dueDate: string
  comments: number
}

export interface Column {
  id: string
  title: string
  status: TaskStatus
}
