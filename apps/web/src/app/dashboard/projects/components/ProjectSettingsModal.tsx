'use client'

import { useState } from 'react'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDeleteProject } from '@/app/hooks/useProjects'
import { Project } from '@/app/api/projects.api'

interface Props {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectSettingsModal({ project, isOpen, onClose }: Props) {
  const [showDangerZone, setShowDangerZone] = useState(false)
  const deleteProjectMutation = useDeleteProject()

  const handleDeleteProject = async () => {
    if (!project) return

    if (confirm(`Are you sure you want to permanently delete "${project.name}"? This action cannot be undone and all associated data will be lost.`)) {
      try {
        await deleteProjectMutation.mutateAsync(project.id)
        onClose()
      } catch (error) {
        // Error handling is done by the error handler hook
      }
    }
  }

  const actions = (
    <Button variant="secondary" onClick={onClose}>
      Close
    </Button>
  )

  return (
    <Modal
      isOpen={isOpen && !!project}
      onClose={onClose}
      title="Project Settings"
      subtitle={project?.name}
      maxWidth="max-w-md"
      actions={actions}
    >
      <div className="space-y-6">
        {/* General Settings */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            General Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Project ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {project?.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Created:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {project && new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Organization:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {project?.organization?.name || 'No organization'}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Notify when new tasks are created
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Notify on status changes
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Daily email summary
              </span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-slate-200 pt-6 dark:border-slate-600">
          <Button
            variant="ghost"
            icon={FiAlertTriangle}
            onClick={() => setShowDangerZone(!showDangerZone)}
            className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Danger Zone
          </Button>

          {showDangerZone && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
              <h4 className="mb-2 text-sm font-medium text-red-800 dark:text-red-400">
                Delete Project
              </h4>
              <p className="mb-3 text-xs text-red-600 dark:text-red-300">
                This will permanently delete the project and all its data. This action cannot be undone.
              </p>
              <Button
                variant="danger"
                icon={FiTrash2}
                size="sm"
                loading={deleteProjectMutation.isPending}
                onClick={handleDeleteProject}
              >
                Delete Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
