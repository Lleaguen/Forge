'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type CreateProjectPayload,
  type UpdateProjectPayload,
} from '../api/projects.api'
import { queryKeys } from '../shared/api/queryKeys'
import { useAuth } from './useAuth'

export function useProjects(organizationId?: string) {
  const { user } = useAuth()
  const orgId = organizationId || user?.organization?.id

  return useQuery({
    queryKey: [...queryKeys.projects.all, orgId],
    queryFn: () => getProjects(orgId!),
    enabled: !!orgId,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (payload: Omit<CreateProjectPayload, 'organizationId'>) => {
      if (!user?.organization?.id) {
        throw new Error('No organization selected')
      }
      return createProject({ ...payload, organizationId: user.organization.id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      router.push('/dashboard/projects')
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectPayload }) =>
      updateProject(id, payload),
    onSuccess: () => {
      const orgId = user?.organization?.id
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: [...queryKeys.projects.all, orgId] })
      }
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      const orgId = user?.organization?.id
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: [...queryKeys.projects.all, orgId] })
      }
      router.push('/dashboard/projects')
    },
  })
}
