import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createUserMarketplaceFormSchema,
  type UserMarketplaceFormValues,
} from '../schemas/userMarketplaceFormSchema'
import { createUserMarketplace, updateUserMarketplace } from '../services/pricingApi'
import type { UserMarketplace } from '../types/userMarketplace.type'

function emptyFormValues(): UserMarketplaceFormValues {
  return {
    adsPercentage: null,
    affiliatePercentage: null,
    campaignDiscountPercentage: null,
    couponValue: null,
    marketplaceId: '',
    storeName: '',
  }
}

function toFormValues(connection: UserMarketplace): UserMarketplaceFormValues {
  return {
    adsPercentage: connection.adsPercentage === null ? null : Number(connection.adsPercentage),
    affiliatePercentage:
      connection.affiliatePercentage === null ? null : Number(connection.affiliatePercentage),
    campaignDiscountPercentage:
      connection.campaignDiscountPercentage === null
        ? null
        : Number(connection.campaignDiscountPercentage),
    couponValue: connection.couponValue === null ? null : Number(connection.couponValue),
    marketplaceId: connection.marketplaceId,
    storeName: connection.storeName,
  }
}

function toRequestPayload(values: UserMarketplaceFormValues) {
  return {
    ads_percentage: values.adsPercentage,
    affiliate_percentage: values.affiliatePercentage,
    campaign_discount_percentage: values.campaignDiscountPercentage,
    coupon_value: values.couponValue,
    marketplace_id: values.marketplaceId,
    store_name: values.storeName,
  }
}

/**
 * Formulário único pra conectar (create) E editar (update) uma conexão —
 * em cima de `useResourceForm`, mesmo padrão dos demais
 * `use<Recurso>Form.ts`. `marketplaceId` é PARTE dos valores do form (não
 * fixo via parâmetro do composable, diferente de `useProductLaunchForm`)
 * porque uma única instância deste composable é reaproveitada pro grid
 * INTEIRO de cards (`MarketplacesView.vue`) — cada card referencia um
 * marketplace diferente, então o alvo do CREATE muda a cada abertura do
 * modal (`ConnectMarketplaceModal.vue` seta `values.marketplaceId` antes
 * de abrir), nunca fixo pra vida toda do composable.
 *
 * `adsPercentage`/`affiliatePercentage`/`campaignDiscountPercentage`
 * (tarefa 65) — editáveis nos dois modos, `update()` manda os 3 junto do
 * `store_name` (diferente da versão anterior, que só mandava
 * `store_name` no PATCH). `marketplace_id` continua fora do PATCH de
 * propósito — `UpdateUserMarketplaceRequest` real do backend nem aceita
 * esse campo (não dá pra trocar o marketplace de uma conexão já
 * existente), só entra no payload de `toRequestPayload` porque o CREATE
 * precisa dele.
 *
 * `couponValue` (2026-09-04) — mesmo tratamento dos 3 percentuais acima
 * (editável nos dois modos, mandado no `update()`), só que é um valor
 * FIXO em R$, não percentual.
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
      updateUserMarketplace(existing.id, {
        ads_percentage: payload.ads_percentage,
        affiliate_percentage: payload.affiliate_percentage,
        campaign_discount_percentage: payload.campaign_discount_percentage,
        coupon_value: payload.coupon_value,
        store_name: payload.store_name,
      }),
  })
}
