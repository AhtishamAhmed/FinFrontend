import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <button
            onClick={() => logout()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            Log out
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
        <p className="mt-1 text-sm text-slate-500">Roles: {user?.roles.join(', ')}</p>
      </div>
    </div>
  )
}
