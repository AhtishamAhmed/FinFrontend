import { apiClient } from './client'
import type { ApiResponse } from '@/types/api'
import type {
  CurrentUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from '@/types/auth'

// Thin wrappers around each AuthController endpoint. Components never call
// apiClient/axios directly — they call these functions, which know the
// routes and the request/response shapes.
export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload)
  return data
}

export async function register(payload: RegisterRequest) {
  const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', payload)
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<ApiResponse<CurrentUser>>('/auth/me')
  return data
}

export async function logout(refreshToken: string) {
  const { data } = await apiClient.post<ApiResponse<string>>('/auth/logout', { refreshToken })
  return data
}

export async function refreshToken(refreshToken: string) {
  const { data } = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token', { refreshToken })
  return data
}

export async function forgotPassword(payload: ForgotPasswordRequest) {
  const { data } = await apiClient.post<ApiResponse<string>>('/auth/forgot-password', payload)
  return data
}

export async function resetPassword(payload: ResetPasswordRequest) {
  const { data } = await apiClient.post<ApiResponse<string>>('/auth/reset-password', payload)
  return data
}
