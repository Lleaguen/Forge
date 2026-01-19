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
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { GetTasksByProjectUseCase } from '../../application/use-cases/get-tasks-by-project.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import {
  CreateTaskDtoSchema,
  type CreateTaskDto,
} from '../../application/dtos/create-task.dto';
import {
  UpdateTaskDtoSchema,
  type UpdateTaskDto,
} from '../../application/dtos/update-task.dto';
import { ZodValidationPipe } from '../../../auth/infrastructure/http/pipes/zod-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly updateTask: UpdateTaskUseCase,
    private readonly getTasksByProject: GetTasksByProjectUseCase,
    private readonly deleteTask: DeleteTaskUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.CREATE_TASK)
  @UsePipes(new ZodValidationPipe(CreateTaskDtoSchema))
  async create(@Body() body: CreateTaskDto) {
    await this.createTask.execute({
      projectId: body.projectId,
      title: body.title,
      status: body.status,
    });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.VIEW_TASK)
  async getByProject(@Query('projectId') projectId: string) {
    return this.getTasksByProject.execute(projectId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.UPDATE_TASK)
  @UsePipes(new ZodValidationPipe(UpdateTaskDtoSchema))
  async update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    await this.updateTask.execute(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @RequirePermissions(Permissions.DELETE_TASK)
  async delete(@Param('id') id: string) {
    await this.deleteTask.execute(id);
  }
}
