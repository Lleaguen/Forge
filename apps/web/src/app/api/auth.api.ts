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
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function register(payload: RegisterCredentials): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', payload)
  return data
}

// Nota: El endpoint /auth/me no existe en el backend
// El usuario viene en la respuesta del login/register
// Si necesitas obtener el usuario actual, deberías guardarlo del login
export async function getMe(): Promise<User | null> {
  // Como no hay endpoint /auth/me, retornamos null
  // El usuario debería estar guardado del login
  // TODO: Implementar si el backend agrega este endpoint
  return null
}

export async function refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken })
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
