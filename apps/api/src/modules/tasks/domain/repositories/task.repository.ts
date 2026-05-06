import { Task } from '../entities/task.entity'

export const TASK_REPOSITORY = Symbol('TaskRepository')

export interface TaskRepository {
  save(task: Task): Promise<void>
  findById(id: string): Promise<Task | null>
  findByProjectId(projectId: string): Promise<Task[]>
  delete(id: string): Promise<void>
}