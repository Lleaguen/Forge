import { Organization } from '../entities/organization.entity';

export interface OrganizationRepository {
  create(organization: Organization): Promise<void>;
  findById(id: string): Promise<Organization | null>;
  findByUser(userId: string): Promise<Organization[]>;
  update(organization: Organization): Promise<void>;
  delete(id: string): Promise<void>;
}
