type Props = {
  title: string
  value: string
  colSpan?: number
}

export default function StatCard({ title, value, colSpan = 3 }: Props) {
  return (
    <div
      className={`col-span-${colSpan} rounded-2xl border border-slate-200 bg-white p-6
      dark:border-white/10 dark:bg-brand-surface`}
    >
      <p className="text-sm text-slate-500 dark:text-brand-textMuted">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-brand-text">
        {value}
      </p>
    </div>
  )
}
