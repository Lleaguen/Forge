export interface KanbanColumn {
  id: string
  title: string
  status: string
  color?: string
  position: number
  projectId: string
  isDefault?: boolean
}

export interface CreateColumnPayload {
  title: string
  status: string
  color?: string
  position: number
  projectId: string
}

export interface UpdateColumnPayload {
  title?: string
  color?: string
  position?: number
}