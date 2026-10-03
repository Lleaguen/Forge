'use client'

import { Button } from '../shared/button'
import Logo from '../shared/Logo'
import Nav from '../ui/nav'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/app/hooks/useAuth'

export default function Siderbar() {
  const { logout } = useAuth()

  return (
    <aside
      className="
        flex h-full w-72 flex-col
        border-r border-brand-light-border bg-brand-light-surface
        shadow-[1px_0_12px_rgba(255,122,26,0.08)]
        dark:border-white/10
        dark:bg-gradient-to-r dark:from-brand-primary/15 dark:to-transparent
        dark:backdrop-blur-xl
        dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]
      "
    >
      <div className="flex flex-1 flex-col px-3 pt-4">
        <Logo />
        <p className="mb-4 mt-10 px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-light-accent/60 dark:text-slate-500">
          Management
        </p>
        <Nav />
      </div>

      {/* Separador con tono naranja en light */}
      <div className="mx-4 h-px bg-brand-light-accentSoft dark:bg-white/5" />

      <div className="p-5 dark:text-brand-text">
        <Button
          onClick={logout}
          className="mb-2 flex w-full items-center gap-3 bg-transparent text-[14px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
        >
          <FiLogOut size={18} />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
