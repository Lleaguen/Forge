'use client'

import { useQuery } from '@tanstack/react-query'
import { getActivities, getDashboardStats } from '../api/activity.api'

export function useActivities(projectId?: string) {
  return useQuery({
    queryKey: ['activities', projectId],
    queryFn: () => getActivities(projectId),
    staleTime: 30 * 1000, // 30 segundos
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000, // 1 minuto
  })
}
