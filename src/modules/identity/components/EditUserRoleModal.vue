<script setup lang="ts">
/**
 * Só `role`/`status` (`UpdateUserByAdminRequest`) — nunca nome/e-mail/
 * senha de outro usuário (`CreateAdminUserForm.vue` cobre a criação à
 * parte). `Modal`, não `Drawer` — mesmo raciocínio de
 * `DocumentPromptModal.vue`/`ConnectMarketplaceModal.vue`: 2 campos,
 * ação pontual, não um formulário grande.
 */
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import { useUpdateUserRoleForm } from '../composables/useUpdateUserRoleForm'
import type { AdminUser } from '@/core/types/adminUser.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  user: AdminUser | null
}>()

const emit = defineEmits<{ saved: [user: AdminUser] }>()

const open = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { isSubmitting, reset, submit, values } = useUpdateUserRoleForm()

// Mesmo achado real já documentado em `ConnectMarketplaceModal.vue` —
// `immediate: true` porque `open` já pode nascer `true` no mesmo tick em
// que `user` é setado (`AdminUsersView.vue` seta os 2 juntos ao clicar
// "Editar").
watch(
  open,
  (isOpen) => {
    if (isOpen && props.user) {
      reset(props.user)
    }
  },
  { immediate: true },
)

const roleOptions: SelectOption[] = [
  { label: t('identity.admin.users.roles.user'), value: 'user' },
  { label: t('identity.admin.users.roles.admin_master'), value: 'admin_master' },
]

const statusOptions: SelectOption[] = [
  { label: t('identity.admin.users.statuses.active'), value: 'active' },
  { label: t('identity.admin.users.statuses.suspended'), value: 'suspended' },
]

async function handleSubmit(): Promise<void> {
  if (!props.user) {
    return
  }

  const updated = await submit(props.user)

  if (updated) {
    open.value = false
    emit('saved', updated)
  }
}
</script>

<template>
  <Modal v-model="open" :title="$t('identity.admin.users.editModal.title')">
    <FormGroup :label="$t('identity.admin.users.editModal.fields.role')">
      <Select
        :model-value="values.role"
        :options="roleOptions"
        @update:model-value="(value) => (values.role = value as 'admin_master' | 'user')"
      />
    </FormGroup>

    <FormGroup :label="$t('identity.admin.users.editModal.fields.status')">
      <Select
        :model-value="values.status"
        :options="statusOptions"
        @update:model-value="(value) => (values.status = value as 'active' | 'suspended')"
      />
    </FormGroup>

    <template #footer>
      <Button variant="outline" @click="open = false">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button :disabled="isSubmitting" variant="primary" @click="handleSubmit">
        {{ $t('common.actions.save') }}
      </Button>
    </template>
  </Modal>
</template>
