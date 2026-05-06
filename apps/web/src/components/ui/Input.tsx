'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface BaseInputProps {
  label?: string
  error?: string
  required?: boolean
  helperText?: string
}

interface InputProps extends BaseInputProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input'
}

interface TextareaProps extends BaseInputProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
}

type FormInputProps = InputProps | TextareaProps

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  ({ label, error, required, helperText, className = '', as = 'input', ...props }, ref) => {
    const baseClasses = 'w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2'
    const normalClasses = 'border-slate-300 focus:border-brand-primary focus:ring-brand-primary/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
    const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
    
    const inputClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {as === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClasses}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClasses}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'