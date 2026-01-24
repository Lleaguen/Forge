'use client'

import { useProjects } from '@/app/hooks/useProjects'
import { useAuth } from '@/app/hooks/useAuth'
import { LoadingState } from '@/components/states/LoadingState'
import { EmptyState } from '@/components/states/EmptyState'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectList() {
  const { user } = useAuth()
  const { data: projects, isLoading } = useProjects(user?.organization?.id)
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-brand-surface">
        <h3 className="mb-4 font-semibold text-slate-800 dark:text-brand-text">
          Active Projects
        </h3>
        <LoadingState message="Loading projects..." />
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-brand-surface">
        <h3 className="mb-4 font-semibold text-slate-800 dark:text-brand-text">
          Active Projects
        </h3>
        <EmptyState message="No active projects yet" />
      </div>
    )
  }

  const activeProjects = projects?.slice(0, 5) || []

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-brand-surface">
      <h3 className="mb-4 font-semibold text-slate-800 dark:text-brand-text">
        Active Projects
      </h3>

      <ul className="space-y-3">
        {activeProjects.map((project) => {
          const timeAgo = formatDistanceToNow(new Date(project.updatedAt), {
            addSuffix: true,
          })

          return (
            <li
              key={project.id}
              onClick={() => router.push(`/dashboard/projects`)}
              className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-brand-surface2"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-brand-text">
                {project.name}
              </span>
              <span className="text-xs text-slate-400">Updated {timeAgo}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
