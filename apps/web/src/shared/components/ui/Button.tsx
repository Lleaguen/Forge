import { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, ...props }: Props) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded bg-black text-white disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
