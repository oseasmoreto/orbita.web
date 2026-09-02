import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { refreshCurrentUser } from '@/core/router/guards'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { subscribeToPlan } from '../services/billingApi'

/**
 * `ApiMessageKey::ErrorCompanyRequired` real do backend
 * (`Domain/Shared/Enums/ApiMessageKey.php`, tarefa 63) —
 * `SubscribeToPlanAction` lança isso se, por algum motivo, o usuário
 * chegar aqui sem empresa cadastrada. Não deveria acontecer no caminho
 * normal (o guard de rota, `core/router/guards.ts`, já manda pra
 * `company-registration` antes de deixar chegar em `/choose-plan` quando
 * `requires_company` é `true`) — é defesa residual pra estado de store
 * desatualizado (2 abas, sessão trocada por baixo), não um fluxo
 * esperado. Exportada separada pra ser testável sem montar o composable
 * inteiro, mesmo padrão que `isDocumentRequiredError` tinha antes desta
 * mudança (removida — o documento saiu daqui, virou cadastro de empresa
 * próprio).
 */
const COMPANY_REQUIRED_MESSAGE_KEY = 'errorMessageCompanyRequired'

export function isCompanyRequiredError(messageKey: string): boolean {
  return messageKey === COMPANY_REQUIRED_MESSAGE_KEY
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
 * checkout no Mercado Pago) e o desvio real de negócio no caminho:
 * assinatura de plano trial (`isCheckoutSkipped` — sem checkout nenhum,
 * vai direto pra `/billing/success`). Fora esse caso, sucesso é sempre um
 * REDIRECT de página inteira pro Mercado Pago (Checkout Pro, hospedado) —
 * nunca renderizamos QR code/formulário de cartão nós mesmos.
 *
 * `errorMessageCompanyRequired` (defesa residual, ver
 * `isCompanyRequiredError` acima) refaz `/auth/me` e manda pra
 * `company-registration` — o guard de rota deveria ter barrado essa
 * navegação bem antes, mas se a store estiver desatualizada por algum
 * motivo, é o caminho de recuperação.
 */
export function useSubscribeToPlan() {
  const isSubscribing = ref(false)
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const router = useRouter()

  async function subscribe(planId: string): Promise<void> {
    isSubscribing.value = true

    try {
      const checkout = await subscribeToPlan(planId)

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

      if (isCompanyRequiredError(apiError.messageKey)) {
        await refreshCurrentUser()
        await router.push({ name: 'company-registration' })
        return
      }

      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isSubscribing.value = false
    }
  }

  return { isSubscribing, subscribe }
}
