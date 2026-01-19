import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../../domain/repositories/project.repository';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject('ProjectRepository') private readonly repo: ProjectRepository,
  ) {}

  async execute(id: string, input: { name?: string; description?: string }) {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }

    if (input.name) {
      project.updateName(input.name);
    }
    if (input.description !== undefined) {
      project.updateDescription(input.description);
    }

    await this.repo.update(project);
  }
}
