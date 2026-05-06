import { api } from '../shared/api/axios';
import { DashboardStats } from '../types/api.types';

export async function getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
  const { data } = await api.get('/dashboard/stats');
  return data;
}