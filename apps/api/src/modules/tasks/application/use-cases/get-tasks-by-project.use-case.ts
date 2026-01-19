import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class GetTasksByProjectUseCase {
  constructor(
    @Inject('TaskRepository') private readonly repo: TaskRepository,
  ) {}

  async execute(projectId: string): Promise<Task[]> {
    return this.repo.findByProject(projectId);
  }
}
