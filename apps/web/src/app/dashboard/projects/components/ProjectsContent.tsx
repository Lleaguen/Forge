'use client'

import { Button } from '@/components/shared'
import ProjectActivity from './ProjectActivity'
import ProjectsGrid from './ProjectsGrid'

interface Props {
  onOpenProject: (projectId: string) => void
}

export default function ProjectsContent({ onOpenProject }: Props) {
  return (
    <main
      className="
        flex-1 w-full overflow-y-auto
        px-10 pt-10 pb-24

        bg-slate-50 text-slate-900
        dark:bg-brand-bg dark:text-slate-100
      "
    >
      {/* Header */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400">
            Manage and track your active workspace projects.
          </p>
        </div>

        <Button variant="primary" href="/dashboard/projects/new" className="w-40">
          + New Project
        </Button>
      </div>

      {/* Grid */}
      <div className="mb-16">
        <ProjectsGrid onOpenProject={onOpenProject} />
      </div>

      {/* Activity title */}
      <h2 className="mb-6 text-xl font-semibold">Project Activity</h2>
      <div className="w-full rounded-xl bg-white dark:bg-brand-bg dark:text-slate-100">
        <ProjectActivity />
      </div>
    </main>
  )
}
