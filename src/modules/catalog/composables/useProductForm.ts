import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import { createProductFormSchema, type ProductFormValues } from '../schemas/productFormSchema'
import { createProduct, updateProduct } from '../services/catalogApi'
import type { Product } from '../types/product.type'

function emptyFormValues(): ProductFormValues {
  return {
    costPrice: 0,
    ean: '',
    height: null,
    length: null,
    name: '',
    ncm: '',
    operationalCost: null,
    sku: '',
    targetMargin: 0,
    weight: null,
    width: null,
  }
}

function toFormValues(product: Product): ProductFormValues {
  return {
    costPrice: Number(product.costPrice),
    ean: product.ean ?? '',
    height: product.height === null ? null : Number(product.height),
    length: product.length === null ? null : Number(product.length),
    name: product.name,
    ncm: product.ncm ?? '',
    operationalCost: product.operationalCost === null ? null : Number(product.operationalCost),
    sku: product.sku,
    targetMargin: Number(product.targetMargin),
    weight: product.weight === null ? null : Number(product.weight),
    width: product.width === null ? null : Number(product.width),
  }
}

/**
 * `ProductFormValues` (camelCase, uso interno) → payload real da API
 * (snake_case, `CreateProductRequest`/`UpdateProductRequest`).
 * `ean`/`ncm` opcionais (2026-09-04) — `values.ean`/`values.ncm` nunca é
 * `null` no form (`Input.vue` só trabalha com `string`), string vazia
 * vira `null` aqui, mesmo padrão de `responsible_document`
 * (`useCompanyForm.ts`).
 */
function toRequestPayload(values: ProductFormValues) {
  return {
    cost_price: values.costPrice,
    ean: values.ean || null,
    height: values.height,
    length: values.length,
    name: values.name,
    ncm: values.ncm || null,
    operational_cost: values.operationalCost,
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
