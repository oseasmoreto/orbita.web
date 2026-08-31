import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import { createProductFormSchema, type ProductFormValues } from '../schemas/productFormSchema'
import { createProduct, updateProduct } from '../services/catalogApi'
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
 * todo o "encanamento" (`values`/`errors`/`isSubmitting`, `reset`,
 * `validate`, fluxo de `submit`) mora em `useResourceForm`
 * (`shared/composables/`, pedido do usuário em 2026-08-31 depois de notar
 * que este arquivo e `useProductLaunchForm.ts` eram praticamente
 * idênticos) — aqui só ficam as peças que realmente variam por entidade:
 * schema, conversão de/pra valores de formulário, payload de request, as
 * 2 chamadas de API.
 */
export function useProductForm() {
  const { t } = useI18n()

  return useResourceForm<ProductFormValues, Product, ReturnType<typeof toRequestPayload>>({
    create: createProduct,
    emptyValues: emptyFormValues,
    schema: createProductFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('catalog.products.form.createSuccess')
        : t('catalog.products.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateProduct(existing.id, payload),
  })
}
