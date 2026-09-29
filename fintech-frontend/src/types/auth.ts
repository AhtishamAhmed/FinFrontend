// Request/response shapes mirrored from Application.Features.Auth.* on the backend.

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
  token: string
  refreshToken: string
  expiresAtUtc: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export interface RegisterResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface CurrentUser {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}
