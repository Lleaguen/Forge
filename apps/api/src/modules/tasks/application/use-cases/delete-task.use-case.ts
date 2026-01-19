import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject('TaskRepository') private readonly repo: TaskRepository,
  ) {}

  async execute(id: string) {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    await this.repo.delete(id);
  }
}
