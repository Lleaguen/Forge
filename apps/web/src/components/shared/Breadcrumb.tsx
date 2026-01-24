'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { FiChevronRight } from 'react-icons/fi'

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  profile: 'Profile',
  projects: 'Projects',
  team: 'Team',
}

export default function Breadcrumb() {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-brand-textMuted">
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1

        return (
          <Fragment key={href}>
            {index > 0 && (
              <FiChevronRight className="text-slate-400 dark:text-brand-textMuted" />
            )}

            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-brand-text">
                {LABELS[segment] ?? segment}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-brand-primary transition"
              >
                {LABELS[segment] ?? segment}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
