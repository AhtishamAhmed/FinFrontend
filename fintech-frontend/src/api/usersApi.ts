import { apiClient } from './client'
import type { ApiResponse } from '@/types/api'
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from '@/types/user'

export async function getProfile() {
  const { data } = await apiClient.get<ApiResponse<UserProfile>>('/users/me')
  return data
}

export async function updateProfile(payload: UpdateProfileRequest) {
  const { data } = await apiClient.put<ApiResponse<UserProfile>>('/users/me', payload)
  return data
}

export async function changePassword(payload: ChangePasswordRequest) {
  const { data } = await apiClient.put<ApiResponse<string>>('/users/me/password', payload)
  return data
}
