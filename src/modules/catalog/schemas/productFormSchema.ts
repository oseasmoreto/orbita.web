import { z } from 'zod'

/**
 * Espelha `CreateProductRequest`/`UpdateProductRequest`
 * (`core/api/schema.d.ts`, gerado do backend real) — mesmos campos,
 * mesma obrigatoriedade. Papel diferente do tipo gerado (seção 6.2 de
 * `docs/infra/convencoes-frontend-infra.md`): isso valida ANTES de
 * submeter, não descreve o contrato da API.
 *
 * **`full_sale_price` removido em 2026-09-02** (mudança de contrato do
 * backend, tarefa 62 de `docs/api/ordem-de-implementacao.md`) — nunca
 * teve regra de negócio conectada, por isso a regra cruzada
 * "venda ≥ compra" que existia aqui também saiu junto, sem
 * substituição. `purchasePrice` renomeado pra `costPrice` (mesmo dado,
 * nome mais preciso pro que o vendedor de fato preenche); `operationalCost`
 * é novo, opcional.
 *
 * **Fábrica, não schema pronto** — regra de i18n não-negociável
 * (2026-08-26): mensagem de validação é texto de UI, não pode ficar
 * hardcoded aqui (schema é definido fora de qualquer `setup()`,
 * `useI18n()` não dá pra chamar no top-level do módulo). O consumidor
 * (`useProductForm.ts`) chama `createProductFormSchema(t)` dentro do
 * composable, onde `t` já existe.
 */
export function createProductFormSchema(t: (key: string) => string) {
  return z.object({
    costPrice: z.number().positive(t('catalog.products.form.errors.costPricePositive')),
    ean: z.string().min(1, t('catalog.products.form.errors.eanRequired')),
    height: z.number().positive().nullable(),
    length: z.number().positive().nullable(),
    name: z.string().min(1, t('catalog.products.form.errors.nameRequired')),
    ncm: z.string().min(1, t('catalog.products.form.errors.ncmRequired')),
    operationalCost: z
      .number()
      .min(0, t('catalog.products.form.errors.operationalCostMin'))
      .nullable(),
    sku: z.string().min(1, t('catalog.products.form.errors.skuRequired')),
    targetMargin: z
      .number()
      .min(0, t('catalog.products.form.errors.targetMarginMin'))
      .max(100, t('catalog.products.form.errors.targetMarginMax')),
    weight: z.number().positive().nullable(),
    width: z.number().positive().nullable(),
  })
}

export type ProductFormValues = z.infer<ReturnType<typeof createProductFormSchema>>
