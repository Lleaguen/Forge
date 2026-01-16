import { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Label } from './Label'

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
        <Label>{label}</Label>
        {action && (
          <div className="text-xs">
            {action}
          </div>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
