import { computed, type WritableComputedRef } from 'vue'

/**
 * Ponte string↔number pro `v-model` de `Input.vue` (átomo genérico, só
 * expõe `string`, `shared/components/ui/Input.vue`) — mesmo `get`/`set`
 * repetido à mão em todo form de CRUD com campo numérico (`ProductForm.vue`
 * tinha 2 factories locais quase idênticas pra isso; `ProductLaunchForm.vue`
 * reimplementava o mesmo par `get`/`set` de novo, sem reaproveitar nada).
 * `nullable: true` cobre campo opcional (ex.: `PRODUCT.weight`) — string
 * vazia vira `null` (não informado), não `0` (que seria um peso real).
 *
 * Recebe o objeto reativo (`reactive()`, ex.: `values` de
 * `useResourceForm`) + a chave — não um `Ref<number>` isolado — porque
 * escrever de volta precisa mutar a MESMA propriedade que `useResourceForm`
 * valida/envia, sem criar uma segunda fonte de verdade sincronizada à
 * mão.
 */
export function useNumberFieldModel<T extends Record<string, unknown>>(
  values: T,
  key: keyof T & string,
  options?: { nullable?: boolean },
): WritableComputedRef<string> {
  const nullable = options?.nullable ?? false

  return computed<string>({
    get: () => {
      const current = values[key]
      return current === null || current === undefined ? '' : String(current)
    },
    set: (raw) => {
      if (raw === '') {
        values[key] = (nullable ? null : 0) as T[keyof T & string]
        return
      }

      values[key] = Number(raw) as T[keyof T & string]
    },
  })
}
