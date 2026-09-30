import { createContext } from 'react'
import type { CurrentUser, LoginRequest } from '@/types/auth'

export interface AuthContextValue {
  user: CurrentUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  // Merges into the cached user (e.g. after a profile edit) so the navbar
  // reflects it immediately, without a second round trip to /auth/me.
  updateUser: (updates: Partial<CurrentUser>) => void
}

// undefined (not null) is the "used outside a provider" sentinel — useAuth()
// throws instead of silently returning a broken value.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
