'use client'

import { useForm } from 'react-hook-form'
import { useProjects, useUpdateProject } from '@/app/hooks/useProjects'
import { useAuth } from '@/app/hooks/useAuth'
import { LoadingState } from '@/components/states/LoadingState'
import { ErrorState } from '@/components/states/ErrorState'
import Input from '@/components/shared/input'
import { Button } from '@/components/shared'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const projectSettingsSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
})

type ProjectSettingsForm = z.infer<typeof projectSettingsSchema>

interface Props {
  projectId: string
}

export default function ProjectSettingsView({ projectId }: Props) {
  const { user } = useAuth()
  const { data: projects, isLoading } = useProjects(user?.organization?.id)
  const updateProject = useUpdateProject()
  
  const project = projects?.find((p) => p.id === projectId)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectSettingsForm>({
    resolver: zodResolver(projectSettingsSchema),
    values: project
      ? {
          name: project.name,
          description: project.description || '',
        }
      : undefined,
  })

  const onSubmit = async (data: ProjectSettingsForm) => {
    try {
      await updateProject.mutateAsync({
        id: projectId,
        payload: data,
      })
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingState message="Loading project settings..." />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorState message="Project not found." />
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto p-8">
      <h2 className="mb-6 text-2xl font-semibold">Project Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
        <div>
          <Input
            label="Project name"
            placeholder="Project name"
            hasError={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Description</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-white px-3 py-2 outline-none dark:bg-brand-bgCard"
            placeholder="Describe your project..."
            {...register('description')}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || updateProject.isPending}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
