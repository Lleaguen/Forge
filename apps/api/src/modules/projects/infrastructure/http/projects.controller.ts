import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';
import { Roles } from '@/shared/guards/roles.decorator';
import { RequirePermissions } from '@/shared/guards/permissions.decorator';
import { Permissions } from '@/shared/permissions/permissions';

@Controller('projects')
export class ProjectsController {

  @Post()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.CREATE_PROJECT)
  createProject() {
    return { ok: true };
  }
}
