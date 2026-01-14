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
    const required =
      this.reflector.get<string[]>('roles', ctx.getHandler()) ?? [];

    if (required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const auth: AuthContext = req.authContext;

    if (!required.some(r => auth.roles.includes(r))) {
      throw new ForbiddenException();
    }
    return true;
  }
}
