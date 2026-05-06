export interface CreateTaskFormData {
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  tags: string[]
}

export interface CreateTaskModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export interface TaskFormProps {
  projectId: string
  onSuccess: () => void
  onClose: () => void
}

export enum TaskCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  DESIGN = 'DESIGN',
  ARCHITECTURE = 'ARCHITECTURE',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  RESEARCH = 'RESEARCH',
  DEPLOYMENT = 'DEPLOYMENT',
  MAINTENANCE = 'MAINTENANCE',
  PLANNING = 'PLANNING',
  REVIEW = 'REVIEW',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export interface TaskCategoryOption {
  value: TaskCategory
  label: string
  description: string
}

export interface TaskPriorityOption {
  value: TaskPriority
  label: string
  color: string
  description: string
}