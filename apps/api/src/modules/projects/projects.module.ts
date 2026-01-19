import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProjectsController } from './infrastructure/http/projects.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { GetProjectsByOrganizationUseCase } from './application/use-cases/get-projects-by-organization.use-case';
import { UpdateProjectUseCase } from './application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';
import { PrismaProjectRepository } from './infrastructure/persistence/prisma-project.repository';
import { PrismaModule } from '@/shared/database/prisma.module';
import { AuthModule } from '../auth/infrastructure/http/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, JwtModule.register({ secret: 'super-secret' })],
  controllers: [ProjectsController],
  providers: [
    {
      provide: 'ProjectRepository',
      useClass: PrismaProjectRepository,
    },
    CreateProjectUseCase,
    GetProjectsByOrganizationUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
  ],
  exports: [
    CreateProjectUseCase,
    GetProjectsByOrganizationUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
  ],
})
export class ProjectsModule {}
