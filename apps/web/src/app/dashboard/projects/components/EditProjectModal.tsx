'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Input } from '@/components/ui'
import { Form } from '@/components/forms'
import { useUpdateProject } from '@/app/hooks'
import { Project } from '@/app/api/projects.api'

const editProjectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional()
})

type EditProjectForm = z.infer<typeof editProjectSchema>

interface Props {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function EditProjectModal({ project, isOpen, onClose, onSuccess }: Props) {
  const updateProjectMutation = useUpdateProject()
  
  const form = useForm<EditProjectForm>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || ''
      })
    }
  }, [project, form])

  const handleSubmit = async (data: EditProjectForm) => {
    if (!project) return

    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        payload: data
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handling is done by the error handler hook
    }
  }

  const actions = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancelar
      </Button>
      <Button 
        type="submit" 
        form="edit-project-form"
        loading={updateProjectMutation.isPending}
      >
        Guardar cambios
      </Button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen && !!project}
      onClose={onClose}
      title="Editar Proyecto"
      maxWidth="max-w-md"
      actions={actions}
    >
      <Form
        form={form}
        onSubmit={handleSubmit}
        id="edit-project-form"
      >
        <Input
          label="Nombre del proyecto"
          placeholder="Ingresa el nombre del proyecto"
          required
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />

        <Input
          as="textarea"
          label="Descripción"
          placeholder="Describe tu proyecto"
          rows={3}
          error={form.formState.errors.description?.message}
          {...form.register('description')}
        />
      </Form>
    </Modal>
  )
}