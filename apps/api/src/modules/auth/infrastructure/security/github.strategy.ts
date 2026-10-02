import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { OAuthLoginCommand } from '../../application/use-cases/oauth-login.use-case';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID_NOT_SET',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET_NOT_SET',
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ): Promise<void> {
    const { id, emails, displayName, username, photos } = profile;

    // GitHub puede no exponer el email si es privado
    const email =
      emails?.find((e: any) => e.primary)?.value ??
      emails?.[0]?.value ??
      `${username}@github.noemail`;

    const command: OAuthLoginCommand = {
      provider: 'github',
      oauthId: String(id),
      email,
      fullName: displayName ?? username,
      avatarUrl: photos?.[0]?.value,
    };

    done(null, command);
  }
}
