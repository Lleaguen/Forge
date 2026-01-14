import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthContext } from '@/modules/auth/interfaces/auth-context.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const header = req.headers['authorization'];
    if (!header) throw new UnauthorizedException();

    const [, token] = header.split(' ');

    try {
      const payload = this.jwt.verify(token);

      const authContext: AuthContext = {
        userId: payload.sub,
        organizationId: payload.organizationId,
        roles: payload.roles,
      };

      req.authContext = authContext;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
