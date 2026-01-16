import { ReactNode } from 'react'
import { cn } from '../../../shared/utils/cn';

type Props = {
  action?: ReactNode
  className?: string
}

export function AuthHeader({ action, className }: Props) {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-8 py-5',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 text-[#2FA4A9]">
        <div className="size-8">
          <svg fill="none" viewBox="0 0 48 48">
            <path
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-lg font-semibold">
          Forge Web
        </span>
      </div>

      {/* Acción derecha */}
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </header>
  )
}
