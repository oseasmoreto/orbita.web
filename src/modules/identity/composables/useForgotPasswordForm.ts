import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ensureCsrfCookie } from '@/core/api/client'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  createForgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '../schemas/forgotPasswordFormSchema'
import { requestPasswordReset } from '../services/identityApi'

function emptyValues(): ForgotPasswordFormValues {
  return { email: '' }
}

/**
 * `isSubmitted` (não navegação) é o resultado — `ForgotPasswordView.vue`
 * troca o formulário por uma confirmação na mesma tela quando vira `true`.
 * Mensagem de sucesso deliberadamente não confirma nem nega se o e-mail
 * existe na base (mesmo padrão do `Password::sendResetLink` do Laravel,
 * evita enumeração de conta) — `identity.forgotPassword.success` é
 * neutra de propósito ("se o e-mail existir, enviamos um link").
 */
export function useForgotPasswordForm() {
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()
  const { t } = useI18n()
  const schema = createForgotPasswordFormSchema(t)

  const values = reactive<ForgotPasswordFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof ForgotPasswordFormValues, string>>>({})
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)

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
      await requestPasswordReset({ email: values.email })
      isSubmitted.value = true
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          errors.value[field as keyof ForgotPasswordFormValues] = resolveFieldError(
            field,
            messages[0],
          )
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitted, isSubmitting, submit, values }
}
