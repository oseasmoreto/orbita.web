import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { refreshCurrentUser } from '@/core/router/guards'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { subscribeToPlan } from '../services/billingApi'

/**
 * `ApiMessageKey::ErrorDocumentRequired` real do backend
 * (`Domain/Shared/Enums/ApiMessageKey.php`) — `SubscribeToPlanAction`
 * lança isso quando o usuário ainda não tem CPF/CNPJ cadastrado e não
 * mandou um no payload. Exportada separada pra ser testável sem montar
 * o composable inteiro (é a única ramificação de decisão real aqui).
 */
const DOCUMENT_REQUIRED_MESSAGE_KEY = 'errorMessageDocumentRequired'

export function isDocumentRequiredError(messageKey: string): boolean {
  return messageKey === DOCUMENT_REQUIRED_MESSAGE_KEY
}

/**
 * Assinar um plano trial (`Plan.isTrial`) pula Payment/Transaction/Mercado
 * Pago inteiramente (backend tarefa 54, 2026-09-01) — a assinatura já
 * nasce `status: 'active'` e `POST /subscriptions` devolve
 * `checkout_url: null`, o sinal pra redirecionar direto pra
 * `/billing/success` em vez de abrir o checkout hospedado.
 */
export function isCheckoutSkipped(checkoutUrl: string | null): checkoutUrl is null {
  return checkoutUrl === null
}

/**
 * Orquestra `POST /subscriptions` (cria assinatura + preferência de
 * checkout no Mercado Pago) e os 2 desvios reais de negócio no caminho:
 * usuário sem `document` cadastrado (abre `DocumentPromptModal.vue` e
 * reenvia a mesma assinatura com o documento assim que confirmado, sem
 * precisar clicar de novo no plano) e assinatura de plano trial
 * (`isCheckoutSkipped` — sem checkout nenhum, vai direto pra
 * `/billing/success`). Fora esses 2 casos, sucesso é sempre um REDIRECT
 * de página inteira pro Mercado Pago (Checkout Pro, hospedado) — nunca
 * renderizamos QR code/formulário de cartão nós mesmos.
 */
export function useSubscribeToPlan() {
  const isSubscribing = ref(false)
  const isDocumentPromptOpen = ref(false)
  const pendingPlanId = ref<string | null>(null)
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const router = useRouter()

  async function subscribe(planId: string, document?: string): Promise<void> {
    isSubscribing.value = true

    try {
      const checkout = await subscribeToPlan(planId, document)

      if (isCheckoutSkipped(checkout.checkoutUrl)) {
        // Achado real, 2026-09-01: sem isso, `authStore.requiresSubscription`
        // fica preso no valor de ANTES da assinatura existir (a store só é
        // hidratada uma vez por carregamento, `bootstrapSession()`) — o
        // guard de rota manda de volta pra `/choose-plan` na primeira
        // navegação seguinte, mesmo o backend já respondendo
        // `requires_subscription: false`. Ver `refreshCurrentUser()`.
        await refreshCurrentUser()
        await router.push({ name: 'billing-success' })
        return
      }

      window.location.href = checkout.checkoutUrl
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)

      if (isDocumentRequiredError(apiError.messageKey)) {
        pendingPlanId.value = planId
        isDocumentPromptOpen.value = true
        return
      }

      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isSubscribing.value = false
    }
  }

  async function confirmDocument(document: string): Promise<void> {
    if (!pendingPlanId.value) {
      return
    }

    isDocumentPromptOpen.value = false
    await subscribe(pendingPlanId.value, document)
  }

  return { confirmDocument, isDocumentPromptOpen, isSubscribing, pendingPlanId, subscribe }
}
