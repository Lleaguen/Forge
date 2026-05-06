import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
  team: {
    totalMembers: number;
    activeMembers: number;
  };
  activity: {
    recentProjects: number;
    recentTasks: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    try {
      // Get projects stats
      const totalProjects = await this.prisma.project.count({
        where: { organizationId },
      });

      // Get tasks stats
      const tasks = await this.prisma.task.findMany({
        where: {
          project: {
            organizationId,
          },
        },
        select: {
          status: true,
        },
      });

      const taskStats = tasks.reduce(
        (acc, task) => {
          acc.total++;
          switch (task.status.toLowerCase()) {
            case 'todo':
              acc.todo++;
              break;
            case 'in_progress':
            case 'inprogress':
              acc.inProgress++;
              break;
            case 'completed':
            case 'done':
              acc.completed++;
              break;
          }
          return acc;
        },
        { total: 0, todo: 0, inProgress: 0, completed: 0 }
      );

      // Get team stats
      const totalMembers = await this.prisma.membership.count({
        where: { organizationId },
      });

      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentProjects = await this.prisma.project.count({
        where: {
          organizationId,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      const recentTasks = await this.prisma.task.count({
        where: {
          project: {
            organizationId,
          },
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      return {
        projects: {
          total: totalProjects,
          active: totalProjects, // Assuming all projects are active for now
          completed: 0, // Add project status field if needed
        },
        tasks: taskStats,
        team: {
          totalMembers,
          activeMembers: totalMembers, // Assuming all members are active
        },
        activity: {
          recentProjects,
          recentTasks,
        },
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Return default stats if there's an error
      return {
        projects: { total: 0, active: 0, completed: 0 },
        tasks: { total: 0, todo: 0, inProgress: 0, completed: 0 },
        team: { totalMembers: 0, activeMembers: 0 },
        activity: { recentProjects: 0, recentTasks: 0 },
      };
    }
  }
}