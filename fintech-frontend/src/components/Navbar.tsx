import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getMyBalance } from '@/api/walletsApi'
import { useAuth } from '@/hooks/useAuth'
import type { WalletBalance } from '@/types/wallet'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`
}

export function Navbar() {
  const { user, logout } = useAuth()
  const [balance, setBalance] = useState<WalletBalance | null>(null)

  useEffect(() => {
    // WalletsController is Customer-only, and a brand-new user may not have
    // created a wallet yet — either case just means "no balance to show",
    // not an error worth surfacing in the navbar.
    if (!user?.roles.includes('Customer')) return
    getMyBalance()
      .then((response) => setBalance(response.data))
      .catch(() => setBalance(null))
  }, [user])

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-slate-900">FinTech</span>
          <nav className="flex items-center gap-4">
            <NavLink to="/dashboard" className={navLinkClassName}>
              Dashboard
            </NavLink>
            <NavLink to="/wallet" className={navLinkClassName}>
              Wallet
            </NavLink>
            <NavLink to="/profile" className={navLinkClassName}>
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {balance && (
            <span className="text-sm font-medium text-slate-900">
              {balance.balance.toFixed(2)} {balance.currency}
            </span>
          )}
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
