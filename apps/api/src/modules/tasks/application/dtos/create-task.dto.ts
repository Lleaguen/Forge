export interface CreateTaskDto {
  projectId: string
  title: string
  description?: string
  category: string
  priority: string
  tags: string[]
}