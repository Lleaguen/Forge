import { TaskCategory, TaskPriority, TaskCategoryOption, TaskPriorityOption } from './task-form.types'

export const TASK_CATEGORIES: TaskCategoryOption[] = [
  { value: TaskCategory.DEVELOPMENT, label: 'Development', description: 'Backend, Frontend, Full-stack development' },
  { value: TaskCategory.DESIGN, label: 'Design', description: 'UI/UX, Graphics, Prototyping' },
  { value: TaskCategory.ARCHITECTURE, label: 'Architecture', description: 'System design, Technical planning' },
  { value: TaskCategory.TESTING, label: 'Testing', description: 'QA, Unit tests, Integration tests' },
  { value: TaskCategory.DOCUMENTATION, label: 'Documentation', description: 'Technical docs, User guides' },
  { value: TaskCategory.RESEARCH, label: 'Research', description: 'Investigation, Proof of concepts' },
  { value: TaskCategory.DEPLOYMENT, label: 'Deployment', description: 'DevOps, Infrastructure, Releases' },
  { value: TaskCategory.MAINTENANCE, label: 'Maintenance', description: 'Bug fixes, Refactoring, Updates' },
  { value: TaskCategory.PLANNING, label: 'Planning', description: 'Project planning, Requirements gathering' },
  { value: TaskCategory.REVIEW, label: 'Review', description: 'Code review, Design review' },
]

export const TASK_PRIORITIES: TaskPriorityOption[] = [
  { value: TaskPriority.LOW, label: 'Low', color: 'text-green-600', description: 'Nice to have, can be delayed' },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'text-blue-600', description: 'Standard priority, planned work' },
  { value: TaskPriority.HIGH, label: 'High', color: 'text-orange-600', description: 'Important, should be done soon' },
  { value: TaskPriority.URGENT, label: 'Urgent', color: 'text-red-600', description: 'Critical, needs immediate attention' },
  { value: TaskPriority.CRITICAL, label: 'Critical', color: 'text-red-800', description: 'Blocking, highest priority' },
]

export const FORM_DEFAULTS = {
  CATEGORY: TaskCategory.DEVELOPMENT,
  PRIORITY: TaskPriority.MEDIUM,
  MAX_TAGS: 10,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
  TAG_MAX_LENGTH: 50,
} as const