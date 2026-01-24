'use client'

import { Button } from '../../../components/shared/button'
import { FiChevronDown, FiGrid, FiPlus } from 'react-icons/fi'
import { useAuth } from '@/app/hooks/useAuth'

export default function OrganizationInfo() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="mb-10 space-y-6 rounded-2xl border border-brand-border bg-white shadow-sm dark:border-none dark:bg-brand-surface">
        <div className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </section>
    )
  }

  const organizationName = user?.organization?.name || 'No organization'

  return (
    <section className="mb-10 space-y-6 rounded-2xl border border-brand-border bg-white shadow-sm dark:border-none dark:bg-brand-surface">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-brand-border px-8 py-5 text-slate-800 dark:text-brand-text">
        <FiGrid className="text-brand-primary" />
        <h3 className="font-bold">Organization Management</h3>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[13px] font-bold text-slate-700 dark:text-brand-text">
              Primary Organization
            </label>

            <div className="relative">
              <select
                className="
                  w-full appearance-none rounded-xl
                  border border-brand-primary
                  bg-white px-4 py-3 text-sm
                  outline-none transition-colors
                  focus:border-brand-primary
                  dark:border-none
                  dark:bg-brand-surface2
                  dark:text-brand-text
                "
                value={user?.organization?.id || ''}
              >
                {user?.organization ? (
                  <option value={user.organization.id}>{user.organization.name}</option>
                ) : (
                  <option value="">No organization</option>
                )}
              </select>

              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-textMuted" />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-brand-textMuted">
              {user?.organization
                ? 'Switching organizations will reload your active project dashboard.'
                : 'Join an organization to collaborate with your team.'}
            </p>
          </div>

          {/* Action */}
          <div className="pt-[26px]">
            <Button
              className="
                flex items-center gap-2
                rounded-xl
                border border-brand-primary
                bg-white px-6 py-[11px]
                text-sm font-bold text-slate-700
                transition-colors
                hover:text-brand-text
                hover:bg-brand-primary
                dark:border-none
                dark:bg-brand-primary
                dark:text-white
                dark:hover:bg-brand-primaryHover
              "
            >
              <FiPlus className="text-brand-primary" />
              {user?.organization ? 'Switch Organization' : 'Join Organization'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
