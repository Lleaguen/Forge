import { Injectable } from '@nestjs/common';
import { BaseCrudService, UserContext } from '@/shared/services/base-crud.service';
import { PrismaService } from '@/shared/database/prisma.service';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category: string;
  tags: string[];
  projectId: string;
  userId?: string; // Make optional since it might not always be included
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
  project?: any;
}

@Injectable()
export class TasksCrudService extends BaseCrudService<Task> {
  constructor(prisma: PrismaService) {
    super(prisma, 'task');
  }

  async findByProject(projectId: string, userContext: UserContext): Promise<Task[]> {
    // First verify project access - check if user has access through organization membership
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: userContext.sub }, // User owns the project
          { 
            organization: {
              memberships: {
                some: { userId: userContext.sub }
              }
            }
          } // User is a member of the project's organization
        ]
      }
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // If user has access to project, return ALL tasks in that project
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: this.getIncludeOptions()
    });
  }

  async updateStatus(taskId: string, status: string, userContext: UserContext): Promise<Task> {
    // Verify task access through project
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Check project access - same logic as findByProject
    const hasAccess = await this.prisma.project.findFirst({
      where: {
        id: task.projectId,
        OR: [
          { userId: userContext.sub }, // User owns the project
          { 
            organization: {
              memberships: {
                some: { userId: userContext.sub }
              }
            }
          } // User is a member of the project's organization
        ]
      }
    });

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { 
        status: status as any,
        updatedAt: new Date()
      },
      include: this.getIncludeOptions()
    });
  }

  protected getIncludeOptions() {
    return { 
      project: {
        select: {
          id: true,
          name: true
        }
      },
      assignee: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        }
      },
      createdBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
        }
      }
    };
  }
}