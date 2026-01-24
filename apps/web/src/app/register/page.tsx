'use client'

import { useState } from 'react'

import HeaderForm from '../../components/ui/Head-Form'
import Main from '../../components/layout/main'
import Footer from '../../components/layout/footer'

import { Button } from '@/components/shared'
import { useRegisterForm } from '@/app/hooks/useRegisterForm'

import FormCard from '../login/components/FormCard'
import { FormField } from '../login/components/FormField'
import Input from '../../components/shared/input'

import SocialAuth from '@/components/shared/SocialAtuh'
import { PlanCard } from '@/components/ui/planCard'
import { Stepper } from './components/RegisterStepHeader'

import { PLANS } from '../../components/ui/plans'

export default function RegisterPage() {
  const [step, setStep] = useState(1)

  const { form, onSubmit, isLoading } = useRegisterForm()

  const STEPS = [
    {
      id: 1,
      label: 'Step 1 of 2: Basic Setup',
      description: 'Account details and verification',
      progress: 0.5,
      fields: ['fullName', 'email', 'password'],
    },
    {
      id: 2,
      label: 'Step 2 of 2: Choose Plan',
      description: 'Select the plan that fits your needs',
      progress: 1,
      fields: ['plan'],
    },
  ] as const

  const {
    register,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = form

  const currentStep = STEPS[step - 1]

  const handleContinue = async () => {
    const isValid = await trigger([...currentStep.fields])
    if (isValid) setStep((prev) => prev + 1)
  }

  const password = watch('password') ?? ''
  const selectedPlan = watch('plan')

  const passwordStrength =
    password.length >= 8
      ? 'STRONG'
      : password.length >= 6
      ? 'MEDIUM'
      : 'WEAK'

  return (
    <div className="
      min-h-screen flex flex-col
      bg-white
      dark:bg-gradient-to-b
      dark:from-brand-bg
      dark:to-brand-surface
    ">
      <HeaderForm
        className="items-center-safe"
        action={<Button href="/login">Sign In</Button>}
      />

      <Main bottom={<Footer />}>
        <FormCard
          form={form}
          title={<Stepper steps={STEPS} currentStep={step} />}
          footer="© 2024 Forge Web Inc. All rights reserved."
          onSubmit={onSubmit}
        >
          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <>
              <FormField label="Full Name" error={errors.fullName?.message}>
                <Input
                  placeholder="Jane Doe"
                  hasError={!!errors.fullName}
                  {...register('fullName')}
                />
              </FormField>

              <FormField label="Work Email" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="jane@company.com"
                  hasError={!!errors.email}
                  {...register('email')}
                />
              </FormField>

              <FormField label="Password" error={errors.password?.message}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  hasError={!!errors.password}
                  {...register('password')}
                  className='mb-10'
                />

                {/* Password strength */}
                <div className="mt-2 space-y-1">
                  <div className="flex gap-2">
                    {[2, 4, 6, 8].map((n) => (
                      <span
                        key={n}
                        className={`h-1 flex-1 rounded ${
                          password.length >= n
                            ? 'bg-brand-primary'
                            : 'bg-brand-primary/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-brand-primary">
                    {passwordStrength}
                  </span>
                </div>
              </FormField>

              <Button
                type="button"
                onClick={handleContinue}
                className="w-full"
              >
                Continue
              </Button>
            </>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <>
              <div className="grid gap-4">
                {PLANS.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlan === plan.id}
                    onSelect={(id) =>
                      setValue('plan', id, { shouldValidate: true })
                    }
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={!selectedPlan}
                isLoading={isLoading}
                className="w-full"
              >
                Register
              </Button>

              <SocialAuth />
            </>
          )}
        </FormCard>
      </Main>
    </div>
  )
}
