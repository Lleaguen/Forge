'use client'

import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { FiMail } from 'react-icons/fi'

import { Stepper } from '@/app/register/components/RegisterStepHeader'
import { Button, Input } from '@/components/shared'
import FormCard from '@/app/login/components/FormCard'
import { FormField } from '@/app/login/components/FormField'

type InviteTeamForm = {
  emails: { value: string }[]
}

export default function InviteTeamPage() {
  const router = useRouter()

  const form = useForm<InviteTeamForm>({
    defaultValues: {
      emails: [{ value: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'emails'
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

  const onSubmit = (data: InviteTeamForm) => {
    router.push('/dashboard')
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Stepper */}

      <FormCard
        form={form}
        onSubmit={onSubmit}
        title={
          <>
          <div className='mb-8'>
          <Stepper steps={STEPS} currentStep={3} />
            </div>

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <FiMail size={22} />
            </div>
            Invite your team
          </>
        }
        description={
        <div className="mb-8">
                

          <span className="text-brand-primary">
            Invite teammates by email. You can skip this step for now.
          </span>
            </div>
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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="text-brand-primary/60 hover:text-brand-primary"
              >
                Skip
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
                Finish →
              </Button>
            </div>
          </div>
        }
      >
        {fields.map((field, index) => (
          <FormField    
            key={field.id}
            label={`Email ${index + 1}`}
            error={form.formState.errors.emails?.[index]?.value?.message}
            action={
              fields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs text-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              ) : null
            }
          >
            <Input
              {...form.register(`emails.${index}.value`, {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="user@company.com"
              className="placeholder:text-brand-primary/40"
            />
          </FormField>
        ))}

        <Button
          type="button"
          variant="ghost"
          onClick={() => append({ value: '' })}
          className="w-full text-brand-primary hover:text-brand-primary"
        >
          + Add another email
        </Button>
      </FormCard>
    </div>
  )
}
