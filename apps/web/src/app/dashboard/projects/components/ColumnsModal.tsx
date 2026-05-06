'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPlus, FiTrash2, FiEdit3 } from 'react-icons/fi'
import { notificationService } from '@/app/shared/services/notification.service'

interface KanbanColumn {
  id: string
  title: string
  status: string
  color?: string
  position: number
  projectId: string
  isDefault?: boolean
  isFixed?: boolean
}

interface Props {
  projectId: string | null
  isOpen: boolean
  onClose: () => void
  onColumnsChange?: () => void
}

const COLUMN_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
]

const DEFAULT_COLUMNS = [
  { id: 'TODO', title: 'TO DO', status: 'TODO', position: 0, isDefault: true },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS', status: 'IN_PROGRESS', position: 1, isDefault: true },
  { id: 'IN_REVIEW', title: 'IN REVIEW', status: 'IN_REVIEW', position: 2, isDefault: true },
  { id: 'DONE', title: 'DONE', status: 'DONE', position: 3, isDefault: true, isFixed: true },
]

export default function ColumnsModal({ projectId, isOpen, onClose, onColumnsChange }: Props) {
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [newColumnColor, setNewColumnColor] = useState(COLUMN_COLORS[0].value)
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null)

  useEffect(() => {
    if (!projectId) return

    const stored = localStorage.getItem('kanban_columns')
    const allColumns = stored ? JSON.parse(stored) : {}
    const projectColumns = allColumns[projectId]

    if (projectColumns && projectColumns.length > 0) {
      const hasInReview = projectColumns.some((col: KanbanColumn) => col.status === 'IN_REVIEW')

      if (!hasInReview) {
        const updatedColumns = [...projectColumns]
        const doneIndex = updatedColumns.findIndex(col => col.status === 'DONE')

        if (doneIndex > -1) {
          updatedColumns.forEach(col => {
            if (col.position >= doneIndex) col.position += 1
          })

          const inReviewColumn: KanbanColumn = {
            id: 'IN_REVIEW',
            title: 'IN REVIEW',
            status: 'IN_REVIEW',
            position: doneIndex,
            projectId,
            isDefault: true
          }

          const doneColumn = updatedColumns.find(col => col.status === 'DONE')
          if (doneColumn) doneColumn.isFixed = true

          updatedColumns.push(inReviewColumn)
          updatedColumns.sort((a, b) => a.position - b.position)

          allColumns[projectId] = updatedColumns
          localStorage.setItem('kanban_columns', JSON.stringify(allColumns))
          setColumns(updatedColumns)
          return
        }
      }

      setColumns(projectColumns)
    } else {
      setColumns(DEFAULT_COLUMNS.map(col => ({ ...col, projectId })))
    }
  }, [projectId])

  const saveColumns = (newColumns: KanbanColumn[]) => {
    if (!projectId) return
    const stored = localStorage.getItem('kanban_columns')
    const allColumns = stored ? JSON.parse(stored) : {}
    allColumns[projectId] = newColumns
    localStorage.setItem('kanban_columns', JSON.stringify(allColumns))
    setColumns(newColumns)
    onColumnsChange?.()
  }

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId || !newColumnTitle.trim()) return

    const doneColumn = columns.find(col => col.status === 'DONE')
    const otherColumns = columns.filter(col => col.status !== 'DONE')

    const newColumn: KanbanColumn = {
      id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newColumnTitle.trim(),
      status: newColumnTitle.toUpperCase().replace(/\s+/g, '_'),
      color: newColumnColor,
      position: otherColumns.length,
      projectId,
      isDefault: false
    }

    const updatedColumns = [...otherColumns, newColumn]
    if (doneColumn) {
      doneColumn.position = updatedColumns.length
      updatedColumns.push(doneColumn)
    }

    saveColumns(updatedColumns)
    notificationService.success(`Column "${newColumnTitle}" created successfully.`)
    setNewColumnTitle('')
    setNewColumnColor(COLUMN_COLORS[0].value)
  }

  const handleUpdateColumn = (column: KanbanColumn, updates: { title?: string; color?: string }) => {
    const updatedColumns = columns.map(col =>
      col.id === column.id ? { ...col, ...updates } : col
    )
    saveColumns(updatedColumns)
    setEditingColumn(null)
    notificationService.success('Column updated successfully.')
  }

  const handleDeleteColumn = (column: KanbanColumn) => {
    if (column.isDefault) {
      notificationService.error('Default columns cannot be deleted.')
      return
    }

    if (confirm(`Are you sure you want to delete the column "${column.title}"?`)) {
      const remainingColumns = columns.filter(col => col.id !== column.id)
      const doneColumn = remainingColumns.find(col => col.status === 'DONE')
      const otherColumns = remainingColumns.filter(col => col.status !== 'DONE')

      otherColumns.forEach((col, idx) => { col.position = idx })
      if (doneColumn) doneColumn.position = otherColumns.length

      saveColumns([...otherColumns, ...(doneColumn ? [doneColumn] : [])])
      notificationService.success(`Column "${column.title}" deleted.`)
    }
  }

  if (!isOpen || !projectId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Manage Columns
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Customize the columns of your Kanban board
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Create New Column */}
        <form onSubmit={handleCreateColumn} className="mb-6 rounded-lg border border-slate-200 p-4 dark:border-slate-600">
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Create New Column
          </h3>

          <div className="flex gap-3">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Column name"
            />

            <div className="flex gap-1">
              {COLUMN_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setNewColumnColor(color.value)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    newColumnColor === color.value ? 'border-slate-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!newColumnTitle.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </form>

        {/* Existing Columns */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Existing Columns ({columns.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag to reorder • DONE is always last
            </p>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {columns
              .sort((a, b) => a.position - b.position)
              .map((column) => (
                <div
                  key={column.id}
                  draggable={column.status !== 'DONE'}
                  onDragStart={(e) => {
                    if (column.status === 'DONE') { e.preventDefault(); return }
                    e.dataTransfer.setData('text/plain', column.id)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragOver={(e) => {
                    if (column.status !== 'DONE') e.preventDefault()
                  }}
                  onDrop={(e) => {
                    if (column.status === 'DONE') return
                    e.preventDefault()
                    const draggedColumnId = e.dataTransfer.getData('text/plain')
                    const draggedColumn = columns.find(col => col.id === draggedColumnId)

                    if (draggedColumn && draggedColumn.id !== column.id && draggedColumn.status !== 'DONE') {
                      const newColumns = [...columns]
                      const draggedIndex = newColumns.findIndex(col => col.id === draggedColumnId)
                      const targetIndex = newColumns.findIndex(col => col.id === column.id)

                      const [removed] = newColumns.splice(draggedIndex, 1)
                      newColumns.splice(targetIndex, 0, removed)

                      const doneCol = newColumns.find(col => col.status === 'DONE')
                      const otherCols = newColumns.filter(col => col.status !== 'DONE')
                      otherCols.forEach((col, idx) => { col.position = idx })
                      if (doneCol) doneCol.position = otherCols.length

                      saveColumns([...otherCols, ...(doneCol ? [doneCol] : [])])
                      notificationService.success('Columns reordered successfully.')
                    }
                  }}
                  className={`flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-600 ${
                    column.status !== 'DONE' ? 'cursor-move hover:bg-slate-50 dark:hover:bg-slate-700/50' : 'opacity-75'
                  }`}
                >
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: column.color || '#6B7280' }} />

                  {editingColumn?.id === column.id ? (
                    <div className="flex flex-1 gap-2">
                      <input
                        type="text"
                        defaultValue={column.title}
                        className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        onBlur={(e) => {
                          if (e.target.value !== column.title) {
                            handleUpdateColumn(column, { title: e.target.value })
                          } else {
                            setEditingColumn(null)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateColumn(column, { title: e.currentTarget.value })
                          else if (e.key === 'Escape') setEditingColumn(null)
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{column.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {column.status}
                        {column.isDefault && ' (Default)'}
                        {column.status === 'DONE' && ' (Always last)'}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {column.status !== 'DONE' && (
                      <span className="mr-2 text-xs text-slate-400">⋮⋮</span>
                    )}
                    <button
                      onClick={() => setEditingColumn(column)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                    >
                      <FiEdit3 size={14} />
                    </button>
                    {!column.isDefault && (
                      <button
                        onClick={() => handleDeleteColumn(column)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
