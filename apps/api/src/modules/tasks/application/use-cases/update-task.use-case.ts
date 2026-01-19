import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject('TaskRepository') private readonly repo: TaskRepository,
  ) {}

  async execute(id: string, input: { title?: string; status?: string }) {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (input.title) {
      task.updateTitle(input.title);
    }
    if (input.status) {
      task.updateStatus(input.status);
    }

    await this.repo.update(task);
  }
}
