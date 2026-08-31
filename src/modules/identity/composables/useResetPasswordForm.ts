import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ensureCsrfCookie } from '@/core/api/client'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  createResetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '../schemas/resetPasswordFormSchema'
import { resetPassword } from '../services/identityApi'

function emptyValues(): ResetPasswordFormValues {
  return { password: '', passwordConfirmation: '' }
}

/**
 * `email`/`token` não são estado do formulário — vêm da query string do
 * link recebido por e-mail (`ResetPasswordView.vue` os lê de `useRoute()`
 * e repassa pra `submit()`), nunca digitados pelo usuário. `submit()`
 * devolve `boolean` (sucesso/falha) em vez de navegar sozinho — a view
 * decide o que fazer (abrir o modal de sucesso), mesma separação de
 * responsabilidade já usada em `useProductForm.submit()`.
 */
export function useResetPasswordForm() {
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createResetPasswordFormSchema(t)

  const values = reactive<ResetPasswordFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof ResetPasswordFormValues, string>>>({})
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

  async function submit(email: string, token: string): Promise<boolean> {
    if (!validate()) {
      return false
    }

    isSubmitting.value = true

    try {
      await ensureCsrfCookie()
      await resetPassword({
        email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        token,
      })
      return true
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          errors.value[field as keyof ResetPasswordFormValues] = resolveFieldError(
            field,
            messages[0],
          )
        }
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, submit, values }
}
