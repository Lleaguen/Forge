'use client'

import { ReactNode } from 'react'

interface StatusBadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  children: ReactNode
  className?: string
}

export function StatusBadge({ 
  variant = 'neutral', 
  size = 'md', 
  children, 
  className = '' 
}: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium'
  
  const variantClasses = {
    success: 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-500/10',
    warning: 'text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-500/10',
    error: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10',
    info: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10',
    neutral: 'text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-500/10'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs'
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}