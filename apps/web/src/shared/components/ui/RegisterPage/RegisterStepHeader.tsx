type Step = {
  id: number
  label: string
  description: string
  progress: number
  fields: readonly string[]
}

type Props = {
  steps: readonly Step[]
  currentStep: number // 1-based
}

export function Stepper({ steps, currentStep }: Props) {
  const totalSteps = steps.length
  const stepIndex = Math.max(0, currentStep - 1)
  const progress = (currentStep - 1) / (totalSteps - 1 || 1)
  const isLast = currentStep === totalSteps

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {steps[stepIndex]?.label}
        </span>
        <span className="text-xs font-semibold text-[#2FA4A9]">
          {isLast ? 'FINAL' : 'ACTIVE'}
        </span>
      </div>

      <div className="h-1 w-full rounded-full bg-emerald-100 overflow-hidden">
        <div
          className="h-full bg-[#2FA4A9] rounded-full transition-all duration-300"
          style={{ width: `${(steps[stepIndex]?.progress ?? 50) * 100}%` }}
        />
      </div>

      <p className="text-sm text-[#2FA4A9]">
        {steps[stepIndex]?.description}
      </p>
    </div>
  )
}