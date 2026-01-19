import { RefreshTokenRepository } from '../ports/refresh-token-repository.port';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.revoke(refreshToken);
  }
}
