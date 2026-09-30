import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`
}

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-slate-900">FinTech</span>
          <nav className="flex items-center gap-4">
            <NavLink to="/dashboard" className={navLinkClassName}>
              Dashboard
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={() => logout()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
