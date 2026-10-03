'use client'

import { useRouter, usePathname } from 'next/navigation'
import { FiFolder, FiGrid, FiSettings, FiUsers } from 'react-icons/fi'
import type { ReactNode } from 'react'

type NavItem = {
  label: string
  path: string
  icon: ReactNode
}

interface NavProps {
  onNavigate?: () => void
}

export default function Nav({ onNavigate }: NavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiGrid size={18} /> },
    { label: 'Projects', path: '/dashboard/projects', icon: <FiFolder size={18} /> },
    { label: 'Team', path: '/dashboard/team', icon: <FiUsers size={18} /> },
    { label: 'Settings', path: '/dashboard/profile', icon: <FiSettings size={18} /> },
  ]

  return (
    <nav className="space-y-1">
      {menuItems.map(item => {
        const isActive = pathname === item.path

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => {
              router.push(item.path)
              onNavigate?.()
            }}
            className={`
              group flex w-full items-center gap-3
              rounded-lg px-3 py-2.5 text-[13px]
              transition-all duration-200
              ${isActive
                ? 'bg-brand-light-accentSoft font-bold text-brand-light-accent dark:bg-brand-primary/20 dark:text-brand-primary'
                : 'font-medium text-slate-600 dark:text-slate-400 hover:bg-brand-light-accentSoft hover:text-brand-light-accent dark:hover:bg-brand-primary/20 dark:hover:text-brand-primary'
              }
            `}
          >
            <span className={isActive ? 'text-brand-light-accent dark:text-brand-primary' : 'text-slate-400 group-hover:text-brand-light-accent dark:group-hover:text-brand-primary'}>
              {item.icon}
            </span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
