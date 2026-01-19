import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';

@Injectable()
export class GetOrganizationsByUserUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(userId: string): Promise<Organization[]> {
    return this.repo.findByUser(userId);
  }
}
