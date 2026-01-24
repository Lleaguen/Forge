'use client'

import { FiCamera } from 'react-icons/fi'
import { Button } from '../../../components/shared/button'
import { useAuth } from '@/app/hooks/useAuth'
import { format } from 'date-fns'

export default function HeaderTop() {
  const { user, isLoading } = useAuth()

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

  if (!user) {
    return null
  }

  const memberSince = user.createdAt ? format(new Date(user.createdAt), 'yyyy') : '2024'
  const roleBadge = user.role === 'ADMIN' ? 'VERIFIED ADMIN' : 'MEMBER'

  return (
    <section className="mb-6 rounded-2xl border border-brand-border bg-white p-8 dark:border-none dark:bg-brand-bg">
      <div className="flex items-center gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-brand-primary dark:ring-brand-surface2">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
              className="h-full w-full object-cover"
              alt={`${user.fullName} avatar`}
            />
          </div>

          {/* Camera button */}
          <Button className="absolute bottom-1 right-1 h-10 w-10 rounded-full border-4 border-white bg-[#FF7A1A] p-2 text-white shadow-md">
            <FiCamera size={16} />
          </Button>
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
        </div>
      </div>
    </section>
  )
}
