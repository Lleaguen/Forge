'use client'

import { ReactNode, FormHTMLAttributes } from 'react'
import { UseFormReturn, FieldValues } from 'react-hook-form'

interface FormProps<T extends FieldValues> extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void | Promise<void>
  children: ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = '',
  ...props
}: FormProps<T>) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={`space-y-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  )
}