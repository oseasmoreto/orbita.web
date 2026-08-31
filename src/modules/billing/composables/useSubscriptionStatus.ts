import dayjs from 'dayjs'
import { fetchMostRecentSubscription } from '../services/billingApi'
import type { Subscription } from '../types/subscription.type'

/**
 * Espelha `UserSubscriptionStatus::isActive()` (backend,
 * `Domain/Billing/Services/UserSubscriptionStatus.php`) — mesma regra
 * exata: status `active` E, se tiver `end_date`, ainda não vencido.
 * Duplicada aqui de propósito: não existe um `/auth/me` que devolva esse
 * campo pronto (só `LoginResultResource.requires_subscription`, calculado
 * só no momento do login) — é a única forma do guard de rota
 * (`core/router/guards.ts`) saber isso numa navegação qualquer, não só
 * logo após logar.
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (subscription?.status !== 'active') {
    return false
  }

  if (!subscription.endDate) {
    return true
  }

  return !dayjs(subscription.endDate).isBefore(dayjs().startOf('day'))
}

export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await fetchMostRecentSubscription()
  return isSubscriptionActive(subscription)
}
