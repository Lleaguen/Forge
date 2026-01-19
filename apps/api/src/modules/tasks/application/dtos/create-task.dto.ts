import { z } from 'zod';

export const CreateTaskDtoSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1).max(100),
  status: z.string().optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;
