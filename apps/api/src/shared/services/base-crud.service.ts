import { ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Types
export interface BaseEntity {
  id: string;
  userId?: string;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserContext {
  sub: string;
  userId?: string;
  organizationId?: string;
}

export interface FindManyOptions {
  where?: any;
  orderBy?: any;
  skip?: number;
  take?: number;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: string;
}

// Abstract base class for CRUD services
export abstract class BaseCrudService<T extends BaseEntity> {
  protected readonly logger: Logger;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string
  ) {
    this.logger = new Logger(`${modelName}Service`);
  }

  /**
   * Build access filter for queries
   * Override this method for custom access logic
   */
  protected buildAccessFilter(userContext: UserContext): any {
    return {
      OR: [
        { userId: userContext.sub },
        ...(userContext.organizationId 
          ? [{ organizationId: userContext.organizationId }] 
          : []
        )
      ].filter(Boolean)
    };
  }

  /**
   * Get include options for queries
   * Override this method to customize relations
   */
  protected getIncludeOptions(): any {
    return {};
  }

  /**
   * Check if user has access to entity
   * Override for custom access logic
   */
  protected async checkAccess(entityId: string, userContext: UserContext): Promise<AccessCheckResult> {
    const entity = await (this.prisma as any)[this.modelName].findFirst({
      where: {
        id: entityId,
        ...this.buildAccessFilter(userContext)
      }
    });

    return {
      hasAccess: !!entity,
      reason: entity ? undefined : 'Entity not found or access denied'
    };
  }

  /**
   * Find entity by ID with access check
   */
  async findByIdWithAccess(id: string, userContext: UserContext): Promise<T> {
    try {
      const entity = await (this.prisma as any)[this.modelName].findFirst({
        where: {
          id,
          ...this.buildAccessFilter(userContext)
        },
        include: this.getIncludeOptions()
      });

      if (!entity) {
        throw new ForbiddenException(`${this.modelName} not found or access denied`);
      }

      return entity;
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName} by ID:`, error);
      throw error;
    }
  }

  /**
   * Find many entities with access check
   */
  async findManyWithAccess(
    userContext: UserContext, 
    options: FindManyOptions = {}
  ): Promise<T[]> {
    try {
      const { where = {}, orderBy = { createdAt: 'desc' }, skip, take } = options;

      return (this.prisma as any)[this.modelName].findMany({
        where: {
          ...this.buildAccessFilter(userContext),
          ...where
        },
        orderBy,
        skip,
        take,
        include: this.getIncludeOptions()
      });
    } catch (error) {
      this.logger.error(`Error finding ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Create entity with user context
   */
  async createWithUser(data: any, userContext: UserContext): Promise<T> {
    try {
      return (this.prisma as any)[this.modelName].create({
        data: {
          ...data,
          user: { connect: { id: userContext.sub } },
          ...(userContext.organizationId
            ? { organization: { connect: { id: userContext.organizationId } } }
            : {})
        },
        include: this.getIncludeOptions()
      });
    } catch (error) {
      this.logger.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update entity with access check
   */
  async updateWithAccess(id: string, data: any, userContext: UserContext): Promise<T> {
    try {
      // Verify access first
      await this.findByIdWithAccess(id, userContext);

      return (this.prisma as any)[this.modelName].update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: this.getIncludeOptions()
      });
    } catch (error) {
      this.logger.error(`Error updating ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete entity with access check
   */
  async deleteWithAccess(id: string, userContext: UserContext): Promise<void> {
    try {
      // Verify access first
      await this.findByIdWithAccess(id, userContext);

      await (this.prisma as any)[this.modelName].delete({
        where: { id }
      });

      this.logger.log(`Deleted ${this.modelName} with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Count entities with access check
   */
  async countWithAccess(userContext: UserContext, where: any = {}): Promise<number> {
    try {
      return (this.prisma as any)[this.modelName].count({
        where: {
          ...this.buildAccessFilter(userContext),
          ...where
        }
      });
    } catch (error) {
      this.logger.error(`Error counting ${this.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Check if entity exists with access
   */
  async existsWithAccess(id: string, userContext: UserContext): Promise<boolean> {
    try {
      const count = await (this.prisma as any)[this.modelName].count({
        where: {
          id,
          ...this.buildAccessFilter(userContext)
        }
      });

      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking ${this.modelName} existence:`, error);
      return false;
    }
  }
}

// Response helpers
export class ResponseUtil {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      ...(message && { message })
    };
  }

  static error(message: string, statusCode = 400) {
    return {
      success: false,
      message,
      statusCode
    };
  }

  static paginated<T>(data: T[], total: number, page: number, limit: number) {
    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

// Deprecated - use ResponseUtil instead
export const ApiResponse = ResponseUtil;
