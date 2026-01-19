import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../../domain/repositories/project.repository';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject('ProjectRepository') private readonly repo: ProjectRepository,
  ) {}

  async execute(id: string) {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    await this.repo.delete(id);
  }
}
