'use client'

import { useTasks, useUpdateTask, useCreateTask } from '@/app/hooks/useTasks'
import KanbanColumn from './KanbanColumn'
import { LoadingState } from '@/components/states/LoadingState'
import { TaskStatus } from './types'

interface Props {
  projectId: string
}

// Columnas predefinidas ya que el backend no tiene endpoint para columnas
const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'TO DO', status: 'todo' },
  { id: 'in-progress', title: 'IN PROGRESS', status: 'in-progress' },
  { id: 'done', title: 'DONE', status: 'done' },
]

export default function KanbanBoard({ projectId }: Props) {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(projectId)
  const updateTaskMutation = useUpdateTask()
  const createTaskMutation = useCreateTask()

  // 🔹 MOVE TASK
  function moveTask(taskId: string, newStatus: TaskStatus) {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      updateTaskMutation.mutate({
        taskId,
        payload: { status: newStatus },
        projectId: task.projectId,
      })
    }
  }

  // 🔹 ADD TASK
  function addTask() {
    const title = prompt('Task title')
    if (!title) return

    createTaskMutation.mutate({
      title,
      projectId,
      status: 'todo',
    })
  }

  if (tasksLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingState message="Loading board..." />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-1 gap-6 overflow-x-auto p-6">
        {DEFAULT_COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => (t.status || 'todo') === col.status)
          return (
            <KanbanColumn
              key={col.id}
              title={col.title}
              status={col.status}
              tasks={columnTasks.map((t) => ({
                id: t.id,
                title: t.title,
                description: '',
                status: t.status || 'todo',
                label: 'GENERAL',
                dueDate: '—',
                comments: 0,
              }))}
              onDropTask={moveTask}
            />
          )
        })}
      </div>
    </div>
  )
}
