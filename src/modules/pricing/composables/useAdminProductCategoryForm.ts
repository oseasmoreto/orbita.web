import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createProductCategoryFormSchema,
  type ProductCategoryFormValues,
} from '../schemas/productCategoryFormSchema'
import { createAdminProductCategory, updateAdminProductCategory } from '../services/pricingApi'
import type { ProductCategory } from '../types/productCategory.type'

function emptyFormValues(): ProductCategoryFormValues {
  return { active: true, title: '' }
}

function toFormValues(category: ProductCategory): ProductCategoryFormValues {
  return { active: category.active, title: category.title }
}

function toRequestPayload(values: ProductCategoryFormValues) {
  return { active: values.active, title: values.title }
}

/**
 * Formulário único pra criar E editar categoria — mesmo padrão de
 * `useAdminMarketplaceForm.ts`, em cima de `useResourceForm`. Cadastro de
 * categoria é exclusivo do admin (tarefa 64).
 */
export function useAdminProductCategoryForm() {
  const { t } = useI18n()

  return useResourceForm<
    ProductCategoryFormValues,
    ProductCategory,
    ReturnType<typeof toRequestPayload>
  >({
    create: createAdminProductCategory,
    emptyValues: emptyFormValues,
    schema: createProductCategoryFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('pricing.admin.productCategories.form.createSuccess')
        : t('pricing.admin.productCategories.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateAdminProductCategory(existing.id, payload),
  })
}
