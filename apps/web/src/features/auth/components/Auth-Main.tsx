import { ReactNode } from 'react'
import { cn } from '../../../shared/utils/cn';


type Props = {
  center?: ReactNode
  bottom?: ReactNode
  className?: string
}

export function AuthMain({ center, bottom, className }: Props) {
  return (
    <main
      className={cn(
        "flex-1 flex items-center justify-center px-4",
        className
      )}
    >
      {/* Zona central */}
      <section className="flex justify-center w-full max-w-[420px]">
        {center}
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
