import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { createProductFormSchema, type ProductFormValues } from '../schemas/productFormSchema'
// MOCK TEMPORÁRIO (ver `services/catalogApi.mock.ts`) — trocar de volta pra
// `../services/catalogApi` quando a Fase 1 (Identity/login) existir.
import { createProduct, updateProduct } from '../services/catalogApi.mock'
import type { Product } from '../types/product.type'

function emptyFormValues(): ProductFormValues {
  return {
    ean: '',
    fullSalePrice: 0,
    height: null,
    length: null,
    name: '',
    ncm: '',
    purchasePrice: 0,
    sku: '',
    targetMargin: 0,
    weight: null,
    width: null,
  }
}

function toFormValues(product: Product): ProductFormValues {
  return {
    ean: product.ean,
    fullSalePrice: Number(product.fullSalePrice),
    height: product.height === null ? null : Number(product.height),
    length: product.length === null ? null : Number(product.length),
    name: product.name,
    ncm: product.ncm,
    purchasePrice: Number(product.purchasePrice),
    sku: product.sku,
    targetMargin: Number(product.targetMargin),
    weight: product.weight === null ? null : Number(product.weight),
    width: product.width === null ? null : Number(product.width),
  }
}

/** `ProductFormValues` (camelCase, uso interno) → payload real da API (snake_case, `CreateProductRequest`/`UpdateProductRequest`). */
function toRequestPayload(values: ProductFormValues) {
  return {
    ean: values.ean,
    full_sale_price: values.fullSalePrice,
    height: values.height,
    length: values.length,
    name: values.name,
    ncm: values.ncm,
    purchase_price: values.purchasePrice,
    sku: values.sku,
    target_margin: values.targetMargin,
    weight: values.weight,
    width: values.width,
  }
}

/**
 * Formulário único pra criar E editar (pedido direto do usuário,
 * 2026-08-28: "os formulários de criação e edição serão os mesmos") —
 * `reset(product?)` monta os valores iniciais conforme o modo
 * (`useCrudDrawer`, `shared/composables/`, é quem decide create-vs-edit;
 * este composable só reage ao registro que vier ou não).
 *
 * Validação via `productFormSchema.safeParse` ANTES de chamar a API
 * (seção 6.2/4 de `docs/infra/convencoes-frontend-infra.md` — nunca
 * confia só no 422 de volta). Erro de campo devolvido pelo backend
 * (`ApiError.fieldErrors`) também popula `errors`, sobrepondo a
 * validação do cliente pra qualquer regra que só o servidor conhece.
 */
export function useProductForm() {
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createProductFormSchema(t)

  const values = reactive<ProductFormValues>(emptyFormValues())
  const errors = ref<Partial<Record<keyof ProductFormValues, string>>>({})
  const isSubmitting = ref(false)

  function reset(product?: Product): void {
    Object.assign(values, product ? toFormValues(product) : emptyFormValues())
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

  async function submit(existing?: Product): Promise<Product | null> {
    if (!validate()) {
      return null
    }

    isSubmitting.value = true

    try {
      const payload = toRequestPayload(values)
      const product = existing
        ? await updateProduct(existing.id, payload)
        : await createProduct(payload)

      toast.success(
        existing
          ? t('catalog.products.form.updateSuccess')
          : t('catalog.products.form.createSuccess'),
      )
      return product
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          errors.value[field as keyof ProductFormValues] = messages[0]
        }
      }

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, reset, submit, values }
}
