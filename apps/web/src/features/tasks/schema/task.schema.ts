import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(['todo', 'in-progress', 'done'])
})

export type TaskSchema = z.infer<typeof taskSchema>
export const taskUpdateSchema = taskSchema.partial()