import { z } from 'zod'
import { TaskCategory, TaskPriority } from './task-form.types'
import { FORM_DEFAULTS } from './task-form.constants'

export const CreateTaskFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(FORM_DEFAULTS.MAX_TITLE_LENGTH, 'Title too long'),
  description: z.string()
    .max(FORM_DEFAULTS.MAX_DESCRIPTION_LENGTH, 'Description too long')
    .optional(),
  category: z.nativeEnum(TaskCategory)
    .default(FORM_DEFAULTS.CATEGORY),
  priority: z.nativeEnum(TaskPriority)
    .default(FORM_DEFAULTS.PRIORITY),
  tags: z.array(z.string())
    .max(FORM_DEFAULTS.MAX_TAGS)
    .default([]),
  assigneeId: z.string().optional(),
})

export type CreateTaskFormData = z.infer<typeof CreateTaskFormSchema>