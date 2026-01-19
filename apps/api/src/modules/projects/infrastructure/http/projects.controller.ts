import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { PermissionsGuard } from '@/shared/guards/permissions.guard';
import { Roles } from '@/shared/guards/roles.decorator';
import { RequirePermissions } from '@/shared/guards/permissions.decorator';
import { Permissions } from '@/shared/permissions/permissions';
import { CreateProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { GetProjectsByOrganizationUseCase } from '../../application/use-cases/get-projects-by-organization.use-case';
import { UpdateProjectUseCase } from '../../application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from '../../application/use-cases/delete-project.use-case';
import {
  CreateProjectDtoSchema,
  type CreateProjectDto,
} from '../../application/dtos/create-project.dto';
import {
  UpdateProjectDtoSchema,
  type UpdateProjectDto,
} from '../../application/dtos/update-project.dto';
import { ZodValidationPipe } from '../../../auth/infrastructure/http/pipes/zod-validation.pipe';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly getProjectsByOrganization: GetProjectsByOrganizationUseCase,
    private readonly updateProject: UpdateProjectUseCase,
    private readonly deleteProject: DeleteProjectUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.CREATE_PROJECT)
  @UsePipes(new ZodValidationPipe(CreateProjectDtoSchema))
  async create(@Body() body: CreateProjectDto) {
    await this.createProject.execute({
      organizationId: body.organizationId,
      name: body.name,
      description: body.description,
    });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.VIEW_PROJECT)
  async getByOrganization(@Query('organizationId') organizationId: string) {
    return this.getProjectsByOrganization.execute(organizationId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.UPDATE_PROJECT)
  @UsePipes(new ZodValidationPipe(UpdateProjectDtoSchema))
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    await this.updateProject.execute(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.DELETE_PROJECT)
  async delete(@Param('id') id: string) {
    await this.deleteProject.execute(id);
  }
}
