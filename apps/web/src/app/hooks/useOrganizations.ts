'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type CreateOrganizationPayload,
  type UpdateOrganizationPayload,
} from '../api/organizations.api'
import { queryKeys } from '../shared/api/queryKeys'

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) => createOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrganizationPayload }) =>
      updateOrganization(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}
