import { useEffect, useState, type ReactNode } from 'react'
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from '@/api/authApi'
import type { CurrentUser, LoginRequest } from '@/types/auth'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  // No stored token means there's nothing to verify, so start "not loading".
  // Only the token case needs an effect (and the setState that ends it).
  const [isLoading, setIsLoading] = useState(() => localStorage.getItem('accessToken') !== null)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return

    getCurrentUser()
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function login(payload: LoginRequest) {
    const response = await loginRequest(payload)
    const { token, refreshToken, ...currentUser } = response.data
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(currentUser)
  }

  async function logout() {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      if (refreshToken) {
        await logoutRequest(refreshToken)
      }
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  function updateUser(updates: Partial<CurrentUser>) {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: user !== null, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
