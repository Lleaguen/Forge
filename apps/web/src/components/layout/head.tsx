'use client'

import { FiSearch } from 'react-icons/fi'
import { Input } from '../shared/input'
import { useAuth } from '@/app/hooks/useAuth'
import NotificationBell from '../notifications/NotificationBell'

export default function HeadLayout() {
  const { user, isLoading } = useAuth()

  return (
    <header className="
      flex h-16 items-center justify-between
      border-b border-brand-light-border bg-brand-light-surface
      px-10
      shadow-[0_1px_8px_rgba(255,122,26,0.07)]
      dark:border-none dark:bg-black/20 dark:backdrop-blur-md dark:text-brand-text
    ">
      {/* Búsqueda */}
      <div className="relative w-80">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light-accent/50 dark:text-brand-text/60" />
        <Input
          placeholder="Search tasks or settings..."
          className="
            w-full rounded-xl py-2 pl-10 pr-4 text-sm outline-none
            bg-brand-light-accentSoft ring-1 ring-brand-light-border
            text-brand-light-text placeholder-brand-light-muted
            transition focus:ring-2 focus:ring-brand-light-accent/40
            dark:bg-brand-surface dark:ring-white/10 dark:text-brand-text dark:placeholder-brand-Muted
          "
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-5">
        {isLoading ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-brand-light-accentSoft dark:bg-slate-700" />
        ) : (
          <>
            <NotificationBell />
            <div className="h-8 w-px bg-brand-light-accentMid/40 dark:bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-brand-light-text dark:text-brand-text">
                  {user?.fullName || user?.email || 'Usuario'}
                </p>
                <p className="text-[11px] font-medium text-brand-light-muted dark:text-brand-text/60">
                  {user?.role || 'Member'}
                </p>
              </div>
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
                alt={user?.email || 'User'}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-light-accentMid dark:ring-white/10 dark:hover:ring-brand-primary"
              />
            </div>
          </>
        )}
      </div>
    </header>
  )
}
