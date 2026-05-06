'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTaskFormSchema, CreateTaskFormData } from '../domain/task-form.validations'
import { FORM_DEFAULTS } from '../domain/task-form.constants'
import { TaskFormService } from './task-form.service'
import { useCreateTask } from '@/app/hooks/useTasks'
import { useErrorHandler } from '@/app/shared/hooks/useErrorHandler'

export function useTaskForm(projectId: string, onSuccess: () => void, onClose: () => void) {
  const [tagInput, setTagInput] = useState('')
  const { handleError, handleSuccess } = useErrorHandler()
  const createTaskMutation = useCreateTask()

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(CreateTaskFormSchema),
    defaultValues: {
      category: FORM_DEFAULTS.CATEGORY,
      priority: FORM_DEFAULTS.PRIORITY,
      tags: []
    }
  })

  const watchedTags = form.watch('tags') || []

  const handleSubmit = async (data: CreateTaskFormData) => {
    try {
      const payload = TaskFormService.preparePayload(data, projectId)
      await createTaskMutation.mutateAsync(payload)
      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      handleError(error, 'Failed to create task')
    }
  }

  const handleAddTag = () => {
    try {
      const newTags = TaskFormService.addTag(tagInput, watchedTags)
      form.setValue('tags', newTags)
      setTagInput('')
    } catch (error) {
      // Silently ignore validation errors for better UX
      console.warn('Tag validation error:', error)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = TaskFormService.removeTag(tagToRemove, watchedTags)
    form.setValue('tags', newTags)
  }

  const canAddTag = () => {
    const validation = TaskFormService.validateTag(tagInput, watchedTags)
    return validation.isValid
  }

  return {
    form,
    tagInput,
    setTagInput,
    watchedTags,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleAddTag,
    handleRemoveTag,
    canAddTag,
    isSubmitting: createTaskMutation.isPending,
  }
}