interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}
