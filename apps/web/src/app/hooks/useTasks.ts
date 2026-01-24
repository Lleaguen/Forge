'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from '../api/tasks.api'
import { queryKeys } from '../shared/api/queryKeys'

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId),
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(data.projectId) })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, payload, projectId }: { taskId: string; payload: UpdateTaskPayload; projectId: string }) =>
      updateTask(taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(variables.projectId) })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, projectId }: { taskId: string; projectId: string }) => deleteTask(taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(variables.projectId) })
    },
  })
}
