import { z } from 'zod'

// Enum schemas
export const TaskCategorySchema = z.enum([
  'DEVELOPMENT',
  'DESIGN', 
  'ARCHITECTURE',
  'TESTING',
  'DOCUMENTATION',
  'RESEARCH',
  'DEPLOYMENT',
  'MAINTENANCE',
  'PLANNING',
  'REVIEW'
])

export const TaskPrioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH', 
  'URGENT',
  'CRITICAL'
])

export const TaskStatusSchema = z.enum([
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'BLOCKED',
  'DONE',
  'CANCELLED'
])

// Create task schema with business rules
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
    
  projectId: z
    .string()
    .uuid('Invalid project ID format'),
    
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
    
  category: TaskCategorySchema
    .default('DEVELOPMENT'),
    
  priority: TaskPrioritySchema
    .default('MEDIUM'),
    
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'Cannot have more than 10 tags')
    .default([])
    .transform((tags) => 
      tags ? [...new Set(tags.map(tag => tag.trim().toLowerCase()))] : []
    )
})

// Update task schema
export const UpdateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
    
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
    
  category: TaskCategorySchema.optional(),
  priority: TaskPrioritySchema.optional(),
  status: TaskStatusSchema.optional(),
    
  tags: z.array(z.string().min(1).max(50))
    .max(10, 'Cannot have more than 10 tags')
    .optional()
    .transform((tags) => 
      tags ? [...new Set(tags.map(tag => tag.trim().toLowerCase()))] : undefined
    )
})

// Status update schema
export const UpdateTaskStatusSchema = z.object({
  status: TaskStatusSchema
})

// Time entry schema
export const AddTimeEntrySchema = z.object({
  hours: z
    .number()
    .min(0.1, 'Hours must be at least 0.1')
    .max(24, 'Cannot log more than 24 hours per entry'),
    
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
    
  date: z
    .string()
    .datetime('Invalid date format')
    .optional()
    .refine((date) => {
      if (!date) return true
      const entryDate = new Date(date)
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      return entryDate >= thirtyDaysAgo && entryDate <= today
    }, 'Date must be within the last 30 days')
})

// Filters schema
export const TaskFiltersSchema = z.object({
  projectId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  status: z.array(TaskStatusSchema).optional(),
  priority: z.array(TaskPrioritySchema).optional(),
  category: z.array(TaskCategorySchema).optional(),
  tags: z.array(z.string()).optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  overdue: z.boolean().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})