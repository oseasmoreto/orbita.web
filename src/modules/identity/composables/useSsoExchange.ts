import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ensureCsrfCookie } from '@/core/api/client'
import { toFavoriteItem, toImpersonatedBy, toPlanLimits } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { parseApiError } from '@/shared/services/parseApiError'
import { exchangeSsoLoginToken } from '../services/identityApi'
import { toAuthUser } from '../types/user.type'

/**
 * Segundo hop do fluxo SSO (`SsoExchangeView.vue`, rota `/sso/callback`)
 * — troca o token opaco da query string por uma sessão de verdade
 * (`exchangeSsoLoginToken`, `identityApi.ts`) e decide o redirect final,
 * mesmo critério de `useLoginForm.ts`: `requires_company: true` vai pra
 * `company-registration` (empresa antes de plano na jornada — SSO nunca
 * passa pelo formulário de registro próprio, é justamente o caso que
 * motivou `requires_company` existir em `/auth/me`/login também),
 * `requires_subscription: true` vai pra `choose-plan`, senão pro
 * dashboard. Sem `?redirect=` aqui — esse parâmetro não sobrevive à
 * ida-e-volta com o provider OAuth (Google não devolve query string
 * arbitrária nossa), diferente do login manual.
 *
 * Fecha de quebra um gap real já documentado (`SsoCallbackView.vue`,
 * versão anterior): o fluxo antigo não tinha como saber
 * `requires_subscription` nesse ponto (o redirect final do backend não
 * carregava esse sinal) — um cadastro novo via SSO sempre caía no
 * dashboard normal, nunca em `choose-plan`. O novo `LoginResultResource`
 * devolvido por `exchangeSsoLoginToken` já resolve isso.
 */
export function useSsoExchange() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { resolveMessage } = useApiMessage()

  const isExchanging = ref(true)
  const errorMessage = ref<string | null>(null)

  async function exchange(token: string): Promise<void> {
    try {
      await ensureCsrfCookie()
      const result = await exchangeSsoLoginToken(token)

      authStore.setUser(
        toAuthUser(
          result.user,
          result.favorites.map(toFavoriteItem),
          toPlanLimits(result.plan_limits),
          toImpersonatedBy(result.impersonated_by),
        ),
        {
          requiresCompany: result.requires_company,
          requiresSubscription: result.requires_subscription,
        },
      )

      if (result.requires_company) {
        await router.push({ name: 'company-registration' })
      } else if (result.requires_subscription) {
        await router.push({ name: 'choose-plan' })
      } else {
        await router.push({ name: 'home' })
      }
    } catch (caughtError) {
      errorMessage.value = resolveMessage(parseApiError(caughtError).messageKey)
    } finally {
      isExchanging.value = false
    }
  }

  return { errorMessage, exchange, isExchanging }
}
