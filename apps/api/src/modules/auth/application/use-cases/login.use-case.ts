import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { TokenGenerator } from '../ports/token-generator.port';
import { Email } from '../../domain/value-objects/email.vo';
import { UnauthorizedException } from '@nestjs/common';

interface LoginCommand {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(command: LoginCommand) {
    const email = Email.create(command.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No account found with this email address');
    }

    const isValid = await this.passwordHasher.compare(
      command.password,
      user.getPasswordHash(),
    );

    if (!isValid) {
      throw new UnauthorizedException('Incorrect password');
    }

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
        organization: null,
        createdAt: user.getCreatedAt().toISOString(),
      },
    };
  }
}
