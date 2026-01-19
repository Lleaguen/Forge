import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('TaskRepository') private readonly repo: TaskRepository,
  ) {}

  async execute(input: { projectId: string; title: string; status?: string }) {
    const task = Task.create(input);
    await this.repo.create(task);
  }
}
