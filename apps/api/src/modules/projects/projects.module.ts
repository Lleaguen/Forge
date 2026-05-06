import { Module } from '@nestjs/common';
import { ProjectsController } from './infrastructure/http/projects.controller';
import { ProjectMembersController } from './infrastructure/http/project-members.controller';
import { ProjectsCrudService } from './infrastructure/services/projects-crud.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaModule } from '../../shared/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController, ProjectMembersController],
  providers: [ProjectsCrudService, NotificationsService],
  exports: [ProjectsCrudService],
})
export class ProjectsModule {}