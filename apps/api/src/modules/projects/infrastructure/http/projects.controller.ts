import { Body, Post, Get, Put, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { BaseController } from '@/shared/decorators/base-controller.decorator';
import { ValidateBody } from '@/shared/decorators/validation.decorator';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/security/jwt-auth.guard';
import { ProjectsCrudService, Project } from '../services/projects-crud.service';
import { ApiResponse, UserContext } from '@/shared/services/base-crud.service';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
});

const UpdateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional()
});

type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;

@BaseController('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsCrudService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.projectsService.findProjectsForUser(req.user.sub);
  }

  @Post()
  @ValidateBody(CreateProjectSchema)
  async create(@Body() createDto: CreateProjectDto, @Request() req: any) {
    return this.projectsService.createProjectWithOrganization(createDto, req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };
    const entity = await this.projectsService.findByIdWithAccess(id, userContext);
    return ApiResponse.success(entity);
  }

  @Put(':id')
  @ValidateBody(UpdateProjectSchema)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProjectDto,
    @Request() req: any
  ) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };
    const entity = await this.projectsService.updateWithAccess(id, updateDto, userContext);
    return ApiResponse.success(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    };
    await this.projectsService.deleteWithAccess(id, userContext);
    return ApiResponse.success(null, 'Project deleted successfully');
  }
}
