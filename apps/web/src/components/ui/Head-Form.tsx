import { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import Logo from '../shared/Logo'

type Props = {
  action?: ReactNode
  className?: string
}
export default function HeaderForm({ action, className }: Props) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-8 min-h-[20px] mt-4",
        'dark:bg-transparent bg-white',
        className
      )}
    >
      {/* Logo */}
      <Logo />

      {/* Acción derecha */}
      {action && (
        <div className="shrink-0 flex ">
          {action}
        </div>
      )}
    </header>
  )
  ;
}