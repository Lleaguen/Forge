import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject('ProjectRepository') private readonly repo: ProjectRepository,
  ) {}

 async execute(input: {
  userId: string;
  organizationId?: string;
  name: string;
  description?: string;
}) {
  const project = Project.create({
    userId: input.userId,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
  });

  await this.repo.create(project);
}
}
