import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { ACTIVITY } from '../../shared/constants/app.constants';

// Types
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
  metadata?: ActivityMetadata;
}

interface ActivityMetadata {
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
  oldStatus?: string;
  newStatus?: string;
}

type ActivityType = 'project_created' | 'task_created' | 'task_updated' | 'member_added';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRecentActivities(userId: string, limit: number = ACTIVITY.DEFAULT_LIMIT): Promise<Activity[]> {
    try {
      const organizationIds = await this.getUserOrganizationIds(userId);

      if (organizationIds.length === 0) {
        return [];
      }

      const [projectActivities, taskActivities] = await Promise.all([
        this.getProjectActivities(organizationIds, Math.floor(limit * ACTIVITY.PROJECTS_RATIO)),
        this.getTaskActivities(organizationIds, Math.floor(limit * ACTIVITY.TASKS_RATIO)),
      ]);

      return this.sortAndLimitActivities([...projectActivities, ...taskActivities], limit);
    } catch (error) {
      this.logger.error('Error getting recent activities:', error);
      return [];
    }
  }

  private async getUserOrganizationIds(userId: string): Promise<string[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      select: { organizationId: true },
    });

    return memberships.map(m => m.organizationId);
  }

  private async getProjectActivities(organizationIds: string[], limit: number): Promise<Activity[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        organizationId: { in: organizationIds },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return projects.map(project => this.mapProjectToActivity(project));
  }

  private async getTaskActivities(organizationIds: string[], limit: number): Promise<Activity[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        project: {
          organizationId: { in: organizationIds },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return tasks.map(task => this.mapTaskToActivity(task));
  }

  private mapProjectToActivity(project: any): Activity {
    return {
      id: `project_${project.id}`,
      type: 'project_created',
      title: 'New Project',
      description: 'created the project',
      userId: project.user?.id || project.userId,
      userName: project.user?.fullName || project.user?.email || 'Unknown User',
      createdAt: project.createdAt.toISOString(),
      metadata: {
        projectId: project.id,
        projectName: project.name,
      },
    };
  }

  private mapTaskToActivity(task: any): Activity {
    const isUpdate = task.createdAt.getTime() !== task.updatedAt.getTime();

    return {
      id: `task_${task.id}_${task.updatedAt.getTime()}`,
      type: isUpdate ? 'task_updated' : 'task_created',
      title: isUpdate ? 'Task Updated' : 'New Task',
      description: isUpdate ? 'updated the task' : 'created the task',
      userId: task.createdBy?.id || task.createdById,
      userName: task.createdBy?.fullName || task.createdBy?.email || 'Unknown User',
      createdAt: task.updatedAt.toISOString(),
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
        projectId: task.project.id,
        projectName: task.project.name,
        oldStatus: task.status,
        newStatus: task.status,
      },
    };
  }

  private sortAndLimitActivities(activities: Activity[], limit: number): Activity[] {
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}