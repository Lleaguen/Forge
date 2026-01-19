import { cn } from '../../../utils/cn'
import type { Plan } from './plans'

type Props = {
  plan: Plan
  selected?: boolean
  onSelect: (id: Plan['id']) => void
}

export function PlanCard({ plan, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      className={cn(
        'w-full rounded-xl border p-5 text-left transition',
        'hover:border-[#2FA4A9]',
        selected
          ? 'border-[#2FA4A9] ring-2 ring-[#2FA4A9]/20'
          : 'border-gray-200',
        plan.highlighted && !selected && 'bg-emerald-50'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {plan.name}
        </h3>
        {plan.highlighted && (
          <span className="text-xs font-semibold text-[#2FA4A9]">
            RECOMMENDED
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500">{plan.description}</p>

      <p className="mt-4 text-2xl font-bold text-gray-900">
        {plan.price}
      </p>

      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {plan.features.map(feature => (
          <li key={feature} className="flex gap-2">
            <span className="text-[#2FA4A9]">✔</span>
            {feature}
          </li>
        ))}
      </ul>
    </button>
  )
}
