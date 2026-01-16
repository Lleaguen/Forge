import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(2)
})

export type ProjectSchema = z.infer<typeof projectSchema>

export const projectUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional()
})

export type ProjectUpdateSchema = z.infer<typeof projectUpdateSchema>