'use client'

import { useState } from 'react'
import { Button } from '../shared/button'
import Logo from '../shared/Logo'
import Nav from '../ui/nav'
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '@/app/hooks/useAuth'

export default function Siderbar() {
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="flex flex-1 flex-col px-2 pt-4">
        <div className="flex items-center justify-between pr-2">
          <Logo />
          {/* Botón cerrar en mobile */}
          <button
            className="md:hidden p-1 rounded-lg text-brand-light-muted hover:text-brand-light-accent dark:text-brand-Muted"
            onClick={() => setMobileOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <p className="mb-4 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-light-accent/50 dark:text-slate-500">
          Management
        </p>
        <Nav onNavigate={() => setMobileOpen(false)} />
      </div>

      <div className="mx-3 h-px bg-brand-light-accentSoft dark:bg-white/5" />

      <div className="p-4 dark:text-brand-text">
        <Button
          onClick={logout}
          className="flex w-full items-center gap-3 bg-transparent text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
        >
          <FiLogOut size={17} />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────── */}
      <aside className="
        hidden md:flex h-full w-56 flex-col flex-shrink-0
        border-r border-brand-light-border
        bg-[#FFFFFF] dark:bg-brand-bg
        shadow-[1px_0_12px_rgba(255,122,26,0.06)] dark:shadow-none
        dark:border-white/10
        dark:bg-gradient-to-b dark:from-brand-primary/10 dark:to-brand-bg
      ">
        {sidebarContent}
      </aside>

      {/* ── Mobile: botón hamburger ───────────────────── */}
      <button
        className="
          md:hidden fixed top-4 left-4 z-50
          p-2 rounded-lg
          bg-brand-light-surface border border-brand-light-border
          text-brand-light-accent shadow-sm
          dark:bg-brand-surface dark:border-white/10 dark:text-brand-primary
        "
        onClick={() => setMobileOpen(true)}
      >
        <FiMenu size={20} />
      </button>

      {/* ── Mobile: overlay ───────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: drawer ────────────────────────────── */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        border-r border-brand-light-border
        bg-white dark:bg-brand-bg
        shadow-xl dark:shadow-brand-primary/10
        dark:border-white/10
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>
    </>
  )
}
