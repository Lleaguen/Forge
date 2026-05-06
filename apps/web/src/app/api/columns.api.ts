'use client'
import { KanbanColumn, CreateColumnPayload, UpdateColumnPayload } from '../dashboard/projects/types/column.types'

// Clave para localStorage
const COLUMNS_STORAGE_KEY = 'kanban_columns'

// Columnas por defecto
const DEFAULT_COLUMNS = [
  { id: 'TODO', title: 'TO DO', status: 'TODO', position: 0, projectId: '', isDefault: true },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS', status: 'IN_PROGRESS', position: 1, projectId: '', isDefault: true },
  { id: 'DONE', title: 'DONE', status: 'DONE', position: 2, projectId: '', isDefault: true },
]

// Obtener columnas del localStorage
function getStoredColumns(): Record<string, KanbanColumn[]> {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(COLUMNS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Guardar columnas en localStorage
function saveColumns(projectId: string, columns: KanbanColumn[]) {
  if (typeof window === 'undefined') return
  
  try {
    const allColumns = getStoredColumns()
    allColumns[projectId] = columns
    localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(allColumns))
  } catch (error) {
    console.error('Error saving columns:', error)
  }
}

export async function getColumnsByProject(projectId: string): Promise<KanbanColumn[]> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const storedColumns = getStoredColumns()
  const projectColumns = storedColumns[projectId]
  
  if (projectColumns && projectColumns.length > 0) {
    return projectColumns
  }
  
  // Devolver columnas por defecto si no hay columnas guardadas
  return DEFAULT_COLUMNS.map(col => ({ ...col, projectId }))
}

export async function createColumn(payload: CreateColumnPayload): Promise<KanbanColumn> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const newColumn: KanbanColumn = {
    id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: payload.title,
    status: payload.status,
    color: payload.color,
    position: payload.position,
    projectId: payload.projectId,
    isDefault: false
  }
  
  const existingColumns = await getColumnsByProject(payload.projectId)
  const updatedColumns = [...existingColumns, newColumn].sort((a, b) => a.position - b.position)
  
  saveColumns(payload.projectId, updatedColumns)
  
  return newColumn
}

export async function updateColumn(id: string, payload: UpdateColumnPayload): Promise<KanbanColumn> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const allColumns = getStoredColumns()
  
  // Encontrar el proyecto que contiene esta columna
  let targetProjectId = ''
  let updatedColumn: KanbanColumn | null = null
  
  for (const [projectId, columns] of Object.entries(allColumns)) {
    const columnIndex = columns.findIndex(col => col.id === id)
    if (columnIndex !== -1) {
      targetProjectId = projectId
      updatedColumn = { ...columns[columnIndex], ...payload }
      columns[columnIndex] = updatedColumn
      break
    }
  }
  
  if (!updatedColumn || !targetProjectId) {
    throw new Error('Column not found')
  }
  
  saveColumns(targetProjectId, allColumns[targetProjectId])
  
  return updatedColumn
}

export async function deleteColumn(id: string): Promise<void> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const allColumns = getStoredColumns()
  
  // Encontrar y eliminar la columna
  for (const [projectId, columns] of Object.entries(allColumns)) {
    const columnIndex = columns.findIndex(col => col.id === id)
    if (columnIndex !== -1) {
      // No permitir eliminar columnas por defecto
      if (columns[columnIndex].isDefault) {
        throw new Error('Cannot delete default columns')
      }
      
      columns.splice(columnIndex, 1)
      saveColumns(projectId, columns)
      return
    }
  }
  
  throw new Error('Column not found')
}

export async function reorderColumns(projectId: string, columnIds: string[]): Promise<void> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const existingColumns = await getColumnsByProject(projectId)
  
  // Reordenar columnas según el nuevo orden
  const reorderedColumns = columnIds.map((id, index) => {
    const column = existingColumns.find(col => col.id === id)
    if (!column) throw new Error(`Column ${id} not found`)
    return { ...column, position: index }
  })
  
  saveColumns(projectId, reorderedColumns)
}