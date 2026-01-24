import { Children, ReactNode } from 'react'
import { cn } from '../../utils/cn';


type Props = {
  bottom?: ReactNode
  className?: string
  children?: ReactNode
  top?: ReactNode
} 

export default function Main({ bottom, className, children, top }: Props) {
  return (
    <main
      className={cn(
        "flex flex-col flex-1 items-center justify-center px-4 w-full  ",
        className
      )}
    >
      {top && (
        <section className="mb-8 w-full max-w-full">
          {top}
        </section>
      )}
      {/* Zona central */}
      <section className="flex justify-center w-full flex-col">
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
