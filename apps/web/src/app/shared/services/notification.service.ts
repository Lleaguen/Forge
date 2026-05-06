'use client'

import { toast, ToastOptions, Id } from 'react-toastify'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationOptions extends Omit<ToastOptions, 'type'> {
  type?: NotificationType
  duration?: number
  persistent?: boolean
}

class NotificationService {
  private defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  }

  private getOptions(options?: NotificationOptions): ToastOptions {
    const { duration, persistent, type, ...toastOptions } = options || {}
    return {
      ...this.defaultOptions,
      ...toastOptions,
      autoClose: persistent ? false : (duration || this.defaultOptions.autoClose)
    }
  }

  success(message: string, options?: NotificationOptions): Id {
    return toast.success(message, this.getOptions(options))
  }

  error(message: string, options?: NotificationOptions): Id {
    return toast.error(message, this.getOptions(options))
  }

  warning(message: string, options?: NotificationOptions): Id {
    return toast.warning(message, this.getOptions(options))
  }

  info(message: string, options?: NotificationOptions): Id {
    return toast.info(message, this.getOptions(options))
  }

  // Auth
  loginSuccess(userName?: string): Id {
    const message = userName ? `Welcome back, ${userName}!` : 'Welcome back!'
    return this.success(message, { duration: 4000 })
  }

  registerSuccess(): Id {
    return this.success('Account created successfully! Welcome to Forge.', { duration: 5000 })
  }

  logoutSuccess(): Id {
    return this.info('You have been logged out. See you soon!', { duration: 3000 })
  }

  // Auth errors
  invalidCredentials(): Id {
    return this.error('Incorrect email or password. Please try again.')
  }

  userNotFound(): Id {
    return this.error('No account found with this email address.')
  }

  emailNotRegistered(): Id {
    return this.error('This email is not registered. Please create an account first.')
  }

  accountLocked(): Id {
    return this.error('Your account has been temporarily locked. Please contact support.')
  }

  sessionExpired(): Id {
    return this.warning('Your session has expired. Please sign in again.')
  }

  // Network & server errors
  networkError(): Id {
    return this.error('Connection error. Please check your internet and try again.')
  }

  serverError(): Id {
    return this.error('Server error. Our team has been notified.')
  }

  notFound(resource?: string): Id {
    const message = resource ? `${resource} not found.` : 'Resource not found.'
    return this.error(message)
  }

  forbidden(): Id {
    return this.error('You do not have permission to perform this action.')
  }

  // CRUD operations
  createSuccess(resource: string): Id {
    return this.success(`${resource} created successfully.`)
  }

  updateSuccess(resource: string): Id {
    return this.success(`${resource} updated successfully.`)
  }

  deleteSuccess(resource: string): Id {
    return this.success(`${resource} deleted successfully.`)
  }

  createError(resource: string): Id {
    return this.error(`Failed to create ${resource}. Please try again.`)
  }

  updateError(resource: string): Id {
    return this.error(`Failed to update ${resource}. Please try again.`)
  }

  deleteError(resource: string): Id {
    return this.error(`Failed to delete ${resource}. Please try again.`)
  }

  // Validation
  validationError(field?: string): Id {
    const message = field
      ? `Validation error in ${field}. Please check the entered data.`
      : 'Validation error. Please check the entered data.'
    return this.error(message)
  }

  requiredField(field: string): Id {
    return this.warning(`The ${field} field is required.`)
  }

  // File operations
  fileTooLarge(maxSize?: string): Id {
    const message = maxSize
      ? `File is too large. Maximum size: ${maxSize}.`
      : 'File is too large.'
    return this.error(message)
  }

  fileUploadSuccess(): Id {
    return this.success('File uploaded successfully.')
  }

  fileUploadError(): Id {
    return this.error('Failed to upload file. Please try again.')
  }

  copyToClipboard(): Id {
    return this.info('Copied to clipboard.', { duration: 2000 })
  }

  // Utilities
  dismiss(toastId: Id): void {
    toast.dismiss(toastId)
  }

  dismissAll(): void {
    toast.dismiss()
  }

  // Helper methods for generic hooks
  getCreateMessage(resource: string): string {
    return `${resource} created successfully.`
  }

  getUpdateMessage(resource: string): string {
    return `${resource} updated successfully.`
  }

  getDeleteMessage(resource: string): string {
    return `${resource} deleted successfully.`
  }

  // Generic HTTP error handler
  handleHttpError(status: number, message?: string, context?: string): Id {
    switch (status) {
      case 400:
        return this.validationError(context)
      case 401:
        if (context?.includes('login')) {
          return this.invalidCredentials()
        }
        return this.sessionExpired()
      case 403:
        return this.forbidden()
      case 404:
        if (context?.includes('login') || context?.includes('auth')) {
          return this.userNotFound()
        }
        return this.notFound(context)
      case 409:
        return this.error('This resource already exists. Please use a different name.')
      case 422:
        return this.validationError()
      case 429:
        return this.warning('Too many requests. Please wait a moment and try again.')
      case 500:
        if (context?.includes('login')) {
          return this.emailNotRegistered()
        }
        return this.serverError()
      case 502:
      case 503:
      case 504:
        return this.error('Service temporarily unavailable. Please try again later.')
      default:
        return this.error(message || 'An unexpected error occurred.')
    }
  }
}

export const notificationService = new NotificationService()
export default notificationService
