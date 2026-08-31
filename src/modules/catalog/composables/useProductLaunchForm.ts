import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createProductLaunchFormSchema,
  type ProductLaunchFormValues,
} from '../schemas/productLaunchFormSchema'
import { createProductLaunch, updateProductLaunch } from '../services/catalogApi'
import type { ProductLaunch } from '../types/productLaunch.type'

function emptyFormValues(): ProductLaunchFormValues {
  return {
    date: '',
    purchasePrice: 0,
    quantity: 1,
  }
}

function toFormValues(launch: ProductLaunch): ProductLaunchFormValues {
  return {
    date: launch.date,
    purchasePrice: Number(launch.purchasePrice),
    quantity: launch.quantity,
  }
}

/** `ProductLaunchFormValues` (camelCase) → payload real da API (snake_case, `CreateProductLaunchRequest`/`UpdateProductLaunchRequest`). */
function toRequestPayload(values: ProductLaunchFormValues) {
  return {
    date: values.date,
    purchase_price: values.purchasePrice,
    quantity: values.quantity,
  }
}

/**
 * Formulário único pra criar E editar lançamento — mesmo padrão de
 * `useProductForm.ts`, ambos em cima de `useResourceForm`
 * (`shared/composables/`). `productId` é fixo (recebido na criação do
 * composable, não trocável depois) — cada instância vive dentro do
 * contexto de UM produto, nunca precisa saber de outro.
 */
export function useProductLaunchForm(productId: string) {
  const { t } = useI18n()

  return useResourceForm<
    ProductLaunchFormValues,
    ProductLaunch,
    ReturnType<typeof toRequestPayload>
  >({
    create: (payload) => createProductLaunch(productId, payload),
    emptyValues: emptyFormValues,
    schema: createProductLaunchFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('catalog.products.launches.form.createSuccess')
        : t('catalog.products.launches.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateProductLaunch(productId, existing.id, payload),
  })
}
