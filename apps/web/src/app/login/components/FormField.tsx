import { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

type Props = {
  label: string
  error?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  action,
  children,
  className
}: Props) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <label className='dark:text-brand-text'>{label}</label>
        {action && (
          <div className="text-xs dark:text-brand-text">
            {action}
          </div>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs text-red-500 dark:text-brand-text">
          {error}
        </p>
      )}
    </div>
  )
}
