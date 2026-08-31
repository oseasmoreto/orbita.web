import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
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
 * `useProductForm.ts`. `productId` é fixo (recebido na criação do
 * composable, não trocável depois) — cada instância vive dentro do
 * contexto de UM produto, nunca precisa saber de outro.
 */
export function useProductLaunchForm(productId: string) {
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createProductLaunchFormSchema(t)

  const values = reactive<ProductLaunchFormValues>(emptyFormValues())
  const errors = ref<Partial<Record<keyof ProductLaunchFormValues, string>>>({})
  const isSubmitting = ref(false)

  function reset(launch?: ProductLaunch): void {
    Object.assign(values, launch ? toFormValues(launch) : emptyFormValues())
    errors.value = {}
  }

  function validate(): boolean {
    const result = schema.safeParse(values)

    if (result.success) {
      errors.value = {}
      return true
    }

    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    )
    return false
  }

  async function submit(existing?: ProductLaunch): Promise<ProductLaunch | null> {
    if (!validate()) {
      return null
    }

    isSubmitting.value = true

    try {
      const payload = toRequestPayload(values)
      const launch = existing
        ? await updateProductLaunch(productId, existing.id, payload)
        : await createProductLaunch(productId, payload)

      toast.success(
        existing
          ? t('catalog.products.launches.form.updateSuccess')
          : t('catalog.products.launches.form.createSuccess'),
      )
      return launch
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          errors.value[field as keyof ProductLaunchFormValues] = resolveFieldError(
            field,
            messages[0],
          )
        }
      }

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, reset, submit, values }
}
