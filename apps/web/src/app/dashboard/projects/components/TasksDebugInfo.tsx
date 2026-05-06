'use client'

import { useTasks } from '@/app/hooks/useTasks'

interface Props {
  projectId: string
}

export function TasksDebugInfo({ projectId }: Props) {
  const { data, isLoading, error } = useTasks(projectId)

  return (
    <div className="bg-gray-100 p-4 m-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">🔍 Debug Info</h3>
      <div className="space-y-1">
        <p><strong>Project ID:</strong> {projectId}</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error ? JSON.stringify(error) : 'None'}</p>
        <p><strong>Data Type:</strong> {typeof data}</p>
        <p><strong>Is Array:</strong> {Array.isArray(data) ? 'Yes' : 'No'}</p>
        <p><strong>Data Length:</strong> {Array.isArray(data) ? data.length : 'N/A'}</p>
        <p><strong>Raw Data:</strong></p>
        <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}