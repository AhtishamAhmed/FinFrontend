import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'
import type { RefreshTokenResponse } from '@/types/auth'

// One axios instance for the whole app. Every feature's API module (authApi,
// walletsApi, ...) imports this instead of calling axios directly, so the
// base URL and auth header logic live in exactly one place.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT to every outgoing request, if we have one.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// A separate, interceptor-free instance for the refresh call itself — if it
// reused apiClient, a failed refresh would trigger the response interceptor
// below and recurse into itself.
const refreshClient = axios.create({ baseURL: import.meta.env.VITE_API_URL })

// Several requests can all get a 401 back-to-back (e.g. a page firing
// multiple calls on mount). Share one in-flight refresh instead of racing
// several refresh-token calls against each other.
let refreshPromise: Promise<string> | null = null

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function performRefresh(): Promise<string> {
  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (!storedRefreshToken) {
    throw new Error('No refresh token available')
  }

  const { data } = await refreshClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token', {
    refreshToken: storedRefreshToken,
  })

  localStorage.setItem('accessToken', data.data.token)
  localStorage.setItem('refreshToken', data.data.refreshToken)
  return data.data.token
}

// Marks a request as "already retried once" so a request that still 401s
// after a fresh token doesn't retry forever.
type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig
    const isAuthEndpoint = originalRequest.url?.startsWith('/auth/')

    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)
