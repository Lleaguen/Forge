import { Button } from '@/components/shared/button'

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-brand-text">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-brand-textMuted">
          Overview of your workspace
        </p>
      </div>

    </div>
  )
}
