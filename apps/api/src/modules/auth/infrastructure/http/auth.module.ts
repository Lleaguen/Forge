import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../security/roles.guard';

import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';

import { PrismaUserRepository } from '../persistence/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '../persistence/prisma-refresh-token.repository';

import { BcryptPasswordHasher } from '../security/bcrypt-password-hasher';
import { JwtTokenGenerator } from '../security/jwt-token-generator';

import { JwtStrategy } from '../security/jwt.strategy';
import { RefreshTokenStrategy } from '../security/refresh-token.strategy';

import { PrismaService } from '@/shared/database/prisma.service';

import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_GENERATOR,
  REFRESH_TOKEN_REPOSITORY,
} from '../../application/ports';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ 
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    RefreshTokenStrategy,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Repositories
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },

    // Services
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    {
      provide: TOKEN_GENERATOR,
      useFactory: (jwtService: JwtService) => {
        return new JwtTokenGenerator(jwtService);
      },
      inject: [JwtService],
    },

    // Use cases
    {
      provide: RegisterUserUseCase,
      useFactory: (repo, hasher, tokenGen, prisma) => new RegisterUserUseCase(repo, hasher, tokenGen, prisma),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR, PrismaService],
    },
    {
      provide: LoginUseCase,
      useFactory: (repo, hasher, tokenGen) =>
        new LoginUseCase(repo, hasher, tokenGen),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repo, tokenGen) => new RefreshTokenUseCase(repo, tokenGen),
      inject: [REFRESH_TOKEN_REPOSITORY, TOKEN_GENERATOR],
    },
    {
      provide: LogoutUseCase,
      useFactory: (repo) => new LogoutUseCase(repo),
      inject: [REFRESH_TOKEN_REPOSITORY],
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}