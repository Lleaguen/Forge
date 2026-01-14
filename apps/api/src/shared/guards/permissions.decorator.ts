import { SetMetadata } from '@nestjs/common';
export const RequirePermissions = (...p: string[]) =>
  SetMetadata('permissions', p);