import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/infrastructure/security/jwt-auth.guard';
import { ActivitiesService } from './activities.service';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({ status: 200, description: 'Recent activities retrieved' })
  async getActivities(
    @Request() req: any,
    @Query('limit') limit?: string
  ) {
    const userId = req.user.userId;
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    
    const activities = await this.activitiesService.getRecentActivities(
      userId,
      limitNumber
    );
    
    return {
      success: true,
      data: activities,
    };
  }
}