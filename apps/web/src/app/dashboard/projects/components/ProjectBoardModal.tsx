'use client'

import { useState } from 'react'
import KanbanBoard from './KanbanBoard'
import ProjectSettingsView from './ProjectSettingsView'
import { ProjectView } from './types'
import Sidebar from './ProjectSettingsSidebar'
import { useCreateTask } from '@/app/hooks/useTasks'
import { useDeleteProject } from '@/app/hooks/useProjects'
import { useAuth } from '@/app/hooks/useAuth'

interface Props {
  projectId: string
}

export default function ProjectModalLayout({ projectId }: Props) {
  const [view, setView] = useState<ProjectView>('board')
  const createTaskMutation = useCreateTask()
  const deleteProjectMutation = useDeleteProject()
  const { logout } = useAuth()

  // 🔹 ADD COLUMN - No disponible ya que el backend no tiene columnas
  const addColumn = () => {
    alert('Column management is not available. Using default columns: TO DO, IN PROGRESS, DONE')
  }

  // 🔹 ADD TASK
  const addTask = () => {
    const title = prompt('Task title')
    if (!title) return

    createTaskMutation.mutate({
      title,
      projectId,
      status: 'todo',
    })
  }

  // 🔹 DELETE PROJECT (en lugar de archivar)
  const handleArchiveProject = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProjectMutation.mutate(projectId)
    }
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar
        activeView={view}
        onChangeView={setView}
        onAddColumn={addColumn}
        onAddTask={addTask}
        onArchiveProject={handleArchiveProject}
        onSignOut={logout}
      />

      <main className="flex flex-1 overflow-hidden">
        {view === 'board' && <KanbanBoard projectId={projectId} />}
        {view === 'settings' && <ProjectSettingsView projectId={projectId} />}
      </main>
    </div>
  )
}
