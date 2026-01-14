import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required =
      this.reflector.get<string[]>('permissions', ctx.getHandler()) ?? [];

    if (required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const perms: string[] = req.authContext.permissions ?? [];

    if (!required.every(p => perms.includes(p))) {
      throw new ForbiddenException();
    }
    return true;
  }
}
