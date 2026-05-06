import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send httpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
})

// ================================
// REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // httpOnly cookies are sent automatically with withCredentials: true
    return config
  },
  (error) => Promise.reject(error)
)

// ================================
// RESPONSE INTERCEPTOR - SIMPLIFIED
// ================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Don't try to refresh tokens automatically
    // Let the error handler deal with 401s appropriately
    return Promise.reject(error)
  }
)

export default api
