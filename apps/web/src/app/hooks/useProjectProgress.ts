import { useTasks } from './useTasks'

export function useProjectProgress(projectId: string) {
  const { data: tasks, isLoading } = useTasks(projectId)

  if (isLoading || !tasks || !Array.isArray(tasks)) {
    return {
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      isLoading
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'DONE').length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return {
    progress,
    totalTasks,
    completedTasks,
    isLoading: false
  }
}