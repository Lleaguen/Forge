import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(id: string, input: { name?: string }) {
    const organization = await this.repo.findById(id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    if (input.name) {
      organization.updateName(input.name);
    }

    await this.repo.update(organization);
  }
}
