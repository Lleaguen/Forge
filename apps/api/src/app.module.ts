import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/infrastructure/http/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PrismaModule } from './shared/database/prisma.module';
import { HealthModule } from './shared/health/health.module';

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    TasksModule,
    OrganizationsModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
