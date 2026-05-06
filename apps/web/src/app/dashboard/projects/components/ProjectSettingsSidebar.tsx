'use client'

import { ProjectView } from './types'
import { FiSettings, FiPlus, FiLogOut, FiColumns } from 'react-icons/fi'

interface Props {
  activeView: ProjectView
  onChangeView: (view: ProjectView) => void
  onAddTask: () => void
  onManageColumns: () => void
  onSignOut: () => void
}

export default function Sidebar({
  activeView,
  onChangeView,
  onAddTask,
  onManageColumns,
  onSignOut,
}: Props) {
  const baseBtn = 'flex items-center gap-2 rounded-lg px-2 py-1 text-sm transition'

  const active = 'bg-brand-secondary text-brand-primary'

  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-white p-4 dark:bg-brand-bg">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
          <span className="text-brand-primary">V</span>exel
        </h1>
        <span className="text-xs text-brand-primary">GLOBAL</span>
      </div>

      <nav className="flex flex-col gap-2 text-slate-500 dark:text-slate-300">
        <button
          onClick={() => onChangeView('board')}
          className={`${baseBtn} ${
            activeView === 'board' ? active : 'hover:text-brand-primary'
          }`}
        >
          <FiSettings /> Board
        </button>

        <button
          onClick={() => onChangeView('settings')}
          className={`${baseBtn} ${
            activeView === 'settings' ? active : 'hover:text-brand-primary'
          }`}
        >
          <FiSettings /> Project settings
        </button>

        <button onClick={onAddTask} className={`${baseBtn} hover:text-brand-primary`}>
          <FiPlus /> Add task
        </button>

        <button onClick={onManageColumns} className={`${baseBtn} hover:text-brand-primary`}>
          <FiColumns /> Manage Columns
        </button>
      </nav>

      <div className="mt-auto">
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <FiLogOut /> Sign Out
        </button>
      </div>
    </aside>
  )
}
