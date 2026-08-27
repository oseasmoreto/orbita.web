import { isAxiosError } from 'axios'
import type { ApiError, ApiResponse } from '@/shared/types/api'

const FALLBACK_MESSAGE_KEY = 'errors.unknown'

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError<ApiResponse<unknown>>(error) && error.response) {
    const body = error.response.data

    return {
      fieldErrors: body?.errors ?? null,
      messageKey: body?.message ?? FALLBACK_MESSAGE_KEY,
      status: error.response.status,
    }
  }

  return {
    fieldErrors: null,
    messageKey: FALLBACK_MESSAGE_KEY,
    status: 0,
  }
}
