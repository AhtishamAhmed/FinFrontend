import { useEffect, useState, type FormEvent } from 'react'
import { changePassword, getProfile, updateProfile } from '@/api/usersApi'
import { FormInput } from '@/components/FormInput'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { UserProfile } from '@/types/user'

export function ProfilePage() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then((response) => setProfile(response.data))
      .catch((err) => setLoadError(getErrorMessage(err)))
  }, [])

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>
  }

  if (!profile) {
    return <p className="text-sm text-slate-500">Loading profile...</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileDetailsCard profile={profile} onSaved={setProfile} onUserSynced={updateUser} />
      <ChangePasswordCard />
    </div>
  )
}

function ProfileDetailsCard({
  profile,
  onSaved,
  onUserSynced,
}: {
  profile: UserProfile
  onSaved: (profile: UserProfile) => void
  onUserSynced: (updates: { firstName: string; lastName: string }) => void
}) {
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? '')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsSubmitting(true)
    try {
      const response = await updateProfile({ firstName, lastName, phoneNumber: phoneNumber || null })
      onSaved(response.data)
      onUserSynced({ firstName: response.data.firstName, lastName: response.data.lastName })
      setMessage('Profile updated.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {profile.status}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <FormInput id="email" label="Email" value={profile.email} disabled />
        <FormInput
          id="firstName"
          label="First name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FormInput
          id="lastName"
          label="Last name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <FormInput
          id="phoneNumber"
          label="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
}

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await changePassword({ currentPassword, newPassword })
      setMessage(response.message ?? 'Password changed.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Change password</h2>

      <div className="flex flex-col gap-4">
        <FormInput
          id="currentPassword"
          label="Current password"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <FormInput
          id="newPassword"
          label="New password"
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Updating...' : 'Update password'}
      </button>
    </form>
  )
}
