'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getProjectMembers,
  inviteProjectMember,
  updateProjectMember,
  removeProjectMember,
  getProjectInvitations,
  acceptInvitation,
  rejectInvitation,
  type InviteMemberPayload,
  type UpdateMemberPayload,
} from '../api/members.api'
import { queryKeys } from '../shared/api/queryKeys'
import { useGenericMutation } from './useGenericMutation'

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: queryKeys.members.byProject(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  })
}

export function useInviteProjectMember() {
  return useGenericMutation<any, { projectId: string; payload: InviteMemberPayload }>({
    mutationFn: ({ projectId, payload }) => inviteProjectMember(projectId, payload),
    invalidateKeys: (_, variables) => [queryKeys.members.byProject(variables.projectId)],
    successMessage: 'Invitation sent successfully.',
  })
}

export function useProjectInvitations(projectId: string) {
  return useQuery({
    queryKey: ['invitations', projectId],
    queryFn: () => getProjectInvitations(projectId),
    enabled: !!projectId,
  })
}

export function useAcceptInvitation() {
  return useGenericMutation<any, string>({
    mutationFn: acceptInvitation,
    invalidateKeys: [queryKeys.projects.all],
    successMessage: 'Invitation accepted successfully.',
  })
}

export function useRejectInvitation() {
  return useGenericMutation<any, string>({
    mutationFn: rejectInvitation,
    successMessage: 'Invitation declined.',
  })
}

export function useUpdateProjectMember() {
  return useGenericMutation<any, {
    projectId: string
    memberId: string
    payload: UpdateMemberPayload
  }>({
    mutationFn: ({ projectId, memberId, payload }) =>
      updateProjectMember(projectId, memberId, payload),
    invalidateKeys: (_, variables) => [queryKeys.members.byProject(variables.projectId)],
    successMessage: 'Member role updated.',
  })
}

export function useRemoveProjectMember() {
  return useGenericMutation<any, { projectId: string; memberId: string }>({
    mutationFn: ({ projectId, memberId }) => removeProjectMember(projectId, memberId),
    invalidateKeys: (_, variables) => [queryKeys.members.byProject(variables.projectId)],
    successMessage: 'Member removed from project.',
  })
}
