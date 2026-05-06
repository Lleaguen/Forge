'use client'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  description?: string
}

export function FormField({ label, required, error, children, description }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      {children}
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}