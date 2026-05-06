'use client'

import { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  maxWidth?: string
  showCloseButton?: boolean
  actions?: ReactNode
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  maxWidth = 'max-w-2xl',
  showCloseButton = true,
  actions
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-800`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex-shrink-0 px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-brand-primary dark:text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0 px-6 pb-6 pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}