import { LabelHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className, ...props }: Props) {
  return (
    <label
      className={cn(
        'text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    />
  )
}
