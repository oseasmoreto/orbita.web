import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { updateAdminSubscription } from '../services/billingApi'
import type { AdminSubscription, SubscriptionStatus } from '../types/subscription.type'

export interface OverrideSubscriptionFormValues {
  endDate: string
  status: SubscriptionStatus
}

/**
 * Bespoke, mesma categoria de `useUpdateUserRoleForm.ts` — só 2 campos
 * (`status`/`end_date`, `OverrideSubscriptionRequest`), sempre um valor
 * de `Select`/`DatePicker` controlado, nada pra validar client-side com
 * Zod. Não é o par create/update que `useResourceForm` modela — não
 * existe "criar" assinatura por aqui (`SubscribeToPlanAction`, fluxo do
 * PRÓPRIO usuário), só correção manual de suporte via `OverrideSubscriptionAction`.
 *
 * `endDate` como `string` vazia (não `null`) — mesmo tipo de
 * `DatePicker.vue` (`v-model` de ISO `YYYY-MM-DD`, `''` representa "sem
 * data"); convertido pra `null` só na hora de montar o payload, já que
 * `OverrideSubscriptionRequest.end_date` é `nullable` de propósito
 * (decisão P11, backend: admin pode limpar a data pra reverter a
 * assinatura pra indeterminada).
 */
export function useOverrideSubscriptionForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const values = reactive<OverrideSubscriptionFormValues>({ endDate: '', status: 'active' })
  const isSubmitting = ref(false)

  function reset(subscription: AdminSubscription): void {
    values.endDate = subscription.endDate ?? ''
    values.status = subscription.status
  }

  async function submit(subscription: AdminSubscription): Promise<AdminSubscription | null> {
    isSubmitting.value = true

    try {
      const updated = await updateAdminSubscription(subscription.id, {
        end_date: values.endDate || null,
        status: values.status,
      })
      toast.success(t('billing.admin.subscriptions.updateSuccess'))
      return updated
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { isSubmitting, reset, submit, values }
}
