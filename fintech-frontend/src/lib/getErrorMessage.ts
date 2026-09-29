import { isAxiosError } from 'axios'
import type { ApiResponse } from '@/types/api'

// The backend always fails with an ApiResponse<T> body (succecced: false,
// message, errors[]) rather than a bare string, so unwrap that consistently
// wherever a request can fail instead of repeating this in every catch block.
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    const data = error.response?.data
    if (data?.errors?.length) return data.errors.join(', ')
    if (data?.message) return data.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
