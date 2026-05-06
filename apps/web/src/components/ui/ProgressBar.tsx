'use client'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className = ''
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const colorClasses = {
    primary: 'bg-brand-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  
  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label || 'Progress'}
          </span>
          {showLabel && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700 ${sizeClasses[size]}`}>
        <div
          className={`h-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}