import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AdminUser } from '@/core/types/adminUser.type'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  type CreateAdminUserFormValues,
  createAdminUserFormSchema,
} from '../schemas/createAdminUserFormSchema'
import { createAdminUser } from '../services/identityApi'

function emptyValues(): CreateAdminUserFormValues {
  return { email: '', name: '', password: '', passwordConfirmation: '', role: 'user' }
}

/**
 * Bespoke, fora do motor genérico `useResourceForm` — `CreateUserByAdminRequest`
 * (nome/e-mail/senha) e `UpdateUserByAdminRequest` (role/status) não têm
 * NENHUM campo em comum (`identityApi.ts`), então não existe um par
 * create/update simétrico pra modelar aqui: criar usuário e editar
 * role/status são 2 ações completamente diferentes, cada uma com seu
 * próprio composable pequeno (mesma categoria de
 * `useBroadcastNotificationForm.ts` — ver a mesma decisão lá).
 */
export function useCreateAdminUserForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()

  const values = reactive<CreateAdminUserFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof CreateAdminUserFormValues, string>>>({})
  const isSubmitting = ref(false)

  function reset(): void {
    Object.assign(values, emptyValues())
    errors.value = {}
  }

  function validate(): boolean {
    const result = createAdminUserFormSchema(t).safeParse(values)

    if (result.success) {
      errors.value = {}
      return true
    }

    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    )
    return false
  }

  async function submit(): Promise<AdminUser | null> {
    if (!validate()) {
      return null
    }

    isSubmitting.value = true

    try {
      const created = await createAdminUser({
        email: values.email,
        name: values.name,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        role: values.role,
      })
      toast.success(t('identity.admin.users.form.createSuccess'))
      return created
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        const fieldErrors = errors.value as Record<string, string>

        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          fieldErrors[field] = resolveFieldError(field, messages[0])
        }
      }

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, reset, submit, values }
}
