import { z } from 'zod'

/**
 * Espelha `CreateProductRequest`/`UpdateProductRequest`
 * (`core/api/schema.d.ts`, gerado do backend real) — mesmos campos,
 * mesma obrigatoriedade. Papel diferente do tipo gerado (seção 6.2 de
 * `docs/infra/convencoes-frontend-infra.md`): isso valida ANTES de
 * submeter, não descreve o contrato da API.
 *
 * "Preço de venda ≥ preço de compra" é o exemplo canônico de regra
 * replicável no cliente citado na própria doc de convenções — via
 * `.refine()`, marcado no campo `fullSalePrice` (é o valor que o
 * vendedor mais provavelmente digitou errado).
 *
 * **Fábrica, não schema pronto** — regra de i18n não-negociável
 * (2026-08-26): mensagem de validação é texto de UI, não pode ficar
 * hardcoded aqui (schema é definido fora de qualquer `setup()`,
 * `useI18n()` não dá pra chamar no top-level do módulo). O consumidor
 * (`useProductForm.ts`) chama `createProductFormSchema(t)` dentro do
 * composable, onde `t` já existe.
 */
export function createProductFormSchema(t: (key: string) => string) {
  return z
    .object({
      ean: z.string().min(1, t('catalog.products.form.errors.eanRequired')),
      fullSalePrice: z.number().positive(t('catalog.products.form.errors.fullSalePricePositive')),
      height: z.number().positive().nullable(),
      length: z.number().positive().nullable(),
      name: z.string().min(1, t('catalog.products.form.errors.nameRequired')),
      ncm: z.string().min(1, t('catalog.products.form.errors.ncmRequired')),
      purchasePrice: z.number().positive(t('catalog.products.form.errors.purchasePricePositive')),
      sku: z.string().min(1, t('catalog.products.form.errors.skuRequired')),
      targetMargin: z
        .number()
        .min(0, t('catalog.products.form.errors.targetMarginMin'))
        .max(100, t('catalog.products.form.errors.targetMarginMax')),
      weight: z.number().positive().nullable(),
      width: z.number().positive().nullable(),
    })
    .refine((data) => data.fullSalePrice >= data.purchasePrice, {
      message: t('catalog.products.form.errors.fullSalePriceBelowPurchase'),
      path: ['fullSalePrice'],
    })
}

export type ProductFormValues = z.infer<ReturnType<typeof createProductFormSchema>>
