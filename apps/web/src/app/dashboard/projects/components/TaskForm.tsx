'use client'

import { useState } from 'react'
import { Button } from '@/components/shared'
import { FormField } from '@/components/forms/FormField'
import { TagInput } from '@/components/forms/TagInput'
import { SelectField } from '@/components/forms/SelectField'
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../domain/task-form.constants'
import { useTaskForm } from '../application/use-task-form.hook'
import { TaskFormProps } from '../domain/task-form.types'

export function TaskForm({ projectId, onSuccess, onClose }: TaskFormProps) {
  const {
    form,
    tagInput,
    setTagInput,
    watchedTags,
    handleSubmit,
    handleAddTag,
    handleRemoveTag,
    canAddTag,
    isSubmitting,
  } = useTaskForm(projectId, onSuccess, onClose)

  const { register, watch, formState: { errors } } = form

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-primary placeholder:text-brand-primary/40 dark:text-white dark:placeholder:text-slate-500 dark:bg-slate-700 dark:border-slate-600"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Title" required error={errors.title?.message}>
        <input
          {...register('title')}
          type="text"
          className={inputClass}
          placeholder="Enter task title..."
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={3}
          className={inputClass}
          placeholder="Describe the task in detail..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category">
          <SelectField
            options={TASK_CATEGORIES}
            register={register}
            name="category"
            selectedValue={watch('category')}
          />
        </FormField>

        <FormField label="Priority">
          <SelectField
            options={TASK_PRIORITIES}
            register={register}
            name="priority"
            selectedValue={watch('priority')}
          />
        </FormField>
      </div>

      <FormField label="Tags">
        <TagInput
          tags={watchedTags}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          canAddTag={canAddTag()}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-10 px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="h-10 px-6"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
