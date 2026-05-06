'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type CreateOrganizationPayload,
  type UpdateOrganizationPayload,
} from '../api/organizations.api'
import { useCreateMutation, useUpdateMutation, useDeleteMutation } from './useGenericMutation'

const ORGANIZATIONS_KEY = ['organizations']

export function useOrganizations() {
  return useQuery({
    queryKey: ORGANIZATIONS_KEY,
    queryFn: getOrganizations,
  })
}

export function useCreateOrganization() {
  return useCreateMutation(
    createOrganization,
    'Organization',
    [ORGANIZATIONS_KEY]
  )
}

export function useUpdateOrganization() {
  return useUpdateMutation(
    ({ id, payload }: { id: string; payload: UpdateOrganizationPayload }) =>
      updateOrganization(id, payload),
    'Organization',
    [ORGANIZATIONS_KEY]
  )
}

export function useDeleteOrganization() {
  return useDeleteMutation(
    deleteOrganization,
    'Organization',
    [ORGANIZATIONS_KEY]
  )
}
