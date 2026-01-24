// import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// // En desarrollo, usar el proxy de Next.js para evitar CORS
// // En producción, usar la URL completa del backend
// // Puedes desactivar el proxy estableciendo NEXT_PUBLIC_USE_PROXY=false
// const getBaseURL = () => {
//   if (typeof window === 'undefined') {
//     // Server-side: usar la URL completa
//     return  'http://localhost:3000/'
//   }
//   // process.env.NEXT_PUBLIC_API_URL ||
//   // Client-side: verificar si se debe usar proxy
//   const useProxy = process.env.NEXT_PUBLIC_USE_PROXY !== 'false'
//   const isDevelopment = process.env.NODE_ENV === 'development'
  
//   if (isDevelopment && useProxy) {
//     return '/' // Proxy de Next.js
//   }
  
//   return  'http://localhost:3000/'
// }
// // process.env.NEXT_PUBLIC_API_URL ||

// export const api = axios.create({
//   baseURL: getBaseURL(),
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Interceptor para agregar el token a las peticiones
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('accessToken')
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Interceptor para manejar errores y refresh token
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

//     // Log del error para debugging (solo en desarrollo)
//     if (process.env.NODE_ENV === 'development' && error.response) {
//       console.error('API Error:', {
//         status: error.response.status,
//         url: originalRequest?.url,
//         baseURL: originalRequest?.baseURL,
//         message: error.message,
//       })
//     }

//     // Si el error es 401 y no hemos intentado refrescar el token
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         if (typeof window !== 'undefined') {
//           const refreshToken = localStorage.getItem('refreshToken')
          
//           if (refreshToken) {
//             // Usar la misma baseURL que la instancia de api
//             const refreshURL = `${getBaseURL()}/auth/refresh`
            
//             const response = await axios.post(
//               refreshURL,
//               { refreshToken },
//               { withCredentials: true }
//             )

//             const { accessToken } = response.data
//             localStorage.setItem('accessToken', accessToken)

//             // Reintentar la petición original con el nuevo token
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${accessToken}`
//             }
//             return api(originalRequest)
//           }
//         }
//       } catch (refreshError) {
//         // Si falla el refresh, limpiar tokens y redirigir al login
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('accessToken')
//           localStorage.removeItem('refreshToken')
//           window.location.href = '/login'
//         }
//         return Promise.reject(refreshError)
//       }
//     }

//     // Si es un 404, puede ser que el backend no esté corriendo o la ruta no exista
//     if (error.response?.status === 404) {
//       const fullUrl = `${originalRequest?.baseURL}${originalRequest?.url}`
//       console.error('404 Error - Verifica que:', {
//         url: fullUrl,
//         backendRunning: '¿Está corriendo el backend en http://localhost:3000?',
//         proxyWorking: '¿El proxy de Next.js está funcionando?',
//         routeExists: `¿La ruta ${originalRequest?.url} existe en el backend?`,
//         suggestion: 'Intenta desactivar el proxy agregando NEXT_PUBLIC_USE_PROXY=false en .env.local'
//       })
//     }

//     return Promise.reject(error)
//   }
// )

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// ================================
// CONFIGURACIÓN DE BASE URL
// ================================

// 🚫 PROXY DESACTIVADO COMPLETAMENTE
// Antes: en desarrollo se usaba '/' esperando un proxy de Next.js
// Problema: Next NO proxya nada sin rewrites, causando 404
// Solución: apuntar siempre directo al backend

const getBaseURL = () => {
  // Server-side y Client-side usan la misma URL
  return 'http://localhost:3000'
}

// ================================
// INSTANCIA DE AXIOS
// ================================

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ================================
// REQUEST INTERCEPTOR (JWT)
// ================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ================================
// RESPONSE INTERCEPTOR (REFRESH TOKEN)
// ================================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Debug solo en desarrollo
    if (process.env.NODE_ENV === 'development' && error.response) {
      console.error('API Error:', {
        status: error.response.status,
        url: originalRequest?.url,
        baseURL: originalRequest?.baseURL,
        message: error.message,
      })
    }

    // Manejo de 401 → refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken')

          if (refreshToken) {
            // 🚫 NO proxy → URL absoluta al backend
            const refreshURL = 'http://localhost:3000/auth/refresh'

            const response = await axios.post(
              refreshURL,
              { refreshToken },
              { withCredentials: true }
            )

            const { accessToken } = response.data
            localStorage.setItem('accessToken', accessToken)

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }

            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh falló → logout forzado
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

