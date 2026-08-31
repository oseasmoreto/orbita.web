import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createUserMarketplaceFormSchema,
  type UserMarketplaceFormValues,
} from '../schemas/userMarketplaceFormSchema'
import { createUserMarketplace, updateUserMarketplace } from '../services/pricingApi'
import type { UserMarketplace } from '../types/userMarketplace.type'

function emptyFormValues(): UserMarketplaceFormValues {
  return { marketplaceId: '', storeName: '' }
}

function toFormValues(connection: UserMarketplace): UserMarketplaceFormValues {
  return { marketplaceId: connection.marketplaceId, storeName: connection.storeName }
}

function toRequestPayload(values: UserMarketplaceFormValues) {
  return { marketplace_id: values.marketplaceId, store_name: values.storeName }
}

/**
 * Formulário único pra conectar (create) E editar o nome da loja (update)
 * de uma conexão — em cima de `useResourceForm`, mesmo padrão dos demais
 * `use<Recurso>Form.ts`. `marketplaceId` é PARTE dos valores do form (não
 * fixo via parâmetro do composable, diferente de `useProductLaunchForm`)
 * porque uma única instância deste composable é reaproveitada pro grid
 * INTEIRO de cards (`MarketplacesView.vue`) — cada card referencia um
 * marketplace diferente, então o alvo do CREATE muda a cada abertura do
 * modal (`ConnectMarketplaceModal.vue` seta `values.marketplaceId` antes
 * de abrir), nunca fixo pra vida toda do composable.
 */
export function useUserMarketplaceForm() {
  const { t } = useI18n()

  return useResourceForm<
    UserMarketplaceFormValues,
    UserMarketplace,
    ReturnType<typeof toRequestPayload>
  >({
    create: createUserMarketplace,
    emptyValues: emptyFormValues,
    schema: createUserMarketplaceFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('pricing.marketplaces.connectModal.connectSuccess')
        : t('pricing.marketplaces.connectModal.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) =>
      updateUserMarketplace(existing.id, { store_name: payload.store_name }),
  })
}
