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
 *
 * **`ean`/`ncm` viraram opcionais em 2026-09-04** (mudança de contrato do
 * backend, pedido direto do usuário — "nem todo vendedor tem os dois em
 * mãos no momento do cadastro") — `min(1)` removido, sem virar
 * `.nullable()` (o model de `values` continua `string`, `Input.vue` não
 * tem variante nullable): mesmo padrão já usado em
 * `responsibleDocument` (`companyFormSchema.ts`) — string vazia é o
 * "não informado" no formulário, convertida pra `null` só na borda do
 * payload (`useProductForm.ts`, `values.ean || null`).
 */
export function createProductFormSchema(t: (key: string) => string) {
  return z.object({
    costPrice: z.number().positive(t('catalog.products.form.errors.costPricePositive')),
    ean: z.string(),
    height: z.number().positive().nullable(),
    length: z.number().positive().nullable(),
    name: z.string().min(1, t('catalog.products.form.errors.nameRequired')),
    ncm: z.string(),
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
