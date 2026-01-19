import { Inject, Injectable } from '@nestjs/common';
import type { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class GetProjectsByOrganizationUseCase {
  constructor(
    @Inject('ProjectRepository') private readonly repo: ProjectRepository,
  ) {}

  async execute(organizationId: string): Promise<Project[]> {
    return this.repo.findByOrganization(organizationId);
  }
}
