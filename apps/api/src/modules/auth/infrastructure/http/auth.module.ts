import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { PrismaService } from '@/shared/database/prisma.service';

import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';

import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '../persistence/prisma-refresh-token.repository';

import { BcryptPasswordHasher } from '../security/bcrypt-password-hasher';
import { JwtTokenGenerator } from '../security/jwt-token-generator';

import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_GENERATOR,
  REFRESH_TOKEN_REPOSITORY,
} from '../../application/ports';

@Module({
  imports: [JwtModule.register({ secret: 'super-secret' })],
  controllers: [AuthController],
  providers: [

    // Repositories
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },

    // Services
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },

    // Use cases
    {
      provide: RegisterUserUseCase,
      useFactory: (repo, hasher) =>
        new RegisterUserUseCase(repo, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: LoginUseCase,
      useFactory: (repo, hasher, tokenGen) =>
        new LoginUseCase(repo, hasher, tokenGen),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repo, tokenGen) =>
        new RefreshTokenUseCase(repo, tokenGen),
      inject: [REFRESH_TOKEN_REPOSITORY, TOKEN_GENERATOR],
    },
  ],
})
export class AuthModule {}
