import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/infrastructure/security/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved' })
  async getDashboardStats(@Request() req: any) {
    const userId = req.user.userId;
    const stats = await this.dashboardService.getDashboardStats(userId);
    
    return {
      success: true,
      data: stats,
    };
  }
}