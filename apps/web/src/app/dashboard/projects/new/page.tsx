'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { FiCalendar, FiSend } from 'react-icons/fi'
import { Button } from '@/components/shared/button'
import Input from '@/components/shared/input'
import { useCreateProject } from '@/app/hooks/useProjects'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Max 100 characters'),
  description: z.string().optional(),
})

type CreateProjectForm = z.infer<typeof createProjectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const createProject = useCreateProject()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
  })

  const onSubmit = async (data: CreateProjectForm) => {
    try {
      await createProject.mutateAsync(data)
      router.push('/dashboard/projects')
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl dark:bg-brand-surface">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
            <FiSend size={20} />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-brand-text">
            Create New Project
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-brand-textMuted">
            Set your project up for success by filling out the details below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Project name */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-brand-text">
              Project Name <span className="text-red-500">*</span>
            </label>

            <Input
              placeholder="e.g. Q4 Marketing Campaign"
              hasError={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">Max 100 characters.</p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-brand-text">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="What are the main goals of this project?"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-primary dark:border-white/10 dark:bg-brand-bg dark:text-brand-text"
              {...register('description')}
            />
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-4 border-t pt-6 dark:border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary" isLoading={isSubmitting || createProject.isPending}>
              Create Project →
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
