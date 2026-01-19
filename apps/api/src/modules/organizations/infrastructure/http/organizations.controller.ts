import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';
import { Roles } from '@/shared/guards/roles.decorator';
import { RequirePermissions } from '@/shared/guards/permissions.decorator';
import { Permissions } from '@/shared/permissions/permissions';
import { CreateOrganizationUseCase } from '../../application/use-cases/create-organization.use-case';
import { GetOrganizationsByUserUseCase } from '../../application/use-cases/get-organizations-by-user.use-case';
import { UpdateOrganizationUseCase } from '../../application/use-cases/update-organization.use-case';
import { DeleteOrganizationUseCase } from '../../application/use-cases/delete-organization.use-case';
import {
  CreateOrganizationDtoSchema,
  type CreateOrganizationDto,
} from '../../application/dtos/create-organization.dto';
import {
  UpdateOrganizationDtoSchema,
  type UpdateOrganizationDto,
} from '../../application/dtos/update-organization.dto';
import { ZodValidationPipe } from '../../../auth/infrastructure/http/pipes/zod-validation.pipe';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly createOrganization: CreateOrganizationUseCase,
    private readonly getOrganizationsByUser: GetOrganizationsByUserUseCase,
    private readonly updateOrganization: UpdateOrganizationUseCase,
    private readonly deleteOrganization: DeleteOrganizationUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.CREATE_ORGANIZATION)
  @UsePipes(new ZodValidationPipe(CreateOrganizationDtoSchema))
  async create(@Body() body: CreateOrganizationDto) {
    return this.createOrganization.execute(body);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.VIEW_ORGANIZATION)
  async getByUser() {
    // Assume user from context
    // For simplicity, hardcode or get from guard
    // In real, use @User() decorator
    return this.getOrganizationsByUser.execute('user-id'); // placeholder
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.UPDATE_ORGANIZATION)
  @UsePipes(new ZodValidationPipe(UpdateOrganizationDtoSchema))
  async update(@Param('id') id: string, @Body() body: UpdateOrganizationDto) {
    await this.updateOrganization.execute(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.DELETE_ORGANIZATION)
  async delete(@Param('id') id: string) {
    await this.deleteOrganization.execute(id);
  }
}
