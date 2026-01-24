'use client'

import { useForm } from 'react-hook-form'
import { FiUsers } from 'react-icons/fi'
import { Input } from '../../../components/shared/input'
import { useAuth } from '@/app/hooks/useAuth'
import { Button } from '../../../components/shared/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
})

type PersonalInfoForm = z.infer<typeof personalInfoSchema>

export default function PersonalInf() {
  const { user, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    values: user
      ? {
          fullName: user.fullName,
          email: user.email,
          bio: '',
        }
      : undefined,
  })

  const onSubmit = async (data: PersonalInfoForm) => {
    // TODO: Implementar actualización de perfil
    console.log('Updating profile:', data)
  }

  if (isLoading) {
    return (
      <section className="mb-6 w-full rounded-2xl border border-brand-border bg-white shadow-sm dark:border-none dark:bg-brand-surface">
        <div className="flex items-center justify-between border-b border-brand-border px-8 py-5">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="mb-6 w-full rounded-2xl border border-brand-border bg-white shadow-sm dark:border-none dark:bg-brand-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border px-8 py-5">
        <div className="flex items-center gap-3">
          <FiUsers className="text-brand-primary" />
          <h3 className="font-bold text-slate-800 dark:text-brand-text">
            Personal Information
          </h3>
        </div>

        <span className="text-[11px] italic text-slate-400 dark:text-brand-textMuted">
          Auto-saves to cloud
        </span>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Input
              label="Full Name"
              hasError={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Email Address"
              type="email"
              hasError={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-700 dark:text-brand-text">
            Short Bio
          </label>

          <textarea
            rows={4}
            {...register('bio')}
            placeholder="Tell us about yourself..."
            className="
              w-full resize-none rounded-xl
              border border-brand-border
              bg-white px-4 py-3 text-sm
              outline-none
              transition-colors
              focus:border-brand-primary
              dark:border-none
              dark:bg-brand-bg
              dark:text-brand-text
            "
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => reset()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  )
}
