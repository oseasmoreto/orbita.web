import { ref } from 'vue'
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
 * Orquestra `POST /subscriptions` (cria assinatura + preferência de
 * checkout no Mercado Pago) e o único desvio real de negócio no caminho:
 * usuário sem `document` cadastrado. Nesse caso, não falha pro usuário —
 * abre um prompt pedindo o CPF/CNPJ (`DocumentPromptModal.vue`) e
 * reenvia a mesma assinatura com o documento assim que confirmado, sem
 * precisar clicar de novo no plano. Sucesso é sempre um REDIRECT de
 * página inteira pro Mercado Pago (Checkout Pro, hospedado) — nunca
 * renderizamos QR code/formulário de cartão nós mesmos.
 */
export function useSubscribeToPlan() {
  const isSubscribing = ref(false)
  const isDocumentPromptOpen = ref(false)
  const pendingPlanId = ref<string | null>(null)
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  async function subscribe(planId: string, document?: string): Promise<void> {
    isSubscribing.value = true

    try {
      const checkout = await subscribeToPlan(planId, document)
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
