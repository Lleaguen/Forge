'use client'

import { useState, useCallback } from 'react'

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState)
  
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  
  return {
    isOpen,
    open,
    close,
    toggle
  }
}

// Hook para múltiples modales
export function useModals<T extends string>(modalNames: T[]): Record<T, UseModalReturn> {
  const modals = {} as Record<T, UseModalReturn>
  
  modalNames.forEach(name => {
    modals[name] = useModal()
  })
  
  return modals
}