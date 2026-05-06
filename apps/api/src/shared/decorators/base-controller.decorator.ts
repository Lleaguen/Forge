import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/security/jwt-auth.guard';

export function BaseController(path: string) {
  return applyDecorators(
    Controller(path),
    UseGuards(JwtAuthGuard)
  );
}

export function AdminController(path: string) {
  return applyDecorators(
    Controller(path),
    UseGuards(JwtAuthGuard)
    // Add more admin-specific guards here
  );
}