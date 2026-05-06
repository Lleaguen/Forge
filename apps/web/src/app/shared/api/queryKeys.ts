export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    byProject: (projectId: string) => ['tasks', projectId] as const,
    detail: (projectId: string, taskId: string) => ['tasks', projectId, taskId] as const,
  },
  columns: {
    byProject: (projectId: string) => ['columns', projectId] as const,
  },
  members: {
    byProject: (projectId: string) => ['members', projectId] as const,
  },
}
