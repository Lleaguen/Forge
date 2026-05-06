'use client'

import { useState } from 'react'
import { FiPlus, FiSettings } from 'react-icons/fi'
import { useTasks, useUpdateTask, useCreateTask } from '@/app/hooks/useTasks'
import { useColumns } from '@/app/hooks/useColumns'
import KanbanColumn from './KanbanColumn'
import CreateTaskModal from './CreateTaskModal'
import ColumnsModal from './ColumnsModal'
import { LoadingState } from '@/components/states/LoadingState'
import { TaskStatus } from './types'

interface Props {
  projectId: string
  projectName?: string
  isCreateModalOpen?: boolean
  onOpenCreateModal?: () => void
  onCloseCreateModal?: () => void
  onTaskCreated?: () => void
  onManageColumns?: () => void
}

// Columnas por defecto como fallback
const DEFAULT_COLUMNS = [
  { id: 'TODO', title: 'TO DO', status: 'TODO', position: 0, projectId: '', isDefault: true },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS', status: 'IN_PROGRESS', position: 1, projectId: '', isDefault: true },
  { id: 'IN_REVIEW', title: 'IN REVIEW', status: 'IN_REVIEW', position: 2, projectId: '', isDefault: true },
  { id: 'DONE', title: 'DONE', status: 'DONE', position: 3, projectId: '', isDefault: true },
]

export default function KanbanBoard({ 
  projectId, 
  projectName,
  isCreateModalOpen = false,
  onOpenCreateModal,
  onCloseCreateModal,
  onTaskCreated,
  onManageColumns
}: Props) {
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks(projectId)
  const { data: columnsData, isLoading: columnsLoading } = useColumns(projectId)
  const updateTaskMutation = useUpdateTask()
  const createTaskMutation = useCreateTask()
  const [internalModalOpen, setInternalModalOpen] = useState(false)

  // Use external modal state if provided, otherwise use internal state
  const modalOpen = isCreateModalOpen !== undefined ? isCreateModalOpen : internalModalOpen
  const openModal = onOpenCreateModal || (() => setInternalModalOpen(true))
  const closeModal = onCloseCreateModal || (() => setInternalModalOpen(false))
  const handleTaskCreated = onTaskCreated || (() => setInternalModalOpen(false))

  // Ensure tasks is always an array
  const tasks = Array.isArray(tasksData) ? tasksData : []
  
  // Use dynamic columns or fallback to default
  const columns = columnsData && columnsData.length > 0 
    ? columnsData.sort((a, b) => a.position - b.position)
    : DEFAULT_COLUMNS.map(col => ({ ...col, projectId }))

  // 🔹 MOVE TASK
  function moveTask(taskId: string, newStatus: TaskStatus) {
    const task = tasks.find((t) => t.id === taskId)
    
    if (task) {
      updateTaskMutation.mutate({
        taskId,
        payload: { status: newStatus },
        projectId: task.projectId,
        useStatusEndpoint: true
      })
    }
  }

  // 🔹 ADD TASK - Open modal instead of prompt
  function addTask() {
    openModal()
  }

  // 🔹 Handle successful task creation
  function handleTaskCreatedInternal() {
    handleTaskCreated()
    // The query will be invalidated automatically by the mutation
  }

  if (tasksLoading || columnsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingState message="Loading board..." />
      </div>
    )
  }

  if (tasksError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-red-600">Error loading tasks. Please try again.</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        {/* Header simplificado */}
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {projectName || 'Proyecto'}
          </h2>
        </div>

        {/* Kanban Board - Área con scroll horizontal controlado */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-6 p-6 pb-8 min-w-max">
            {columns.map((col) => {
              const columnTasks = tasks.filter((t) => (t.status || 'TODO') === col.status)
              const showAddButton = col.status === 'TODO' // Solo mostrar en TO DO
              
              return (
                <KanbanColumn
                  key={col.id}
                  title={col.title}
                  status={col.status}
                  color={col.color}
                  tasks={columnTasks.map((t) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description || '',
                    status: t.status || 'TODO',
                    label: `${t.category || 'DEVELOPMENT'} • ${t.priority || 'MEDIUM'}`,
                    dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—',
                    comments: 0,
                    tags: t.tags || [],
                    createdAt: t.createdAt,
                    assignee: t.assignee || null,
                    projectId: projectId,
                  }))}
                  onDropTask={moveTask}
                  onAddTask={showAddButton ? addTask : undefined}
                />
              )
            })}
            
            {/* Add Column Button */}
            <div className="flex min-w-[280px] flex-shrink-0 flex-col">
              <button
                onClick={onManageColumns}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all dark:border-slate-600 dark:bg-slate-800/30 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:hover:bg-blue-500/10"
              >
                <FiPlus size={16} />
                Add Column
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        projectId={projectId}
        isOpen={modalOpen}
        onClose={closeModal}
        onSuccess={handleTaskCreatedInternal}
      />
    </>
  )
}
