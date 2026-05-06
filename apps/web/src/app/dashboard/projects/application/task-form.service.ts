import { CreateTaskFormData } from '../domain/task-form.validations'
import { FORM_DEFAULTS } from '../domain/task-form.constants'

export class TaskFormService {
  static validateTag(tag: string, existingTags: string[]): { isValid: boolean; error?: string } {
    const trimmedTag = tag.trim().toLowerCase()
    
    if (!trimmedTag) {
      return { isValid: false, error: 'Tag cannot be empty' }
    }
    
    if (trimmedTag.length > FORM_DEFAULTS.TAG_MAX_LENGTH) {
      return { isValid: false, error: 'Tag too long' }
    }
    
    if (existingTags.includes(trimmedTag)) {
      return { isValid: false, error: 'Tag already exists' }
    }
    
    if (existingTags.length >= FORM_DEFAULTS.MAX_TAGS) {
      return { isValid: false, error: 'Maximum tags reached' }
    }
    
    return { isValid: true }
  }

  static normalizeTag(tag: string): string {
    return tag.trim().toLowerCase()
  }

  static addTag(tag: string, existingTags: string[]): string[] {
    const validation = this.validateTag(tag, existingTags)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }
    
    const normalizedTag = this.normalizeTag(tag)
    return [...existingTags, normalizedTag]
  }

  static removeTag(tagToRemove: string, existingTags: string[]): string[] {
    return existingTags.filter(tag => tag !== tagToRemove)
  }

  static preparePayload(formData: CreateTaskFormData, projectId: string) {
    return {
      projectId,
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      priority: formData.priority,
      tags: formData.tags || [],
      assigneeId: formData.assigneeId || undefined,
    }
  }
}