import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  type CategoryMarketplaceFormValues,
  createCategoryMarketplaceFormSchema,
} from '../schemas/categoryMarketplaceFormSchema'
import {
  createAdminCategoryMarketplace,
  updateAdminCategoryMarketplace,
} from '../services/pricingApi'
import type { CategoryMarketplace } from '../types/categoryMarketplace.type'

function emptyFormValues(): CategoryMarketplaceFormValues {
  return { categoryId: '', commissionPercentage: 0 }
}

function toFormValues(link: CategoryMarketplace): CategoryMarketplaceFormValues {
  return { categoryId: link.categoryId, commissionPercentage: Number(link.commissionPercentage) }
}

/** `category_id` só importa no CREATE — `UpdateCategoryMarketplaceRequest` real do backend nem aceita esse campo, extra ignorado sem erro. */
function toRequestPayload(values: CategoryMarketplaceFormValues) {
  return { category_id: values.categoryId, commission_percentage: values.commissionPercentage }
}

/**
 * Formulário único pra vincular/editar comissão de categoria num
 * marketplace — mesmo padrão de `useAdminPricingRuleForm.ts`, em cima de
 * `useResourceForm`. `marketplaceId` é fixo (recebido na criação do
 * composable), endereçado por `category_id` na URL (não um id próprio do
 * vínculo) — ver `updateAdminCategoryMarketplace`/`pricingApi.ts`.
 */
export function useAdminCategoryMarketplaceForm(marketplaceId: string) {
  const { t } = useI18n()

  return useResourceForm<
    CategoryMarketplaceFormValues,
    CategoryMarketplace,
    ReturnType<typeof toRequestPayload>
  >({
    create: (payload) => createAdminCategoryMarketplace(marketplaceId, payload),
    emptyValues: emptyFormValues,
    schema: createCategoryMarketplaceFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('pricing.admin.categoryMarketplaces.form.createSuccess')
        : t('pricing.admin.categoryMarketplaces.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) =>
      updateAdminCategoryMarketplace(marketplaceId, existing.categoryId, payload),
  })
}
