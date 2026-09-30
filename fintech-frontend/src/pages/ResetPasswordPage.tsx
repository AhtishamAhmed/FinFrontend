import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '@/api/authApi'
import { FormInput } from '@/components/FormInput'
import { getErrorMessage } from '@/lib/getErrorMessage'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Pre-fill from a reset-link URL (?email=...&token=...) when one exists,
  // but keep both editable — there's no email provider wired up yet, so in
  // dev the token comes from the backend's console log instead of an email.
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await resetPassword({ email, token, newPassword })
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Reset password</h1>

        <div className="flex flex-col gap-4">
          <FormInput
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            id="token"
            label="Reset token"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <FormInput
            id="newPassword"
            label="New password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/login" className="font-medium text-slate-900 underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  )
}
