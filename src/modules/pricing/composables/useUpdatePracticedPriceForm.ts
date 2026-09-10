import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import type { UpdatePracticedPriceFormValues } from '../schemas/updatePracticedPriceFormSchema'
import { createUpdatePracticedPriceFormSchema } from '../schemas/updatePracticedPriceFormSchema'
import { updateProductMarketplace } from '../services/pricingApi'
import type { ProductMarketplace } from '../types/productMarketplace.type'

/**
 * Alvo mínimo pro PATCH — tanto `ProductMarketplace` (tabela POR
 * PRODUTO, `ProductMarketplacesView.vue`) quanto `ProductMarketplacePricing`
 * (tabela POR CONEXÃO, `ProductMarketplacePricingView.vue`) satisfazem
 * essa forma estruturalmente, sem precisar de conversão — os dois vêm do
 * MESMO vínculo `PRODUCT_MARKETPLACE`, só serializado por 2 Resources
 * diferentes do backend (achado real, 2026-09-03: `practicedPrice`
 * nunca tinha sido adicionado no tipo `ProductMarketplace` "simples",
 * só no da listagem calculada — ver comentário em
 * `productMarketplace.type.ts`). `categoryId`/`status` entraram em
 * 2026-09-10 pelo mesmo motivo — os 2 tipos já tinham os campos, só o
 * alvo do PATCH não pedia ainda.
 */
export type PracticedPriceTarget = Pick<
  ProductMarketplace,
  'categoryId' | 'id' | 'practicedPrice' | 'productId' | 'status'
>

/**
 * Bespoke, mesma categoria de `useOverrideSubscriptionForm.ts`/
 * `useUpdateUserRoleForm.ts` — 2 campos (`practicedPrice`/`categoryId`),
 * não é o par create/update que `useResourceForm` modela (não existe
 * "criar" um `PRODUCT_MARKETPLACE` por aqui — o vínculo já nasce
 * automático no backend, só editar um já existente). `submit()` recebe a
 * `row` inteira (não só o id) porque
 * `PATCH /products/{productId}/marketplaces/{productMarketplaceId}`
 * precisa dos DOIS ids, `productId` não é o mesmo `id` do vínculo.
 */
export function useUpdatePracticedPriceForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage, resolveFieldError } = useApiMessage()
  const schema = createUpdatePracticedPriceFormSchema(t)

  const values = reactive<UpdatePracticedPriceFormValues>({
    categoryId: null,
    practicedPrice: null,
    status: 'not_sent',
  })
  const errors = ref<Partial<Record<keyof UpdatePracticedPriceFormValues, string>>>({})
  const isSubmitting = ref(false)

  function reset(row: PracticedPriceTarget): void {
    values.categoryId = row.categoryId
    values.practicedPrice = row.practicedPrice === null ? null : Number(row.practicedPrice)
    values.status = row.status
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

  async function submit(row: PracticedPriceTarget): Promise<boolean> {
    if (!validate()) {
      return false
    }

    isSubmitting.value = true

    try {
      await updateProductMarketplace(
        row.productId,
        row.id,
        values.practicedPrice,
        values.status,
        values.categoryId ?? undefined,
      )
      toast.success(t('pricing.productMarketplacePricing.editModal.success'))
      return true
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          errors.value[field as keyof UpdatePracticedPriceFormValues] = resolveFieldError(
            field,
            messages[0],
          )
        }
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, reset, submit, values }
}
