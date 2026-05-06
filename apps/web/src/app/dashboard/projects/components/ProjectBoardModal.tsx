'use client'

import { useState } from 'react'
import KanbanBoard from './KanbanBoard'
import ProjectSettingsView from './ProjectSettingsView'
import ColumnsModal from './ColumnsModal'
import { ProjectView } from './types'
import Sidebar from './ProjectSettingsSidebar'
import { useCreateTask } from '@/app/hooks/useTasks'
import { useDeleteProject, useProjects } from '@/app/hooks/useProjects'
import { useAuth } from '@/app/hooks/useAuth'

interface Props {
  projectId: string
}

export default function ProjectModalLayout({ projectId }: Props) {
  const [view, setView] = useState<ProjectView>('board')
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false)
  const createTaskMutation = useCreateTask()
  const deleteProjectMutation = useDeleteProject()
  const { logout } = useAuth()
  const { data: projects } = useProjects()

  // Encontrar el proyecto actual
  const currentProject = projects?.find(p => p.id === projectId)

  // 🔹 ADD COLUMN - No disponible ya que el backend no tiene columnas
  const addColumn = () => {
    alert('Column management is not available. Using default columns: TO DO, IN PROGRESS, DONE')
  }

  // 🔹 ADD TASK - Abrir el modal profesional
  const addTask = () => {
    setIsCreateTaskModalOpen(true)
  }

  // 🔹 Handle successful task creation
  const handleTaskCreated = () => {
    setIsCreateTaskModalOpen(false)
  }

  // 🔹 DELETE PROJECT (en lugar de archivar)
  const handleArchiveProject = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProjectMutation.mutate(projectId)
    }
  }

  return (
    <>
      <div className="flex h-full w-full">
        <Sidebar
          activeView={view}
          onChangeView={setView}
          onAddTask={addTask}
          onManageColumns={() => setManageColumnsOpen(true)}
          onSignOut={logout}
        />

        <main className="flex flex-1 min-w-0">
          {view === 'board' && (
            <KanbanBoard 
              projectId={projectId}
              projectName={currentProject?.name}
              isCreateModalOpen={isCreateTaskModalOpen}
              onOpenCreateModal={() => setIsCreateTaskModalOpen(true)}
              onCloseCreateModal={() => setIsCreateTaskModalOpen(false)}
              onTaskCreated={handleTaskCreated}
              onManageColumns={() => setManageColumnsOpen(true)}
            />
          )}
          {view === 'settings' && <ProjectSettingsView projectId={projectId} />}
        </main>
      </div>

      {/* Modal de Gestionar Columnas */}
      <ColumnsModal
        projectId={projectId}
        isOpen={manageColumnsOpen}
        onClose={() => setManageColumnsOpen(false)}
        onColumnsChange={() => {
          // Forzar re-render del tablero cuando cambien las columnas
          window.location.reload()
        }}
      />
    </>
  )
}
