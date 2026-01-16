import { FormProvider, type UseFormReturn, type FieldValues } from 'react-hook-form'
import { ReactNode } from 'react'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  title?: string
  description?: string
  footer?: ReactNode
  children: ReactNode
}

export function FormCard<T extends FieldValues>({
  form,
  onSubmit,
  title,
  description,
  footer,
  children
}: Props<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)} 
        className="bg-white rounded-2xl px-8 py-9 shadow
             border border-gray-100 space-y-6 w-full"
      >
        {(title || description) && (
          <div className="text-center space-y-1">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}

        {children}

        {footer && (
          <p className="mt-6 text-center text-xs text-gray-400">
            {footer}
          </p>
        )}
      </form>
    </FormProvider>
  )
}
