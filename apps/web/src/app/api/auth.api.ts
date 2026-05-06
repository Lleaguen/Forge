'use client'
import { api } from '../shared/api/axios'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types'

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type RegisterResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export async function login(payload: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<{ success: boolean; data: LoginResponse }>('/auth/login', payload)
  return data.data
}

export async function register(payload: RegisterCredentials): Promise<RegisterResponse> {
  const { data } = await api.post<{ success: boolean; data: RegisterResponse }>('/auth/register', payload)
  return data.data
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<{ success: boolean; data: User }>('/auth/me');
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

export async function refreshToken(): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>('/auth/refresh', {})
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
