type Props = {
  title: string
  value: string
  colSpan?: number
}

export default function StatCard({ title, value, colSpan = 3 }: Props) {
  return (
    <div
      className={`col-span-${colSpan} rounded-2xl border border-brand-light-border bg-brand-light-surface p-6
      shadow-sm shadow-brand-light-accentSoft
      dark:border-white/10 dark:bg-brand-surface dark:shadow-none`}
    >
      <p className="text-sm text-brand-light-muted dark:text-brand-Muted">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-brand-light-accent dark:text-brand-primary">
        {value}
      </p>
    </div>
  )
}
