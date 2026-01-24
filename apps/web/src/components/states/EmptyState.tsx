interface EmptyStateProps {
  message?: string
  action?: React.ReactNode
}

export function EmptyState({ message = 'No data available', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 dark:border-white/10">
      <div className="mb-4 rounded-full bg-slate-100 p-3 dark:bg-white/10">
        <svg
          className="h-6 w-6 text-slate-400 dark:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">{message}</p>
      {action}
    </div>
  )
}
