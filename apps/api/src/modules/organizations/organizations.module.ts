import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationsController } from './infrastructure/http/organizations.controller';
import { CreateOrganizationUseCase } from './application/use-cases/create-organization.use-case';
import { GetOrganizationsByUserUseCase } from './application/use-cases/get-organizations-by-user.use-case';
import { UpdateOrganizationUseCase } from './application/use-cases/update-organization.use-case';
import { DeleteOrganizationUseCase } from './application/use-cases/delete-organization.use-case';
import { PrismaOrganizationRepository } from './infrastructure/persistence/prisma-organization.repository';
import { PrismaModule } from '@/shared/database/prisma.module';
import { AuthModule } from '../auth/infrastructure/http/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, JwtModule.register({ secret: 'super-secret' })],
  controllers: [OrganizationsController],
  providers: [
    {
      provide: 'OrganizationRepository',
      useClass: PrismaOrganizationRepository,
    },
    CreateOrganizationUseCase,
    GetOrganizationsByUserUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
  ],
  exports: [
    CreateOrganizationUseCase,
    GetOrganizationsByUserUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
  ],
})
export class OrganizationsModule {}
