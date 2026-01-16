export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const
  },
  tasks: {
    byProject: (projectId: string) => ['tasks', projectId] as const
  }
}
