import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome, {user?.firstName} {user?.lastName}
      </h1>
      <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
      <p className="mt-1 text-sm text-slate-500">Roles: {user?.roles.join(', ')}</p>
    </div>
  )
}
