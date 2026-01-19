import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TasksController } from './infrastructure/http/tasks.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case';
import { GetTasksByProjectUseCase } from './application/use-cases/get-tasks-by-project.use-case';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case';
import { PrismaTaskRepository } from './infrastructure/persistence/prisma-task.repository';
import { PrismaModule } from '@/shared/database/prisma.module';
import { AuthModule } from '../auth/infrastructure/http/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, JwtModule.register({ secret: 'super-secret' })],
  controllers: [TasksController],
  providers: [
    {
      provide: 'TaskRepository',
      useClass: PrismaTaskRepository,
    },
    CreateTaskUseCase,
    UpdateTaskUseCase,
    GetTasksByProjectUseCase,
    DeleteTaskUseCase,
  ],
  exports: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    GetTasksByProjectUseCase,
    DeleteTaskUseCase,
  ],
})
export class TasksModule {}
