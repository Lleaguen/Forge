import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';

import { RefreshTokenRepository } from '../../application/ports/refresh-token-repository.port';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class PrismaRefreshTokenRepository
  implements RefreshTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(token: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token: token.token,
        userId: token.userId.getValue(),
        email: token.email,
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt ?? null,
      },
    });
  }

  async find(token: string): Promise<RefreshToken | null> {
    const row = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!row) return null;

    return new RefreshToken(
      row.token,
      UserId.fromString(row.userId),
      row.email,
      row.expiresAt,
      row.revokedAt ?? undefined,
    );
  }

  async revoke(token: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }
}
