import { Module } from '@nestjs/common';
import { ProjectsController } from './infrastructure/http/projects.controller';

@Module({
  controllers: [ProjectsController],
})
export class ProjectsModule {}
