import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(id: string) {
    const organization = await this.repo.findById(id);
    if (!organization) {
      throw new Error('Organization not found');
    }
    await this.repo.delete(id);
  }
}
