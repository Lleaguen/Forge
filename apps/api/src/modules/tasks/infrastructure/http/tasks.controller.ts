import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { BaseController } from '@/shared/decorators/base-controller.decorator'
import { ValidateBody } from '@/shared/decorators/validation.decorator'
import { JwtAuthGuard } from '@/modules/auth/infrastructure/security/jwt-auth.guard'
import { ResponseUtil } from '@/shared/utils/response.util'
import { TasksCrudService } from '../services/tasks-crud.service'
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case'
import { CreateTaskSchema } from '@/shared/zod/tasks/create-task.schema'
import { CreateTaskDto } from '../../application/dtos/create-task.dto'
import { UserContext } from '@/shared/services/base-crud.service'

@BaseController('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly tasksService: TasksCrudService,
  ) {}

  @Post()
  @ValidateBody(CreateTaskSchema)
  async create(@Body() dto: CreateTaskDto, @Request() req: any) {
    const task = await this.createTaskUseCase.execute(dto, req.user.sub)
    return ResponseUtil.success(task.toPrimitives(), 'Task created successfully')
  }

  @Get()
  async getByProject(
    @Query('projectId') projectId: string,
    @Query('moveTask') moveTaskId: string,
    @Query('newStatus') newStatus: string,
    @Request() req: any
  ) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    }

    // Handle task move operation
    if (moveTaskId && newStatus) {
      try {
        const updatedTask = await this.tasksService.updateStatus(
          moveTaskId, 
          newStatus, 
          userContext
        )
        return ResponseUtil.success(updatedTask, 'Task moved successfully')
      } catch (error) {
        return ResponseUtil.error('Failed to move task')
      }
    }

    // Handle normal get tasks operation
    if (!projectId) {
      return ResponseUtil.error('Project ID is required')
    }

    try {
      const tasks = await this.tasksService.findByProject(projectId, userContext)
      return ResponseUtil.success(tasks)
    } catch (error) {
      throw error
    }
  }

  @Patch(':id')
  async update(
    @Param('id') taskId: string,
    @Body() updateData: any,
    @Request() req: any
  ) {
    const userContext: UserContext = {
      sub: req.user.sub,
      organizationId: req.user.organizationId
    }

    try {
      // Handle assigneeId - connect/disconnect relation
      const { assigneeId, ...rest } = updateData
      
      const data: any = { ...rest }
      
      if (assigneeId !== undefined) {
        if (assigneeId === null || assigneeId === '') {
          // Unassign
          data.assignee = { disconnect: true }
        } else {
          // Assign to user
          data.assignee = { connect: { id: assigneeId } }
        }
      }

      const updatedTask = await this.tasksService.updateWithAccess(
        taskId,
        data,
        userContext
      )
      return ResponseUtil.success(updatedTask, 'Task updated successfully')
    } catch (error) {
      return ResponseUtil.error('Failed to update task')
    }
  }
}