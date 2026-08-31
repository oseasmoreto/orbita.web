import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  cancelSubscription,
  changeSubscriptionPlan,
  getCurrentSubscription,
} from '../services/billingApi'
import type { Subscription } from '../types/subscription.type'

/**
 * Se pode cancelar a renovação agora — só falso quando já não há
 * assinatura ou o cancelamento já foi agendado (`cancelAtPeriodEnd`).
 * Evita disparar `DELETE /subscriptions/{id}` de novo à toa; o backend é
 * idempotente (`CancelSubscriptionAction`), então isso é só UX (esconder
 * o botão), não uma trava real de segurança.
 */
export function canCancelSubscription(subscription: Subscription | null): boolean {
  if (!subscription) {
    return false
  }

  return !subscription.cancelAtPeriodEnd
}

/**
 * Se o plano `planId` é uma troca válida — falso pro próprio plano atual
 * (o backend recusaria com `errorMessageSamePlan`, `ChangeSubscriptionPlanAction`).
 * Usado por `MySubscriptionView.vue` pra marcar o card do plano atual como
 * `isCurrent` em vez de oferecer selecioná-lo de novo.
 */
export function canChangeToPlan(subscription: Subscription | null, planId: string): boolean {
  if (!subscription) {
    return false
  }

  return subscription.planId !== planId
}

/**
 * Orquestra `GET/PATCH/DELETE /subscriptions` pra tela "Meu plano"
 * (`MySubscriptionView.vue`) — fetch da assinatura atual + as duas ações
 * reais (cancelar renovação, trocar de plano). `changePlan()` tem o mesmo
 * formato de `useSubscribeToPlan.subscribe()`: sucesso é sempre um
 * REDIRECT de página inteira pro `checkout_url` (Checkout Pro do Mercado
 * Pago) — nunca renderizamos QR code/formulário de cartão nós mesmos.
 */
export function useSubscription() {
  const subscription = ref<Subscription | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)
  const isCancelling = ref(false)
  const isChangingPlan = ref(false)
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const { t } = useI18n()

  async function load(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      subscription.value = await getCurrentSubscription()
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function cancel(): Promise<void> {
    if (!(subscription.value && canCancelSubscription(subscription.value))) {
      return
    }

    isCancelling.value = true

    try {
      subscription.value = await cancelSubscription(subscription.value.id)
      toast.success(t('billing.mySubscription.cancelSuccess'))
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isCancelling.value = false
    }
  }

  async function changePlan(planId: string): Promise<void> {
    if (!(subscription.value && canChangeToPlan(subscription.value, planId))) {
      return
    }

    isChangingPlan.value = true

    try {
      const checkout = await changeSubscriptionPlan(subscription.value.id, planId)
      window.location.href = checkout.checkoutUrl
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isChangingPlan.value = false
    }
  }

  return {
    cancel,
    changePlan,
    hasError,
    isCancelling,
    isChangingPlan,
    isLoading,
    load,
    subscription,
  }
}
