'use client'

import { useRouter, usePathname } from 'next/navigation'
import { FiFolder, FiGrid, FiSettings, FiUsers } from 'react-icons/fi'
import type { ReactNode } from 'react'

type NavItem = {
  label: string
  path: string
  icon: ReactNode
}

export default function Nav() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiGrid size={20} /> },
    { label: 'Projects', path: '/dashboard/projects', icon: <FiFolder size={20} /> },
    { label: 'Team', path: '/dashboard/team', icon: <FiUsers size={20} /> },
    { label: 'Settings', path: '/dashboard/profile', icon: <FiSettings size={20} /> },
  ]

  return (
    <nav className="space-y-2">
      {menuItems.map(item => {
        const isActive = pathname === item.path

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => router.push(item.path)}
            className={`
              group flex w-full items-center gap-3
              rounded-lg px-4 py-2.5 text-[14px]
              transition-all duration-200
              ${
                isActive
                  ? 'bg-[#FF7A1A]/20 font-bold text-brand-primary'
                  : 'font-medium text-slate-600 dark:text-slate-400 hover:bg-[#FF7A1A]/20 hover:text-brand-primary'
              }
            `}
          >
            <span
              className={
                isActive
                  ? 'text-[#FF7A1A]'
                  : 'text-slate-400 group-hover:text-brand-primary'
              }
            >
              {item.icon}
            </span>

            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
