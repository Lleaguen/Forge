import { Children, ReactNode } from 'react'
import { cn } from '../../../shared/utils/cn';


type Props = {
  bottom?: ReactNode
  className?: string
  children?: ReactNode
}

export function AuthMain({ bottom, className, children}: Props) {
  return (
    <main
      className={cn(
        "flex-1 flex items-center justify-center px-4",
        className
      )}
    >
      {/* Zona central */}
      <section className="flex justify-center w-full max-w-[420px]">
        {children}
      </section>
      
      {/* Zona inferior */}
      {bottom && (
        <section className="mt-8">
          {bottom}
        </section>
      )}
    </main>
  )
}
