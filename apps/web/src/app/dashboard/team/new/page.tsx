'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FiUsers } from 'react-icons/fi'

import { Stepper } from '@/app/register/components/RegisterStepHeader'
import { Button, Input } from '@/components/shared'
import FormCard from '@/app/login/components/FormCard'
import { FormField } from '@/app/login/components/FormField'

type CreateTeamForm = {
  teamName: string
  description?: string
}

export default function CreateTeamPage() {
  const router = useRouter()

  const form = useForm<CreateTeamForm>({
    defaultValues: {
      teamName: '',
      description: ''
    }
  })

  const STEPS = [
    {
      id: 1,
      label: 'Workspace setup',
      description: 'Create your organization',
      progress: 0.5,
      fields: ['organizationName'],
    },
    {
      id: 2,
      label: 'Workspace setup',
      description: 'Create your team',
      progress: 0.75,
      fields: ['teamName', 'description'],
    },
    {
      id: 3,
      label: 'Workspace setup',
      description: 'Invite your team',
      progress: 1,
      fields: ['emails'],
    },
  ] as const

  const onSubmit = (data: CreateTeamForm) => {
    console.log(data)
    router.push('/dashboard/team/new/invite')
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Stepper */}
     

      <FormCard
        form={form}
        onSubmit={onSubmit}
        title={
          <>
           <div className="mb-8">
                <Stepper steps={STEPS} currentStep={2} />
            </div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <FiUsers size={22} />
            </div>
            Create your team
          </>
        }
        description={
          <span className="text-brand-primary">
            Teams help organize people and permissions inside your organization.
          </span>
        }
        footer={
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="text-brand-primary/60 hover:text-brand-primary"
            >
              ← Back
            </Button>

            <Button
              type="submit"
              className="
                inline-flex items-center gap-2
                bg-brand-primary
                px-5 py-2.5
                text-sm font-medium
                text-background
                hover:opacity-90
                transition
              "
            >
              Continue →
            </Button>
          </div>
        }
      >
        {/* Team name */}
        <FormField
          label="Team name"
          error={form.formState.errors.teamName?.message}
        >
          <Input
            {...form.register('teamName', {
              required: 'Team name is required'
            })}
            placeholder="e.g. Product Team"
            className="placeholder:text-brand-primary/40"
          />
        </FormField>

        {/* Description */}
        <FormField
          label="Description (optional)"
          error={form.formState.errors.description?.message}
        >
          <textarea
            {...form.register('description')}
            rows={3}
            placeholder="What does this team work on?"
            className="
              w-full rounded-md
              bg-background dark:bg-brand-bg
              border border-brand-primary/30
              px-3 py-2
              text-foreground dark:text-brand-primary
              placeholder:text-brand-primary/40
              focus:outline-none
              focus:ring-2
              focus:ring-brand-primary
            "
          />
        </FormField>
      </FormCard>
    </div>
  )
}
