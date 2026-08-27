/**
 * Envelope real de toda resposta da API (docs/infra/convencoes-backend-infra.md,
 * `ApiResponse`). `message` é sempre uma `ApiMessageKey` catalogada, nunca texto
 * pronto — resolvida via vue-i18n (core/i18n) no ponto de exibição.
 */
export interface ApiResponse<T> {
  data: T
  errors: Record<string, string[]> | null
  message: string
  success: boolean
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
}

export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}

export interface ApiError {
  fieldErrors: Record<string, string[]> | null
  messageKey: string
  status: number
}
