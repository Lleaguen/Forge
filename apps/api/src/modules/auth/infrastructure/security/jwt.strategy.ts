import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@/shared/database/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Primero intentar extraer de cookies
        (request: Request) => {
          return request?.cookies?.auth_access_token;
        },
        // Fallback a Authorization header para compatibilidad
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET || 'super-secret',
    });
  }

  async validate(payload: any) {
    // Obtener información adicional del usuario desde la base de datos
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const organization = user.memberships[0]?.organization;

    return {
      sub: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      organizationId: organization?.id,
      organization: organization ? {
        id: organization.id,
        name: organization.name,
      } : null,
    };
  }
}
