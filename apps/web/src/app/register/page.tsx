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
import { Stepper } from './components/RegisterStepHeader'
import { AuthGuard } from '../components/AuthGuard'

export default function RegisterPage() {
  const [step, setStep] = useState(1)

  const { form, onSubmit, isLoading } = useRegisterForm()

  const STEPS = [
    {
      id: 1,
      label: 'Step 1 of 2: Basic Information',
      description: 'Enter your personal details',
      progress: 0.5,
      fields: ['fullName', 'email', 'confirmEmail'],
    },
    {
      id: 2,
      label: 'Step 2 of 2: Security',
      description: 'Set up your password',
      progress: 1,
      fields: ['password', 'confirmPassword'],
    },
  ] as const

  const {
    register,
    formState: { errors },
    trigger,
    watch,
  } = form

  const currentStep = STEPS[step - 1]

  const handleContinue = async () => {
    // Validate step 1 fields individually first
    const fieldsValid = await trigger([...currentStep.fields])
    
    // Also check cross-field validation (email match)
    if (fieldsValid) {
      const emailVal = form.getValues('email')
      const confirmEmailVal = form.getValues('confirmEmail')
      if (emailVal !== confirmEmailVal) {
        form.setError('confirmEmail', { message: 'Email addresses do not match' })
        return
      }
      setStep((prev) => prev + 1)
    }
  }

  const handleSubmit = async (data: any) => {
    // Validate password match before submitting
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }
    onSubmit(data)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const password = watch('password') ?? ''

  const passwordStrength =
    password.length >= 8
      ? 'STRONG'
      : password.length >= 6
      ? 'MEDIUM'
      : 'WEAK'

  return (
    <AuthGuard requireAuth={false}>
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
          onSubmit={handleSubmit}
        >
          {/* ---------------- STEP 1: Basic Information ---------------- */}
          {step === 1 && (
            <>
              <FormField label="Full Name" error={errors.fullName?.message}>
                <Input
                  placeholder="Jane Doe"
                  hasError={!!errors.fullName}
                  {...register('fullName')}
                />
              </FormField>

              <FormField label="Email Address" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="jane@company.com"
                  hasError={!!errors.email}
                  {...register('email')}
                />
              </FormField>

              <FormField label="Confirm Email Address" error={errors.confirmEmail?.message}>
                <Input
                  type="email"
                  placeholder="jane@company.com"
                  hasError={!!errors.confirmEmail}
                  {...register('confirmEmail')}
                />
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

          {/* ---------------- STEP 2: Security ---------------- */}
          {step === 2 && (
            <>
              <FormField label="Password" error={errors.password?.message}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  hasError={!!errors.password}
                  {...register('password')}
                />

                {/* Password strength */}
                {password && (
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
                )}
              </FormField>

              <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  hasError={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
              </FormField>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Create Account
                </Button>
              </div>

              <SocialAuth />
            </>
          )}
        </FormCard>
      </Main>
    </div>
    </AuthGuard>
  )
}