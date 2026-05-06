'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getColumnsByProject,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  type CreateColumnPayload,
  type UpdateColumnPayload,
} from '../api/columns.api'
import { queryKeys } from '../shared/api/queryKeys'

export function useColumns(projectId: string) {
  return useQuery({
    queryKey: queryKeys.columns.byProject(projectId),
    queryFn: () => {
      return getColumnsByProject(projectId)
    },
    enabled: !!projectId,
  })
}

export function useCreateColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateColumnPayload) => {
      return createColumn(payload)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns.byProject(data.projectId) })
    },
    onError: (error) => {
      console.error('❌ Error creating column:', error)
    }
  })
}

export function useUpdateColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload, projectId }: { id: string; payload: UpdateColumnPayload; projectId: string }) =>
      updateColumn(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns.byProject(variables.projectId) })
    },
  })
}

export function useDeleteColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => deleteColumn(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns.byProject(variables.projectId) })
    },
  })
}

export function useReorderColumns() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, columnIds }: { projectId: string; columnIds: string[] }) =>
      reorderColumns(projectId, columnIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.columns.byProject(variables.projectId) })
    },
  })
}