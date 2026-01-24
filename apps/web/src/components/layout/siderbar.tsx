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
        flex w-80 flex-col
        border-r border-slate-100
        bg-white/70
        dark:border-white/10
        dark:bg-gradient-to-r
        dark:from-brand-primary/15
        dark:to-transparent
        dark:bg-slate-800/20
        dark:backdrop-blur-xl
        dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]
      "
    >
      <div className="flex flex-1 flex-col px-3 pt-4">
        <Logo />
        <p className="mb-6 mt-10 px-4 text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
          Management
        </p>
        <Nav />
      </div>
      <div className="mt-auto border-t border-slate-50 p-6 dark:border-none dark:text-brand-text">
        <Button
          onClick={logout}
          className="mb-10 flex w-full items-center gap-3 bg-transparent text-[15px] font-bold text-red-500 hover:bg-transparent hover:opacity-80"
        >
          <FiLogOut size={20} />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
