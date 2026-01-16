import { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        'border rounded px-3 py-2 w-full',
        className
      )}
      {...props}
    />
  )
}
