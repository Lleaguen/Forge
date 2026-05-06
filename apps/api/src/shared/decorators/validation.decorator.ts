import { applyDecorators, UsePipes } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from '@/modules/auth/infrastructure/http/pipes/zod-validation.pipe';

export function ValidateBody(schema: ZodSchema) {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema))
  );
}

export function ValidateQuery(schema: ZodSchema) {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema))
  );
}