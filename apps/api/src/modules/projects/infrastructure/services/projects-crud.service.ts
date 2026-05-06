import { Injectable } from '@nestjs/common';
import { BaseCrudService, ResponseUtil } from '@/shared/services/base-crud.service';
import { PrismaService } from '@/shared/database/prisma.service';
import { ORGANIZATION } from '@/shared/constants/app.constants';

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
  organization?: any;
}

@Injectable()
export class ProjectsCrudService extends BaseCrudService<Project> {
  constructor(prisma: PrismaService) {
    super(prisma, 'project');
  }

  protected getIncludeOptions() {
    return { 
      organization: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    };
  }

  async findProjectsForUser(userId: string) {
    try {
      // Get all organizations the user is a member of
      const userMemberships = await this.prisma.membership.findMany({
        where: { userId },
        select: { organizationId: true }
      });

      const organizationIds = userMemberships.map(m => m.organizationId);

      // Find projects where user is owner OR projects in organizations user belongs to
      const projects = await this.prisma.project.findMany({
        where: {
          OR: [
            { userId }, // Projects owned by user
            { organizationId: { in: organizationIds } } // Projects in user's organizations
          ]
        },
        include: this.getIncludeOptions(),
        orderBy: { createdAt: 'desc' }
      });

      return ResponseUtil.success(projects);
    } catch (error) {
      this.logger.error('Error fetching projects for user:', error);
      return ResponseUtil.error('Failed to fetch projects');
    }
  }

  async createProjectWithOrganization(data: any, userId: string) {
    try {
      // Create a new organization for this project
      const organization = await this.prisma.organization.create({
        data: {
          name: `${data.name} Organization`
        }
      });

      // Create the project with the new organization
      const project = await this.prisma.project.create({
        data: {
          ...data,
          userId,
          organizationId: organization.id
        },
        include: this.getIncludeOptions()
      });

      // Make the creator an OWNER of the organization
      await this.prisma.membership.create({
        data: {
          userId,
          organizationId: organization.id,
          role: ORGANIZATION.OWNER_ROLE
        }
      });

      return ResponseUtil.success(project, 'Project created successfully');
    } catch (error) {
      this.logger.error('Error creating project with organization:', error);
      return ResponseUtil.error('Failed to create project');
    }
  }
}
