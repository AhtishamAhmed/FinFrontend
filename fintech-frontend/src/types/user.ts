// Mirrors Application.Features.Users.* on the backend.
// UserProfileDto is richer than auth's CurrentUser (adds phoneNumber, status)
// because /users/me is the full profile resource, while /auth/me is just
// "who is this token for" — kept as two separate types on purpose.

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  status: string
  roles: string[]
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  phoneNumber: string | null
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
