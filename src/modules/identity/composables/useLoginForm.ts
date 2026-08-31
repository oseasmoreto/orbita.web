import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ensureCsrfCookie } from '@/core/api/client'
import { toFavoriteItem, toPlanLimits } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { createLoginFormSchema, type LoginFormValues } from '../schemas/loginFormSchema'
import { login } from '../services/identityApi'
import { toAuthUser } from '../types/user.type'

function emptyValues(): LoginFormValues {
  return { email: '', password: '' }
}

/**
 * `login()` (`identityApi.ts`) já absorve a nuance de transporte do 402
 * (Payment Required = login válido sem assinatura ativa) — aqui só resta
 * decidir o que fazer com `requires_subscription: true`: manda pra
 * `choose-plan` (casca da Fase 2, `modules/billing`) em vez de continuar
 * pro dashboard/`?redirect=` — não faz sentido devolver o usuário pra uma
 * rota protegida se ele ainda nem escolheu um plano.
 */
export function useLoginForm() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createLoginFormSchema(t)

  const values = reactive<LoginFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof LoginFormValues, string>>>({})
  const isSubmitting = ref(false)

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

  async function submit(): Promise<void> {
    if (!validate()) {
      return
    }

    isSubmitting.value = true

    try {
      await ensureCsrfCookie()
      const result = await login({ email: values.email, password: values.password })

      authStore.setUser(
        toAuthUser(
          result.user,
          result.favorites.map(toFavoriteItem),
          toPlanLimits(result.plan_limits),
        ),
        {
          requiresSubscription: result.requires_subscription,
        },
      )

      if (result.requires_subscription) {
        await router.push({ name: 'choose-plan' })
        return
      }

      // `?redirect=` vem do guard (`core/router/guards.ts`) quando o
      // usuário foi bounced de uma rota protegida — volta pra lá em vez de
      // sempre cair no dashboard. Só aceita caminho relativo (`/...`),
      // nunca uma URL absoluta — evita um redirect aberto pra fora do app
      // via query string manipulada.
      const { redirect } = route.query
      const redirectPath =
        typeof redirect === 'string' && redirect.startsWith('/') ? redirect : null

      await router.push(redirectPath ?? { name: 'home' })
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          errors.value[field as keyof LoginFormValues] = resolveFieldError(field, messages[0])
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, submit, values }
}
