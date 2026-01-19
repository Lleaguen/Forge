import { useState } from 'react'
import { Button, Input, FormCard, FormField, Stepper, PLANS, PlanCard } from '../../../shared/components/ui'
import { AuthHeader, AuthMain } from '../components'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { AiOutlineGoogle, AiOutlineGithub } from 'react-icons/ai'

export function RegisterPage() {
  const [step, setStep] = useState(1)
  const { form, onSubmit, isLoading } = useRegisterForm()

  const STEPS = [
    {
      id: 1,
      label: 'Step 1 of 2: Basic Setup',
      description: 'Account details and verification',
      progress: 0.5,
      fields: ['fullName', 'email', 'password']
    },
    {
      id: 2,
      label: 'Step 2 of 2: Choose Plan',
      description: 'Select the plan that fits your needs',
      progress: 1,
      fields: ['plan']
    }
  ] as const

  const {
    register,
    formState: { errors },
    trigger,
    watch,
    setValue
  } = form

  const currentStep = STEPS[step - 1]

  const handleContinue = async () => {
    const isValid = await trigger(currentStep.fields)
    if (isValid) setStep(2)
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-white">
      <AuthHeader action={<Button to="/login">Sign In</Button>} />
      <AuthMain>
        <FormCard form={form}title={<Stepper steps={STEPS} currentStep={step} />}footer="© 2024 Forge Web Inc. All rights reserved."onSubmit={onSubmit}>
          {step === 1 && (
            <>
              <FormField label="Full Name" error={errors.fullName?.message}>
                <Input placeholder="Jane Doe"hasError={!!errors.fullName}{...register('fullName')}/>
              </FormField>
              <FormField label="Work Email" error={errors.email?.message}>
                <Input type="email"placeholder="jane@company.com"hasError={!!errors.email}{...register('email')}/>
              </FormField>
              <FormField label="Password" error={errors.password?.message}>
                <Input type="password"placeholder="••••••••"hasError={!!errors.password}{...register('password')}/>
                <div className="mt-2 space-y-1">
                  <div className="flex gap-2">
                    {[2, 4, 6, 8].map(n => (
                      <span
                        key={n}
                        className={`h-1 flex-1 rounded ${
                          password.length >= n
                            ? 'bg-emerald-600'
                            : 'bg-emerald-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-emerald-700">
                    {passwordStrength}
                  </span>
                </div>
              </FormField>
              <Button type="button" onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-4">
                {PLANS.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlan === plan.id}
                    onSelect={id =>
                      setValue('plan', id, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
              <Button type="submit"variant="primary"disabled={!selectedPlan}isLoading={isLoading}className="w-full">Register</Button>
              <div className="flex items-center gap-4 my-6">
                <span className="h-px flex-1 bg-emerald-100" />
                <span className="text-xs text-emerald-700 font-medium">OR CONTINUE WITH</span>
                <span className="h-px flex-1 bg-emerald-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline"><AiOutlineGoogle />Google</Button>
                <Button variant="outline"><AiOutlineGithub />GitHub</Button>
              </div>
            </>
          )}
        </FormCard>
      </AuthMain>
    </div>
  )
}
