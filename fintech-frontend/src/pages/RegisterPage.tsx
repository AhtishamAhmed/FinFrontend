import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '@/api/authApi'
import { FormInput } from '@/components/FormInput'
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { RegisterRequest } from '@/types/auth'

const emptyForm: RegisterRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterRequest>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field: keyof RegisterRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register(form)
      // Registration doesn't return a token, so the user logs in next.
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
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Create an account</h1>

        <div className="flex flex-col gap-4">
          <FormInput
            id="firstName"
            label="First name"
            required
            value={form.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
          />
          <FormInput
            id="lastName"
            label="Last name"
            required
            value={form.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          <FormInput
            id="phoneNumber"
            label="Phone number"
            required
            value={form.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
