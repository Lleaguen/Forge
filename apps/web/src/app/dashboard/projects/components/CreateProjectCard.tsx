'use client'

import { FiPlus } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function CreateProjectCard() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/dashboard/projects/new')}
      className="
        flex flex-col items-center justify-center
        rounded-2xl border border-dashed
        border-slate-300 dark:border-white/15
        p-6 text-slate-400
        cursor-pointer
        transition-colors
        hover:border-brand-primary hover:text-brand-primary
        dark:hover:border-brand-primary
      "
    >
      <div className="mb-3 rounded-full bg-slate-100 dark:bg-white/10 p-3">
        <FiPlus />
      </div>

      <span className="font-medium text-slate-600 dark:text-slate-200">
        Create New Project
      </span>
      <span className="text-xs text-slate-400">
        Add a new board to start managing tasks.
      </span>
    </div>
  )
}
