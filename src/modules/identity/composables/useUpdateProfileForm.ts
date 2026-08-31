import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  createUpdateProfileFormSchema,
  type UpdateProfileFormValues,
} from '../schemas/updateProfileFormSchema'
import { updateProfile } from '../services/identityApi'
import { toAuthUser } from '../types/user.type'

/**
 * Formulário sempre vem pré-preenchido com `authStore.user` (nome/e-mail
 * atuais) — senha fica sempre em branco, nunca mostramos/adivinhamos a
 * senha atual. Payload só manda `password`/`password_confirmation`
 * quando o usuário realmente digitou algo (mesma régua de "sometimes" do
 * `UpdateUserProfileRequest`, backend) — mandar string vazia falharia a
 * validação de tamanho mínimo lá.
 */
export function useUpdateProfileForm() {
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createUpdateProfileFormSchema(t)

  const values = reactive<UpdateProfileFormValues>({
    email: authStore.user?.email ?? '',
    name: authStore.user?.name ?? '',
    password: '',
    passwordConfirmation: '',
  })
  const errors = ref<Partial<Record<keyof UpdateProfileFormValues, string>>>({})
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
      const user = await updateProfile({
        email: values.email,
        name: values.name,
        ...(values.password
          ? { password: values.password, password_confirmation: values.passwordConfirmation }
          : {}),
      })

      // `email_verified_at` pode voltar a `null` aqui (troca de e-mail,
      // `UpdateUserProfileAction` reseta e reenvia verificação) — o guard
      // (`core/router/guards.ts`) já manda pro `verify-email` sozinho na
      // próxima navegação, nada especial a fazer aqui além de atualizar a
      // store. `requiresSubscription` é preservado (não vem nesta
      // resposta, só em `/auth/me`/login).
      authStore.setUser(toAuthUser(user), { requiresSubscription: authStore.requiresSubscription })
      values.password = ''
      values.passwordConfirmation = ''
      toast.success(t('identity.account.updateSuccess'))
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          const key = field === 'password_confirmation' ? 'passwordConfirmation' : field
          errors.value[key as keyof UpdateProfileFormValues] = messages[0]
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, submit, values }
}
