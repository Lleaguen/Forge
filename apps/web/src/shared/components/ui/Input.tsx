import { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export function Input({ className, hasError, ...props }: Props) {
  return (
    <input
      className={cn(
        // Base (NO cambia diseño)
        'w-full h-12 px-4 rounded-lg bg-white text-sm placeholder-gray-400',
        'border focus:outline-none focus:ring-2 transition',

        // Normal
        !hasError &&
          'border-gray-200 focus:ring-[#2FA4A9] focus:border-[#2FA4A9]',

        // Error
        hasError &&
          'border-red-400 focus:ring-red-200',

        className
      )}
      {...props}
    />
  )
}
