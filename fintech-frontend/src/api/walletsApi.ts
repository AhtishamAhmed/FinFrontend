import { apiClient } from './client'
import type { ApiResponse } from '@/types/api'
import type { CreateWalletRequest, Wallet, WalletBalance } from '@/types/wallet'

export async function getMyWallet() {
  const { data } = await apiClient.get<ApiResponse<Wallet>>('/wallets/me')
  return data
}

export async function createWallet(payload: CreateWalletRequest) {
  const { data } = await apiClient.post<ApiResponse<Wallet>>('/wallets', payload)
  return data
}

// Used by the navbar — a lighter call than getMyWallet() for a spot that
// only ever needs the balance, not currency/status/timestamps too.
export async function getMyBalance() {
  const { data } = await apiClient.get<ApiResponse<WalletBalance>>('/wallets/me/balance')
  return data
}

// Used by the "Refresh status" action on the wallet card — lets the customer
// re-check status (e.g. after a possible admin freeze) without refetching
// the whole wallet.
export async function getMyWalletStatus() {
  const { data } = await apiClient.get<ApiResponse<string>>('/wallets/me/status')
  return data
}
