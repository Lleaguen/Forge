import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { PrismaService } from '@/shared/database/prisma.service';

import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';
import { BcryptPasswordHasher } from '../../infrastructure/security/bcrypt-password-hasher';
import { JwtTokenGenerator } from '../../infrastructure/tokens/jwt-token-generator';

@Module({
  imports: [JwtModule.register({ secret: 'super-secret' })],
  controllers: [AuthController],
  providers: [
    PrismaService,

    // Adapters
    PrismaUserRepository,
    BcryptPasswordHasher,
    JwtTokenGenerator,

    // Use Cases
    {
      provide: RegisterUserUseCase,
      useFactory: (
        repo: PrismaUserRepository,
        hasher: BcryptPasswordHasher,
      ) => new RegisterUserUseCase(repo, hasher),
      inject: [PrismaUserRepository, BcryptPasswordHasher],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        repo: PrismaUserRepository,
        hasher: BcryptPasswordHasher,
        tokenGen: JwtTokenGenerator,
      ) => new LoginUseCase(repo, hasher, tokenGen),
      inject: [
        PrismaUserRepository,
        BcryptPasswordHasher,
        JwtTokenGenerator,
      ],
    },
  ],
})
export class AuthModule {}
