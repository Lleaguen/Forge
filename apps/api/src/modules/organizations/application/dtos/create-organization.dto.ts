import { z } from 'zod';

export const CreateOrganizationDtoSchema = z.object({
  name: z.string().min(1).max(100),
});

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationDtoSchema>;
