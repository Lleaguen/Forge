'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { IconType } from 'react-icons'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconType
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary/20',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18
  }
  
  const isDisabled = disabled || loading
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={iconSize[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={iconSize[size]} />}
        </>
      )}
    </button>
  )
}