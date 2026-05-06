'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiPlus, FiTrash2, FiUser, FiUserCheck } from 'react-icons/fi'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Form } from '@/components/forms/Form'
import { LoadingState } from '@/components/states/LoadingState'
import { useProjectMembers, useInviteProjectMember, useRemoveProjectMember, useUpdateProjectMember, useProjectInvitations } from '@/app/hooks/useMembers'
import { getNotificationsByEmail } from '@/app/api/notifications.api'

const inviteMemberSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER')
})

type InviteMemberForm = z.infer<typeof inviteMemberSchema>

interface Props {
  projectId: string | null
  projectName: string
  isOpen: boolean
  onClose: () => void
}

export default function ManageMembersModal({ projectId, projectName, isOpen, onClose }: Props) {
  const { data: members, isLoading, error } = useProjectMembers(projectId || '')
  const { data: invitations, isLoading: invitationsLoading } = useProjectInvitations(projectId || '')
  const inviteMemberMutation = useInviteProjectMember()
  const removeMemberMutation = useRemoveProjectMember()
  const updateMemberMutation = useUpdateProjectMember()
  
  const form = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: '', role: 'MEMBER' }
  })

  const handleInviteMember = async (data: InviteMemberForm) => {
    if (!projectId) return
    
    inviteMemberMutation.mutate({
      projectId,
      payload: {
        email: data.email,
        role: data.role
      }
    }, {
      onSuccess: async () => {
        form.reset()
        
        // Debug: Check if notification was created for the invited user
        try {
          const userNotifications = await getNotificationsByEmail(data.email)
          console.log('🔔 Notifications for invited user:', userNotifications)
        } catch (error) {
          console.error('🔔 Error checking notifications for invited user:', error)
        }
      }
    })
  }

  const handleRemoveMember = (memberId: string) => {
    if (!projectId) return
    
    if (confirm('¿Estás seguro de que quieres remover este miembro del proyecto?')) {
      removeMemberMutation.mutate({ projectId, memberId })
    }
  }

  const handleUpdateRole = (memberId: string, newRole: 'ADMIN' | 'MEMBER') => {
    if (!projectId) return
    
    updateMemberMutation.mutate({
      projectId,
      memberId,
      payload: { role: newRole }
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
      case 'MEMBER':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  const actions = (
    <Button variant="secondary" onClick={onClose}>
      Cerrar
    </Button>
  )

  if (!isOpen || !projectId) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionar Miembros"
      subtitle={projectName}
      maxWidth="max-w-lg"
      actions={actions}
    >
      <div className="space-y-6">
        {/* Invite Member Form */}
        <Form form={form} onSubmit={handleInviteMember}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa el email del miembro"
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
              <select
                {...form.register('role')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="MEMBER">Miembro</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <Button 
              type="submit" 
              icon={FiPlus} 
              className="w-full"
              loading={inviteMemberMutation.isPending}
            >
              Enviar Invitación
            </Button>
          </div>
        </Form>

        {/* Pending Invitations */}
        {invitations && invitations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Invitaciones Pendientes ({invitations.length})
            </h3>
            <div className="max-h-32 space-y-2 overflow-y-auto">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
                      <FiUser size={14} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {invitation.email}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Invitado por {invitation.invitedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300">
                      {invitation.role}
                    </span>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      Pendiente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Miembros del proyecto {members && `(${members.length})`}
          </h3>
          
          {isLoading ? (
            <LoadingState message="Cargando miembros..." />
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400">
              Error al cargar miembros
            </div>
          ) : !members || members.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400">
              No hay miembros en este proyecto
            </div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                      {member.role === 'OWNER' ? (
                        <FiUserCheck size={14} className="text-purple-600 dark:text-purple-400" />
                      ) : (
                        <FiUser size={14} className="text-slate-600 dark:text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {member.user.fullName || member.user.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {member.role !== 'OWNER' ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value as 'ADMIN' | 'MEMBER')}
                        className={`rounded-full px-2 py-1 text-xs font-medium border-0 ${getRoleColor(member.role)}`}
                        disabled={updateMemberMutation.isPending}
                      >
                        <option value="MEMBER">Miembro</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(member.role)}`}>
                        Propietario
                      </span>
                    )}
                    
                    {member.role !== 'OWNER' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={FiTrash2}
                        onClick={() => handleRemoveMember(member.id)}
                        loading={removeMemberMutation.isPending}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}