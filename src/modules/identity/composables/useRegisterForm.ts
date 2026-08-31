import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ensureCsrfCookie } from '@/core/api/client'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { createRegisterFormSchema, type RegisterFormValues } from '../schemas/registerFormSchema'
import { register } from '../services/identityApi'
import { toAuthUser } from '../types/user.type'

function emptyValues(): RegisterFormValues {
  return { email: '', name: '', password: '', passwordConfirmation: '' }
}

/**
 * `register.store` (`core/api/schema.d.ts`) devolve só `UserResource`
 * (201), sem `requires_subscription` — mas isso não importa aqui: a
 * jornada documentada (`docs/negocio/jornada-usuario.mmd`) vai de Signup
 * direto pra `ChoosePlan`/`Payment`, e TODO cadastro novo, por definição,
 * ainda não escolheu plano nenhum — não precisa checar campo nenhum do
 * backend pra saber disso, é sempre verdade. `RegisterUserAction`
 * (backend) já chama `Auth::login()` — sessão (cookie Sanctum) já existe
 * quando a resposta volta, mesmo padrão do login.
 *
 * Manda pra `verify-email`, não direto pra `choose-plan`: cadastro normal
 * sempre nasce com `email_verified_at: null` (diferente de SSO, que já
 * vem verificado via `createVerified()`), e `SubscribeToPlanAction`
 * (backend) recusa assinatura de e-mail não verificado
 * (`EmailNotVerifiedException`). `VerifyEmailView.vue` é quem manda pro
 * `choose-plan` depois de confirmado.
 */
export function useRegisterForm() {
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createRegisterFormSchema(t)

  const values = reactive<RegisterFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof RegisterFormValues, string>>>({})
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
      const user = await register({
        email: values.email,
        name: values.name,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      })

      authStore.setUser(toAuthUser(user), { requiresSubscription: true })
      toast.success(t('identity.register.success'))
      await router.push({ name: 'verify-email' })
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          const key = field === 'password_confirmation' ? 'passwordConfirmation' : field
          errors.value[key as keyof RegisterFormValues] = messages[0]
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, submit, values }
}
