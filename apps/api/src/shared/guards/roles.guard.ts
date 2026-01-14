import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthContext } from '@/modules/auth/interface/auth-context.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', ctx.getHandler()) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const auth = req.authContext as AuthContext | undefined;

    if (!auth) {
      throw new ForbiddenException('Missing auth context');
    }

    const hasRole = requiredRoles.some(role =>
      auth.roles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
