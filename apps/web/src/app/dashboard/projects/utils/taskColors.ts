// Colores para categorías de tareas
export const CATEGORY_COLORS = {
  DEVELOPMENT: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  DESIGN: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  },
  ARCHITECTURE: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-700 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800'
  },
  TESTING: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  DOCUMENTATION: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  RESEARCH: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800'
  },
  DEPLOYMENT: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800'
  },
  MAINTENANCE: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  },
  PLANNING: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800'
  },
  REVIEW: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  // Legacy support
  BUG: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  },
  MEETING: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800'
  }
} as const

// Colores para prioridades
export const PRIORITY_COLORS = {
  LOW: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400'
  },
  MEDIUM: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500'
  },
  HIGH: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500'
  },
  URGENT: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500'
  },
  CRITICAL: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    dot: 'bg-red-600'
  }
} as const

// Función para obtener colores de categoría
export function getCategoryColors(category: string) {
  const normalizedCategory = category.toUpperCase() as keyof typeof CATEGORY_COLORS
  return CATEGORY_COLORS[normalizedCategory] || CATEGORY_COLORS.DEVELOPMENT
}

// Función para obtener colores de prioridad
export function getPriorityColors(priority: string) {
  const normalizedPriority = priority.toUpperCase() as keyof typeof PRIORITY_COLORS
  return PRIORITY_COLORS[normalizedPriority] || PRIORITY_COLORS.MEDIUM
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    DEVELOPMENT: 'Development',
    DESIGN: 'Design',
    ARCHITECTURE: 'Architecture',
    TESTING: 'Testing',
    DOCUMENTATION: 'Documentation',
    RESEARCH: 'Research',
    DEPLOYMENT: 'Deployment',
    MAINTENANCE: 'Maintenance',
    PLANNING: 'Planning',
    REVIEW: 'Review',
    BUG: 'Bug',
    MEETING: 'Meeting'
  }
  return names[category.toUpperCase()] || category
}

export function getPriorityDisplayName(priority: string): string {
  const names: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
    CRITICAL: 'Critical'
  }
  return names[priority.toUpperCase()] || priority
}