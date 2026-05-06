import { Injectable, ForbiddenException, Inject } from '@nestjs/common'
import { Task } from '../../domain/entities/task.entity'
import { TASK_REPOSITORY, TaskRepository } from '../../domain/repositories/task.repository'
import { PrismaService } from '@/shared/database/prisma.service'

@Injectable()
export class GetTasksByProjectUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(projectId: string, userId: string): Promise<Task[]> {
    // 1. Validate project access
    await this.validateProjectAccess(projectId, userId)
    
    // 2. Get tasks
    return this.taskRepository.findByProjectId(projectId)
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