import { Injectable } from '@nestjs/common'
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../../domain/entities/task.entity'
import { TaskRepository } from '../../domain/repositories/task.repository'
import { PrismaService } from '@/shared/database/prisma.service'

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(task: Task): Promise<void> {
    const data = {
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      assigneeId: task.assigneeId,
      createdById: task.createdById,
      projectId: task.projectId,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      dueDate: task.dueDate,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      tags: task.tags,
      position: task.position,
    }

    await this.prisma.task.upsert({
      where: { id: task.id },
      update: {
        ...data,
        updatedAt: task.updatedAt,
      },
      create: {
        id: task.id,
        ...data,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    })
  }

  async findById(id: string): Promise<Task | null> {
    const record = await this.prisma.task.findUnique({
      where: { id },
    })

    if (!record) return null

    return Task.fromPersistence({
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      description: record.description || undefined,
      category: record.category as TaskCategory,
      priority: record.priority as TaskPriority,
      status: record.status as TaskStatus,
      assigneeId: record.assigneeId || undefined,
      createdById: record.createdById,
      estimatedHours: record.estimatedHours || undefined,
      actualHours: record.actualHours,
      dueDate: record.dueDate || undefined,
      startedAt: record.startedAt || undefined,
      completedAt: record.completedAt || undefined,
      tags: record.tags,
      position: record.position,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const records = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' }
      ],
    })

    return records.map(record => Task.fromPersistence({
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      description: record.description || undefined,
      category: record.category as TaskCategory,
      priority: record.priority as TaskPriority,
      status: record.status as TaskStatus,
      assigneeId: record.assigneeId || undefined,
      createdById: record.createdById,
      estimatedHours: record.estimatedHours || undefined,
      actualHours: record.actualHours,
      dueDate: record.dueDate || undefined,
      startedAt: record.startedAt || undefined,
      completedAt: record.completedAt || undefined,
      tags: record.tags,
      position: record.position,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }))
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    })
  }
}