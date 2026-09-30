import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/api/authApi'
import { FormInput } from '@/components/FormInput'
import { getErrorMessage } from '@/lib/getErrorMessage'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const response = await forgotPassword({ email })
      // The backend always returns this same message whether or not the
      // email exists, so it can't be used to probe which emails are registered.
      setMessage(response.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-slate-900">Forgot password</h1>
        <p className="mb-6 text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>

        <FormInput
          id="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
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
