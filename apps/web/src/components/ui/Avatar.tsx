'use client'

import { ReactNode } from 'react'
import { FiUser } from 'react-icons/fi'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: ReactNode
  className?: string
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  className = '' 
}: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24
  }
  
  const baseClasses = 'inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700'
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={`${baseClasses} ${sizeClasses[size]} ${className} object-cover`}
      />
    )
  }
  
  return (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
      {fallback || (
        <FiUser 
          size={iconSizes[size]} 
          className="text-slate-600 dark:text-slate-400" 
        />
      )}
    </div>
  )
}

interface AvatarGroupProps {
  avatars: Array<{
    src?: string
    alt?: string
    fallback?: ReactNode
  }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function AvatarGroup({ 
  avatars, 
  max = 3, 
  size = 'sm', 
  className = '' 
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = Math.max(0, avatars.length - max)
  
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          className="ring-2 ring-white dark:ring-slate-800"
        />
      ))}
      
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallback={
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              +{remainingCount}
            </span>
          }
          className="ring-2 ring-white dark:ring-slate-800"
        />
      )}
    </div>
  )
}