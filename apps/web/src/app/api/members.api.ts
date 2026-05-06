'use client'
import { api } from '../shared/api/axios'

export interface Member {
  id: string
  userId: string
  projectId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
  user: {
    id: string
    email: string
    fullName?: string
    avatarUrl?: string
  }
}

export interface Invitation {
  id: string
  email: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED'
  projectName?: string
  organizationName?: string
  invitedBy?: string
  expiresAt: string
  createdAt: string
}

export interface InviteMemberPayload {
  email: string
  role?: 'ADMIN' | 'MEMBER'
}

export interface UpdateMemberPayload {
  role: 'ADMIN' | 'MEMBER'
}

export async function getProjectMembers(projectId: string): Promise<Member[]> {
  const response = await api.get(`/project-members/${projectId}/members`)
  return response.data.success ? response.data.data : response.data
}

export async function inviteProjectMember(projectId: string, payload: InviteMemberPayload): Promise<Invitation> {
  const response = await api.post(`/project-members/${projectId}/invite`, payload)
  return response.data.success ? response.data.data : response.data
}

export async function getProjectInvitations(projectId: string): Promise<Invitation[]> {
  const response = await api.get(`/project-members/${projectId}/invitations`)
  return response.data.success ? response.data.data : response.data
}

export async function acceptInvitation(token: string): Promise<any> {
  const response = await api.post(`/project-members/invitations/${token}/accept`)
  return response.data.success ? response.data.data : response.data
}

export async function rejectInvitation(token: string): Promise<void> {
  await api.post(`/project-members/invitations/${token}/reject`)
}

export async function updateProjectMember(projectId: string, memberId: string, payload: UpdateMemberPayload): Promise<Member> {
  const response = await api.patch(`/project-members/${projectId}/members/${memberId}`, payload)
  return response.data.success ? response.data.data : response.data
}

export async function removeProjectMember(projectId: string, memberId: string): Promise<void> {
  await api.delete(`/project-members/${projectId}/members/${memberId}`)
}