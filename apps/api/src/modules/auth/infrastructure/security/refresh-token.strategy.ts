import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { extractRefreshToken } from './extract-refresh-token';
import { PrismaService } from '@/shared/database/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: (req: Request) => extractRefreshToken(req),
      secretOrKey: 'super-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = extractRefreshToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken) {
      throw new UnauthorizedException();
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException();
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
      token,
    };
  }
}
