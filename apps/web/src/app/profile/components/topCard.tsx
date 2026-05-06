'use client'

import { useRef, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { Button } from '../../../components/shared/button'
import { useAuth } from '@/app/hooks/useAuth'
import { notificationService } from '@/app/shared/services/notification.service'
import { format } from 'date-fns'
import { api } from '@/app/shared/api/axios'

export default function HeaderTop() {
  const { user, isLoading, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notificationService.error('Please select a valid image file.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notificationService.fileTooLarge('5MB')
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      await api.patch('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      notificationService.success('Profile picture updated successfully.')
      // Refresh user data globally so header and all components update
      refreshUser()
    } catch (error) {
      // Revert preview on error
      setPreviewUrl(null)
      notificationService.error('Failed to update profile picture. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (isLoading) {
    return (
      <section className="mb-6 rounded-2xl border border-brand-border bg-white p-8 dark:border-none dark:bg-brand-bg">
        <div className="flex items-center gap-8">
          <div className="h-28 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-6 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </section>
    )
  }

  if (!user) return null

  const memberSince = user.createdAt ? format(new Date(user.createdAt), 'yyyy') : '2024'
  const roleBadge = user.role === 'ADMIN' ? 'VERIFIED ADMIN' : 'MEMBER'
  const avatarSrc = previewUrl || user.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'

  return (
    <section className="mb-6 rounded-2xl border border-brand-border bg-white p-8 dark:border-none dark:bg-brand-bg">
      <div className="flex items-center gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-brand-primary dark:ring-brand-surface2">
            <img
              src={avatarSrc}
              className={`h-full w-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
              alt={`${user.fullName} avatar`}
            />
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Camera button */}
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploading}
            title="Change profile picture"
            className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-brand-primary text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
          >
            <FiCamera size={16} />
          </button>
        </div>

        {/* Info */}
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-brand-text">
            {user.fullName}
          </h2>

          <p className="mt-1 text-lg font-medium text-slate-500 dark:text-brand-textMuted">
            {user.organization?.name ? `${user.role} at ${user.organization.name}` : user.role}
          </p>

          {/* Badges */}
          <div className="mt-4 flex gap-3">
            {user.role === 'ADMIN' && (
              <span className="rounded-md bg-brand-primary/20 px-3 py-1 text-[11px] font-bold text-brand-primary">
                {roleBadge}
              </span>
            )}
            <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500 dark:bg-brand-surface2 dark:text-brand-textMuted">
              MEMBER SINCE {memberSince}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-400 dark:text-brand-textMuted">
            Click the camera icon to change your profile picture
          </p>
        </div>
      </div>
    </section>
  )
}
