'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getTasksByProject,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from '../api/tasks.api'
import { queryKeys } from '../shared/api/queryKeys'
import { useGenericMutation } from './useGenericMutation'

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId),
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  })
}

export function useCreateTask() {
  return useGenericMutation<any, CreateTaskPayload>({
    mutationFn: createTask,
    invalidateKeys: (data) => [queryKeys.tasks.byProject(data.projectId)],
    successMessage: 'Task created successfully.',
  })
}

export function useUpdateTask() {
  return useGenericMutation<any, {
    taskId: string
    payload: UpdateTaskPayload
    projectId: string
    useStatusEndpoint?: boolean
    silent?: boolean
  }>({
    mutationFn: ({ taskId, payload, useStatusEndpoint }) => {
      if (useStatusEndpoint && payload.status) {
        return moveTask(taskId, payload.status)
      }
      return updateTask(taskId, payload)
    },
    invalidateKeys: (_, variables) => [queryKeys.tasks.byProject(variables.projectId)],
    successMessage: (_, variables) => {
      if (variables.silent) return ''
      return variables.useStatusEndpoint
        ? 'Task moved successfully.'
        : 'Task updated successfully.'
    },
  })
}

export function useDeleteTask() {
  return useGenericMutation<any, { taskId: string; projectId: string }>({
    mutationFn: ({ taskId }) => deleteTask(taskId),
    invalidateKeys: (_, variables) => [queryKeys.tasks.byProject(variables.projectId)],
    successMessage: 'Task deleted successfully.',
  })
}
