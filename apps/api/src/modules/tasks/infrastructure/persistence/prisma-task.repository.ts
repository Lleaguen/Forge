import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { PrismaService } from '@/shared/database/prisma.service';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    await this.prisma.task.create({
      data: {
        id: task.getId(),
        projectId: task.getProjectId(),
        title: task.getTitle(),
        status: task.getStatus(),
        createdAt: task.getCreatedAt(),
      },
    });
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const records = await this.prisma.task.findMany({
      where: { projectId },
    });

    return records.map((t) =>
      Task.fromPersistence({
        id: t.id,
        projectId: t.projectId,
        title: t.title,
        status: t.status,
        createdAt: t.createdAt,
      }),
    );
  }

  async findById(id: string): Promise<Task | null> {
    const record = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!record) return null;

    return Task.fromPersistence({
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      status: record.status,
      createdAt: record.createdAt,
    });
  }

  async update(task: Task): Promise<void> {
    await this.prisma.task.update({
      where: { id: task.getId() },
      data: {
        title: task.getTitle(),
        status: task.getStatus(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }
}
