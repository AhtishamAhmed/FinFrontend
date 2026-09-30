import { useEffect, useState, type FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { createWallet, getMyWallet, getMyWalletStatus } from '@/api/walletsApi'
import { getErrorMessage } from '@/lib/getErrorMessage'
import type { Wallet } from '@/types/wallet'

const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP']

type LoadState = 'loading' | 'has-wallet' | 'no-wallet' | 'error'

export function WalletsPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyWallet()
      .then((response) => {
        setWallet(response.data)
        setState('has-wallet')
      })
      .catch((err) => {
        // The backend has no dedicated "not found" status for this — it's a
        // 400 ApiException either way — so a 400 here is read as "no wallet
        // yet" since that's the only business-error path GetMyWallet has.
        if (isAxiosError(err) && err.response?.status === 400) {
          setState('no-wallet')
        } else {
          setError(getErrorMessage(err))
          setState('error')
        }
      })
  }, [])

  if (state === 'loading') {
    return <p className="text-sm text-slate-500">Loading wallet...</p>
  }

  if (state === 'error') {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (state === 'no-wallet') {
    return <CreateWalletCard onCreated={(created) => { setWallet(created); setState('has-wallet') }} />
  }

  return (
    wallet && (
      <WalletCard
        wallet={wallet}
        onStatusRefreshed={(status) => setWallet((prev) => (prev ? { ...prev, status } : prev))}
      />
    )
  )
}

function WalletCard({ wallet, onStatusRefreshed }: { wallet: Wallet; onStatusRefreshed: (status: string) => void }) {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  async function handleRefreshStatus() {
    setStatusError(null)
    setIsCheckingStatus(true)
    try {
      const response = await getMyWalletStatus()
      onStatusRefreshed(response.data)
    } catch (err) {
      setStatusError(getErrorMessage(err))
    } finally {
      setIsCheckingStatus(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">My Wallet</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {wallet.status}
          </span>
          <button
            onClick={handleRefreshStatus}
            disabled={isCheckingStatus}
            className="text-xs font-medium text-slate-500 underline disabled:opacity-50"
          >
            {isCheckingStatus ? 'Checking...' : 'Refresh status'}
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">Balance</p>
      <p className="mt-1 text-3xl font-semibold text-slate-900">
        {wallet.balance.toFixed(2)} <span className="text-lg font-medium text-slate-500">{wallet.currency}</span>
      </p>

      {statusError && <p className="mt-4 text-sm text-red-600">{statusError}</p>}

      <p className="mt-6 text-xs text-slate-400">Created {new Date(wallet.createdAtUtc).toLocaleString()}</p>
    </div>
  )
}

function CreateWalletCard({ onCreated }: { onCreated: (wallet: Wallet) => void }) {
  const [currency, setCurrency] = useState('PKR')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const response = await createWallet({ currency })
      onCreated(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Create your wallet</h1>
      <p className="mt-2 text-sm text-slate-500">You don't have a wallet yet. Choose a currency to create one.</p>

      <div className="mt-4 flex flex-col gap-1">
        <label htmlFor="currency" className="text-sm font-medium text-slate-700">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create wallet'}
      </button>
    </form>
  )
}
