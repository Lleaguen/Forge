import { api } from '../../../shared/api/axios'

type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    fullName: string
  }
}


export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post('/auth/login', payload)
  console.log('login response data:', data)

  try {
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
  } catch (error) {
    console.error('Error storing tokens in localStorage:', error)
  }
  console.log('login response data:', data)

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
