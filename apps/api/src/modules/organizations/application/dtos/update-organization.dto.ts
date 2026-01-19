import { z } from 'zod';

export const UpdateOrganizationDtoSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export type UpdateOrganizationDto = z.infer<typeof UpdateOrganizationDtoSchema>;
