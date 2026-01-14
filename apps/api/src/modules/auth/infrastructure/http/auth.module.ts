import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { PrismaService } from '@/shared/database/prisma.service';

import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

// Ports (tokens)
import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_GENERATOR,
} from '../../application/ports';

// Adapters
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma-user.repository';
import { BcryptPasswordHasher } from '../../infrastructure/security/bcrypt-password-hasher';
import { JwtTokenGenerator } from '../../infrastructure/security/jwt-token-generator';

// Interfaces
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';
import { TokenGeneratorPort } from '../../application/ports/token-generator.port';

@Module({
  imports: [JwtModule.register({ secret: 'super-secret' })],
  controllers: [AuthController],
  providers: [
    PrismaService,

    // Ports → Adapters
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtTokenGenerator,
    },

    // Use Cases
    {
      provide: RegisterUserUseCase,
      useFactory: (
        repo: UserRepository,
        hasher: PasswordHasherPort,
      ) => new RegisterUserUseCase(repo, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        repo: UserRepository,
        hasher: PasswordHasherPort,
        tokenGen: TokenGeneratorPort,
      ) => new LoginUseCase(repo, hasher, tokenGen),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_GENERATOR],
    },
  ],
})
export class AuthModule {}
