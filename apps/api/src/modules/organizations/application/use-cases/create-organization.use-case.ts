import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(input: { name: string }) {
    const organization = Organization.create(input);
    await this.repo.create(organization);
    return organization;
  }
}
