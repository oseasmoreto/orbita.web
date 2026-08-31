import { useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'
import { getCurrentSubscription } from '../services/billingApi'
import type { Subscription } from '../types/subscription.type'

const POLL_INTERVAL_MS = 3000
// ~1 minuto de tentativas (20 × 3s) — depois disso desiste em silêncio,
// o conteúdo estático da tela continua correto (mesmo comportamento de
// antes desta feature), só sem a confirmação automática.
const MAX_POLL_ATTEMPTS = 20

/**
 * "Confirmado" tem 2 formatos possíveis, os 2 casos reais de
 * `ConfirmSubscriptionPaymentAction` (backend, chamado pelo webhook):
 * assinatura NOVA (`SubscribeToPlanAction` já cria a linha com
 * `status: pending` antes do redirect — confirma quando vira `active`) ou
 * TROCA de plano (`ChangeSubscriptionPlanAction` já seta `pending_plan_id`
 * antes do redirect — confirma quando ele volta a `null`). As duas rotas
 * de retorno (`/billing/success`/`/pending`) servem os dois fluxos, sem
 * diferenciação na URL — por isso comparar contra um SNAPSHOT (`baseline`,
 * capturado no mount) em vez de checar um valor fixo: só assim dá pra
 * saber qual das duas transições (se alguma) é a que importa aqui.
 */
export function isSubscriptionConfirmed(
  baseline: Subscription | null,
  current: Subscription | null,
): boolean {
  if (!(baseline && current)) {
    return false
  }

  const newSubscriptionActivated = baseline.status === 'pending' && current.status === 'active'
  const planChangeResolved = baseline.pendingPlanId !== null && current.pendingPlanId === null

  return newSubscriptionActivated || planChangeResolved
}

/**
 * Poll de `GET /subscriptions` pra detectar a confirmação assíncrona do
 * webhook do Mercado Pago sem precisar de F5 — `BillingCheckoutResultView.vue`
 * é o único consumidor (variantes `success`/`pending`; `failure` já é um
 * resultado definitivo, sem nada a esperar). `start()` busca o snapshot
 * inicial e só liga o timer se houver mesmo algo pendente pra confirmar —
 * uma assinatura já `active` sem `pending_plan_id` não tem o que pollar.
 */
export function useSubscriptionConfirmationPoll() {
  const isConfirmed = ref(false)
  let baseline: Subscription | null = null
  let attempts = 0

  const {
    isActive: isPolling,
    pause,
    resume,
  } = useIntervalFn(
    () => {
      // `useIntervalFn` espera um callback síncrono (`Fn`) — a promise de
      // `poll()` é intencionalmente descartada aqui, não repassada.
      void poll()
    },
    POLL_INTERVAL_MS,
    { immediate: false },
  )

  async function poll(): Promise<void> {
    attempts += 1

    if (attempts > MAX_POLL_ATTEMPTS) {
      pause()
      return
    }

    const current = await getCurrentSubscription()

    if (isSubscriptionConfirmed(baseline, current)) {
      isConfirmed.value = true
      pause()
    }
  }

  async function start(): Promise<void> {
    baseline = await getCurrentSubscription()

    const hasSomethingToConfirm = baseline?.status === 'pending' || Boolean(baseline?.pendingPlanId)

    if (hasSomethingToConfirm) {
      resume()
    }
  }

  return { isConfirmed, isPolling, pause, start }
}
