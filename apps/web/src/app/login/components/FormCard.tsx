"use client" // Importante: Los formularios con react-hook-form DEBEN ser Client Components

import { FormProvider, type UseFormReturn, type FieldValues } from 'react-hook-form'
import { ReactNode } from 'react'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export default function FormCard<T extends FieldValues>({
  form,
  onSubmit,
  title,
  description,
  footer,
  children
}: Props<T>) {
  return (
    <FormProvider {...form}>
       <div className="relative mt-20 w-full max-w-md mx-auto">
           <div
      className="
       absolute -inset-4
    dark:bg-gradient-to-t from-orange-500/30 to-transparent
    blur-3xl
    pointer-events-none
      "
    />
      <form
        onSubmit={form.handleSubmit(onSubmit)} 
        className="
         relative
      rounded-2xl
      px-8 py-9
      bg-white dark:bg-brand-bg
      border border-white/10
      dark:shadow-6xl
      dark:shadow-primary
      space-y-6
      "
      >
        {(title || description) && (
          <div className="text-center space-y-1.5 mb-4">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-brand-primary">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-xs text-gray-400">
            {footer}
          </div>
        )}
      </form>
      </div>
    </FormProvider>
  )
}