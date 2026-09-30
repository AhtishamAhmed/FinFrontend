// Mirrors Application.Features.Wallets.Common.WalletDto on the backend.
export interface Wallet {
  id: string
  userId: string
  currency: string
  balance: number
  status: string
  createdAtUtc: string
  updatedAtUtc: string
}

export interface CreateWalletRequest {
  currency: string
}

// Mirrors GetMyBalance's BalanceDto — a lighter payload than the full Wallet.
export interface WalletBalance {
  balance: number
  currency: string
}
