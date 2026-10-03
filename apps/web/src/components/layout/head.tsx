'use client'

import { FiSearch } from 'react-icons/fi'
import { Input } from '../shared/input'
import { useAuth } from '@/app/hooks/useAuth'
import NotificationBell from '../notifications/NotificationBell'

export default function HeadLayout() {
  const { user, isLoading } = useAuth()

  return (
    <header className="
      flex h-14 items-center justify-between
      border-b border-brand-light-border bg-brand-light-surface
      px-4 md:px-8
      pl-14 md:pl-8
      shadow-[0_1px_8px_rgba(255,122,26,0.06)]
      dark:border-none dark:bg-black/20 dark:backdrop-blur-md dark:text-brand-text
    ">
      {/* Búsqueda — oculta en mobile */}
      <div className="relative hidden md:block w-72">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light-accent/50 dark:text-brand-text/60" />
        <Input
          placeholder="Search..."
          className="
            w-full rounded-xl py-2 pl-9 pr-4 text-sm outline-none
            bg-brand-light-accentSoft ring-1 ring-brand-light-border
            text-brand-light-text placeholder-brand-light-muted
            transition focus:ring-2 focus:ring-brand-light-accent/40
            dark:bg-brand-surface dark:ring-white/10 dark:text-brand-text dark:placeholder-brand-Muted
          "
        />
      </div>

      {/* Título en mobile */}
      <p className="md:hidden text-sm font-bold text-brand-light-accent dark:text-brand-primary">
        Forge
      </p>

      {/* Acciones */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="h-8 w-20 animate-pulse rounded-lg bg-brand-light-accentSoft dark:bg-slate-700" />
        ) : (
          <>
            <NotificationBell />
            <div className="h-7 w-px bg-brand-light-accentMid/30 dark:bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-brand-light-text dark:text-brand-text leading-tight">
                  {user?.fullName || user?.email?.split('@')[0] || 'Usuario'}
                </p>
                <p className="text-[10px] font-medium text-brand-light-muted dark:text-brand-text/60">
                  {user?.role || 'Member'}
                </p>
              </div>
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100'}
                alt={user?.email || 'User'}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-light-accentMid dark:ring-white/10"
              />
            </div>
          </>
        )}
      </div>
    </header>
  )
}
