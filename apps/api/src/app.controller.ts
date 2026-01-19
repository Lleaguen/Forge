import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './modules/auth/infrastructure/security/jwt-auth.guard';
import { RolesGuard } from './modules/auth/infrastructure/security/roles.guard';
import { Roles } from './modules/auth/infrastructure/security/roles.decorator';
import { Role } from './modules/auth/domain/roles/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    return { ok: true };
  }
}
