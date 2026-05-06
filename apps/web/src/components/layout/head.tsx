'use client'

import { FiSearch } from 'react-icons/fi'
import { Input } from '../shared/input'
import { useAuth } from '@/app/hooks/useAuth'
import NotificationBell from '../notifications/NotificationBell'

export default function HeadLayout() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-10 dark:border-none dark:bg-black/20 dark:backdrop-blur-md dark:text-brand-text">
        <div className="relative w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-text/60" />
          <Input
            placeholder="Search tasks or settings..."
            className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none ring-1 ring-slate-100 transition focus:ring-2 focus:ring-brand-primary/60 dark:bg-brand-surface dark:ring-white/10"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </header>
    )
  }
  
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-10 dark:border-none dark:bg-black/20 dark:backdrop-blur-md dark:text-brand-text">
      <div className="relative w-96">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-text/60" />
        <Input
          placeholder="Search tasks or settings..."
          className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none ring-1 ring-slate-100 transition focus:ring-2 focus:ring-brand-primary/60 dark:bg-brand-surface dark:ring-white/10"
        />
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell />
        <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 dark:text-brand-text">
              {user?.fullName || user?.email || 'Usuario'}
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-brand-text/60">
              {user?.role || 'Member'}
            </p>
          </div>
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
            alt={user?.email || 'User'}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-50 dark:ring-white/10 dark:hover:ring-brand-primary"
          />
        </div>
      </div>
    </header>
  )
}