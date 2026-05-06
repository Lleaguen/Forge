import { Module } from '@nestjs/common'
import { PrismaModule } from '@/shared/database/prisma.module'
import { TasksController } from './infrastructure/http/tasks.controller'
import { TasksCrudService } from './infrastructure/services/tasks-crud.service'
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case'
import { GetTasksByProjectUseCase } from './application/use-cases/get-tasks-by-project.use-case'
import { TASK_REPOSITORY, TaskRepository } from './domain/repositories/task.repository'
import { PrismaTaskRepository } from './infrastructure/persistence/prisma-task.repository'

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksCrudService,
    CreateTaskUseCase,
    GetTasksByProjectUseCase,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
  ],
  exports: [
    TasksCrudService,
    CreateTaskUseCase,
    GetTasksByProjectUseCase,
    TASK_REPOSITORY,
  ],
})
export class TasksModule {}