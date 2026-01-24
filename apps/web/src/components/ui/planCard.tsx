import { cn } from '../../utils/cn'
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
        // base
        'w-full rounded-xl border p-5 text-left transition-all duration-200',
        'bg-white hover:bg-slate-50',
        'dark:bg-brand-surface dark:hover:bg-brand-surface2',

        // borders
        'border-slate-200 dark:border-white/10',

        // selected state
        selected && [
          'border-brand-primary',
          'ring-2 ring-brand-primary/30',
          'dark:ring-brand-primary/40',
        ],

        // highlighted (only when not selected)
        plan.highlighted &&
          !selected &&
          'bg-brand-primary/5 dark:bg-brand-primary/10'
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-brand-text">
          {plan.name}
        </h3>

        {plan.highlighted && (
          <span className="rounded-md bg-brand-primary/10 px-2 py-0.5 text-xs font-semibold text-brand-primary">
            RECOMMENDED
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-brand-textMuted">
        {plan.description}
      </p>

      {/* Price */}
      <p className="mt-4 text-2xl font-bold text-brand-primary">
        {plan.price}
      </p>

      {/* Features */}
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-brand-textMuted">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-[2px] text-brand-primary">✔</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  )
}
