import { isAxiosError } from 'axios'
import type { ApiError, ApiResponse } from '@/shared/types/api.type'

const FALLBACK_MESSAGE_KEY = 'errors.unknown'

/**
 * Achado real: o 422 do Laravel devolve `errors` chaveado pelo nome do
 * REQUEST (snake_case, ex. `full_sale_price`), mas `errors.value` de todo
 * `useXForm.ts` é indexado pela chave camelCase do próprio
 * `XFormValues` (`fullSalePrice`). Sem essa conversão, o loop padrão
 * (`errors.value[field as keyof XFormValues] = messages[0]`) grava numa
 * chave que `fieldError()` nunca lê — o erro de campo simplesmente não
 * aparece sob o input, só o toast genérico. 3 forms (`useRegisterForm`/
 * `useUpdateProfileForm`/`useResetPasswordForm`) já tinham percebido isso
 * pro ÚNICO campo multi-palavra que cada um tem (`password_confirmation`)
 * e remendado com um ternário ad-hoc repetido; `useProductForm.ts` (3
 * campos multi-palavra: `full_sale_price`/`purchase_price`/`target_margin`)
 * nunca tinha sido corrigido. Centralizado aqui — uma correção resolve
 * todo formulário existente e futuro, sem precisar lembrar de remendar
 * campo por campo de novo.
 */
function toCamelCaseKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_match, letter: string) => letter.toUpperCase())
}

function mapFieldErrorKeys(
  fieldErrors: Record<string, string[]> | null,
): Record<string, string[]> | null {
  if (!fieldErrors) {
    return null
  }

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [toCamelCaseKey(key), messages]),
  )
}

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError<ApiResponse<unknown>>(error) && error.response) {
    const body = error.response.data

    return {
      fieldErrors: mapFieldErrorKeys(body?.errors ?? null),
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
