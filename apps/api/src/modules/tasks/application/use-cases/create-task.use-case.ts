import { Injectable, ForbiddenException, Inject } from '@nestjs/common'
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../../domain/entities/task.entity'
import { TASK_REPOSITORY, TaskRepository } from '../../domain/repositories/task.repository'
import { CreateTaskDto } from '../dtos/create-task.dto'
import { PrismaService } from '@/shared/database/prisma.service'

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateTaskDto, createdById: string): Promise<Task> {
    // 1. Validate project access
    await this.validateProjectAccess(dto.projectId, createdById)
    
    // 2. Create task entity with simplified data
    const task = Task.create({
      projectId: dto.projectId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      category: dto.category as TaskCategory,
      priority: dto.priority as TaskPriority,
      status: TaskStatus.TODO,
      createdById,
      tags: dto.tags || [],
    })
    
    // 3. Save task
    await this.taskRepository.save(task)
    
    return task
  }
  
  private async validateProjectAccess(projectId: string, userId: string): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId },
          { 
            organization: {
              memberships: {
                some: { userId }
              }
            }
          }
        ]
      }
    })
    
    if (!project) {
      throw new ForbiddenException('Project not found or access denied')
    }
  }
}