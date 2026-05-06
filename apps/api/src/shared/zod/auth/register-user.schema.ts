import { z } from 'zod';

export const RegisterUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
});
