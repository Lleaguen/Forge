'use client'

import { useQuery } from '@tanstack/react-query'
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
import { useCreateMutation, useUpdateMutation, useDeleteMutation, useGenericMutation } from './useGenericMutation'

export function useProjects(organizationId?: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: getProjects,
    enabled: !!user,
  })
}

export function useCreateProject() {
  return useCreateMutation(
    createProject,
    'Project',
    [queryKeys.projects.all],
    '/dashboard/projects'
  )
}

export function useUpdateProject() {
  return useUpdateMutation(
    ({ id, payload }: { id: string; payload: UpdateProjectPayload }) => updateProject(id, payload),
    'Project',
    [queryKeys.projects.all]
  )
}

export function useDeleteProject() {
  return useDeleteMutation(
    deleteProject,
    'Project',
    [queryKeys.projects.all],
    '/dashboard/projects'
  )
}

export function useDuplicateProject() {
  return useGenericMutation({
    mutationFn: async (project: { name: string; description?: string }) => {
      return createProject({
        name: `${project.name} (Copy)`,
        description: project.description
      })
    },
    invalidateKeys: [queryKeys.projects.all],
    successMessage: 'Project duplicated successfully.',
  })
}
