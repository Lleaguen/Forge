import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/entities/project.entity';
import { PrismaService } from '@/shared/database/prisma.service';

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(project: Project): Promise<void> {
    await this.prisma.project.create({
      data: {
        id: project.getId(),
        organizationId: project.getOrganizationId(),
        name: project.getName(),
        description: project.getDescription(),
        createdAt: project.getCreatedAt(),
      },
    });
  }

  async findByOrganization(organizationId: string): Promise<Project[]> {
    const records = await this.prisma.project.findMany({
      where: { organizationId },
    });

    return records.map((p) =>
      Project.fromPersistence({
        id: p.id,
        organizationId: p.organizationId,
        name: p.name,
        description: p.description ?? undefined,
        createdAt: p.createdAt,
      }),
    );
  }

  async findById(id: string): Promise<Project | null> {
    const record = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!record) return null;

    return Project.fromPersistence({
      id: record.id,
      organizationId: record.organizationId,
      name: record.name,
      description: record.description ?? undefined,
      createdAt: record.createdAt,
    });
  }

  async update(project: Project): Promise<void> {
    await this.prisma.project.update({
      where: { id: project.getId() },
      data: {
        name: project.getName(),
        description: project.getDescription(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({
      where: { id },
    });
  }
}