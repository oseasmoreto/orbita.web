import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UserRole } from '@/core/store/types/auth.type'
import type { AdminUser } from '@/core/types/adminUser.type'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { updateAdminUser } from '../services/identityApi'

export interface UpdateUserRoleFormValues {
  role: UserRole
  status: 'active' | 'suspended'
}

/**
 * Sem Zod — os 2 campos (`role`/`status`) só existem como opção de
 * `Select` controlado (`EditUserRoleModal.vue`), sempre um valor válido
 * do enum, nada pra validar client-side (diferente de
 * `useCreateAdminUserForm.ts`, que tem campo de texto livre). Bespoke,
 * mesma categoria de `useBroadcastNotificationForm.ts` — não é o par
 * create/update que `useResourceForm` modela.
 */
export function useUpdateUserRoleForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const values = reactive<UpdateUserRoleFormValues>({ role: 'user', status: 'active' })
  const isSubmitting = ref(false)

  function reset(user: AdminUser): void {
    values.role = user.role
    values.status = user.status === 'suspended' ? 'suspended' : 'active'
  }

  async function submit(user: AdminUser): Promise<AdminUser | null> {
    isSubmitting.value = true

    try {
      const updated = await updateAdminUser(user.id, {
        role: values.role,
        status: values.status,
      })
      toast.success(t('identity.admin.users.editModal.success'))
      return updated
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { isSubmitting, reset, submit, values }
}
