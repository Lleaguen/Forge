export interface User {
  id: string
  email: string
  fullName: string
  role: 'ADMIN' | 'MEMBER'
  avatarUrl?: string
  organization?: {
    id: string
    name: string
  }
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  fullName: string
  email: string
  password: string
  plan?: 'free' | 'pro' | 'enterprise'
}

export interface AuthResponse {
  user: User
  token: string
}  