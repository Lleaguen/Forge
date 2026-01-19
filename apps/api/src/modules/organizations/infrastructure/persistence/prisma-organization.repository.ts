import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';
import { PrismaService } from '@/shared/database/prisma.service';

export class PrismaOrganizationRepository implements OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(organization: Organization): Promise<void> {
    await this.prisma.organization.create({
      data: {
        id: organization.getId(),
        name: organization.getName(),
      },
    });
  }

  async findById(id: string): Promise<Organization | null> {
    const record = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!record) return null;

    return Organization.fromPersistence({
      id: record.id,
      name: record.name,
      createdAt: (record as any).createdAt,
    });
  }

  async findByUser(userId: string): Promise<Organization[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: { organization: true },
    });

    return memberships.map((m) =>
      Organization.fromPersistence({
        id: (m as any).organization.id,
        name: (m as any).organization.name,
        createdAt: (m as any).organization.createdAt,
      }),
    );
  }

  async update(organization: Organization): Promise<void> {
    await this.prisma.organization.update({
      where: { id: organization.getId() },
      data: {
        name: organization.getName(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id },
    });
  }
}
