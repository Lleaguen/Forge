'use client'

import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'
import { CreateTaskModalProps } from '../domain/task-form.types'

export default function CreateTaskModal({ projectId, isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <TaskForm 
        projectId={projectId} 
        onSuccess={onSuccess} 
        onClose={onClose} 
      />
    </Modal>
  )
}