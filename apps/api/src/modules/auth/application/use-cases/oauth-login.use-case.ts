import { PrismaService } from '@/shared/database/prisma.service';
import { TokenGenerator } from '../ports/token-generator.port';
import { ORGANIZATION } from '@/shared/constants/app.constants';

export interface OAuthLoginCommand {
  provider: 'google' | 'github';
  oauthId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export class OAuthLoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(command: OAuthLoginCommand) {
    const { provider, oauthId, email, fullName, avatarUrl } = command;

    // 1. Buscar usuario existente por proveedor OAuth
    let user = await this.prisma.user.findFirst({
      where: { oauthProvider: provider, oauthId },
      include: { memberships: { include: { organization: true } } },
    });

    // 2. Si no existe por OAuth, buscar por email (cuenta preexistente con email/password)
    if (!user) {
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email },
        include: { memberships: { include: { organization: true } } },
      });

      if (existingByEmail) {
        // Vincular la cuenta OAuth al usuario existente
        user = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            oauthProvider: provider,
            oauthId,
            avatarUrl: avatarUrl ?? existingByEmail.avatarUrl,
          },
          include: { memberships: { include: { organization: true } } },
        });
      }
    }

    // 3. Si sigue sin existir, crear usuario nuevo con organización personal
    if (!user) {
      const orgName = fullName
        ? `${fullName}'s Organization`
        : `${email}'s Organization`;

      const organization = await this.prisma.organization.create({
        data: { name: orgName },
      });

      user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: null,
          fullName: fullName ?? null,
          avatarUrl: avatarUrl ?? null,
          oauthProvider: provider,
          oauthId,
          memberships: {
            create: {
              organizationId: organization.id,
              role: ORGANIZATION.OWNER_ROLE,
            },
          },
        },
        include: { memberships: { include: { organization: true } } },
      });
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.tokenGenerator.generateAccessToken(payload),
      refreshToken: await this.tokenGenerator.generateRefreshToken(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        organization: user.memberships[0]?.organization
          ? {
              id: user.memberships[0].organization.id,
              name: user.memberships[0].organization.name,
            }
          : null,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }
}
