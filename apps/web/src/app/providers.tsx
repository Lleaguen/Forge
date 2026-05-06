"use client" // Obligatorio para providers de contexto

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from './shared/components/ToastContainer'
import { useState, ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  // Creamos el QueryClient dentro de un estado para evitar que se comparta entre sesiones
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  )
}