import { RefreshTokenRepository } from '../ports/refresh-token-repository.port';
import { TokenGenerator } from '../ports/token-generator.port';
import { DomainError } from '@/shared/errors/domain.error';

interface RefreshTokenCommand {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const stored = await this.refreshTokenRepository.find(
      command.refreshToken,
    );

    if (!stored || stored.isExpired() || stored.isRevoked()) {
      throw new DomainError('Invalid refresh token');
    }

    await this.refreshTokenRepository.revoke(stored.token);

    const payload = {
      sub: stored.userId.getValue(),
      email: stored.email,
    };

    return {
      accessToken: await this.tokenGenerator.generateAccessToken(payload),
      refreshToken: await this.tokenGenerator.generateRefreshToken(payload),
    };
  }
}