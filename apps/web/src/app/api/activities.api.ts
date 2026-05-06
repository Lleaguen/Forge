import { api } from '../shared/api/axios';
import { Activity } from '../types/api.types';

export async function getActivities(limit?: number): Promise<{ success: boolean; data: Activity[] }> {
  const params = limit ? { limit: limit.toString() } : {};
  const { data } = await api.get('/activities', { params });
  return data;
}