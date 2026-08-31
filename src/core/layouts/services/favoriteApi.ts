import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse } from '@/shared/types/api.type'

type CreateUserFavoriteRequest = components['schemas']['CreateUserFavoriteRequest']
type UserFavoriteResource = components['schemas']['UserFavoriteResource']

/**
 * `POST /favorites` (`userFavorite.store`, `auth:sanctum`, sem
 * `subscription.active` — atalho de navegação não é feature de billing).
 * `USER_FAVORITE` mora no contexto `Platform` (backend), não `Identity` —
 * mesmo padrão já usado por `notifications`, registrado como recurso
 * top-level em vez de aninhado sob `/auth/me`. 422
 * `errorMessageValidation` se `route_name` já estiver favoritado por esse
 * usuário (unique por user) — `parseApiError()` do chamador já resolve
 * isso, sem tratamento especial aqui.
 */
export async function createFavorite(
  payload: CreateUserFavoriteRequest,
): Promise<UserFavoriteResource> {
  const { data } = await apiClient.post<ApiResponse<UserFavoriteResource>>('/favorites', payload)
  return data.data
}

/**
 * `DELETE /favorites/{favorite}` (`userFavorite.destroy`, `auth:sanctum`)
 * — 404 se o id não existir ou for de outro usuário (isolamento via
 * Global Scope no backend, nunca 403 — não vaza que o registro existe).
 */
export async function deleteFavorite(favoriteId: string): Promise<void> {
  await apiClient.delete(`/favorites/${favoriteId}`)
}
