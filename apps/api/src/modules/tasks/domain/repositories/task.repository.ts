import { Task } from '../entities/task.entity';

export interface TaskRepository {
  create(task: Task): Promise<void>;
  findByProject(projectId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
