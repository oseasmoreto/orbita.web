import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createMarketplaceFormSchema,
  type MarketplaceFormValues,
} from '../schemas/marketplaceFormSchema'
import { createAdminMarketplace, updateAdminMarketplace } from '../services/pricingApi'
import type { AdminMarketplace } from '../types/marketplace.type'

function emptyFormValues(): MarketplaceFormValues {
  return { active: true, name: '' }
}

function toFormValues(marketplace: AdminMarketplace): MarketplaceFormValues {
  return { active: marketplace.active, name: marketplace.name }
}

function toRequestPayload(values: MarketplaceFormValues) {
  return { active: values.active, name: values.name }
}

/**
 * Formulário único pra criar E editar marketplace (mesmo padrão de
 * `useProductForm.ts`, em cima de `useResourceForm`,
 * `shared/composables/`) — cadastro de marketplace é exclusivo do admin
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 3).
 */
export function useAdminMarketplaceForm() {
  const { t } = useI18n()

  return useResourceForm<
    MarketplaceFormValues,
    AdminMarketplace,
    ReturnType<typeof toRequestPayload>
  >({
    create: createAdminMarketplace,
    emptyValues: emptyFormValues,
    schema: createMarketplaceFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('pricing.admin.marketplaces.form.createSuccess')
        : t('pricing.admin.marketplaces.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateAdminMarketplace(existing.id, payload),
  })
}
