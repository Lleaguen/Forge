import { api } from '../../../shared/api/axios'

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export const register = async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return data
}
