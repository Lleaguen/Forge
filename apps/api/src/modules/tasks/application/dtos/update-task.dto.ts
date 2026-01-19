import { z } from 'zod';

export const UpdateTaskDtoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  status: z.string().optional(),
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;
