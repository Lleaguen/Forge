import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { TokenGenerator } from '../ports/token-generator.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { User } from '../../domain/entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import { ORGANIZATION } from '@/shared/constants/app.constants';

interface RegisterUserCommand {
  email: string;
  password: string;
  fullName?: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const email = Email.create(command.email);
    const password = Password.create(command.password);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password.getValue());

    const user = User.create({
      email,
      passwordHash,
      fullName: command.fullName,
    });

    await this.userRepository.save(user);

    const organizationName = command.fullName
      ? `${command.fullName}'s Organization`
      : `${command.email}'s Organization`;

    const organization = await this.prisma.organization.create({
      data: { name: organizationName },
    });

    await this.prisma.membership.create({
      data: {
        userId: user.getId().getValue(),
        organizationId: organization.id,
        role: ORGANIZATION.OWNER_ROLE,
      },
    });

    const payload = {
      sub: user.getId().getValue(),
      email: user.getEmail().getValue(),
    };

    return {
      accessToken: await this.tokenGenerator.generateAccessToken(payload),
      refreshToken: await this.tokenGenerator.generateRefreshToken(payload),
      user: {
        id: user.getId().getValue(),
        email: user.getEmail().getValue(),
        fullName: user.getFullName(),
        role: user.getRole(),
        avatarUrl: user.getAvatarUrl(),
        organization: {
          id: organization.id,
          name: organization.name,
        },
        createdAt: user.getCreatedAt().toISOString(),
      },
    };
  }
}