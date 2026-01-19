// RegisterStepPlan.tsx
import { useFormContext } from 'react-hook-form'
import { Button } from '..'
import { PLANS } from './plans'
import { PlanCard } from './planCard'

type Props = {
  onContinue: () => void
}

export function RegisterStepPlan({ onContinue }: Props) {
  const { setValue, watch } = useFormContext()
  const selectedPlan = watch('plan')

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {PLANS.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={(id) => setValue('plan', id, { shouldValidate: true })}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="primary"
        disabled={!selectedPlan}
        onClick={onContinue}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  )
}
