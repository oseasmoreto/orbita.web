<script setup lang="ts">
/**
 * Só criação — não existe "editar nome/e-mail/senha de outro usuário
 * pelo admin" (`UpdateUserByAdminRequest` só tem `role`/`status`,
 * `useUpdateUserRoleForm.ts`/`EditUserRoleModal.vue` cobrem isso à
 * parte). Renderizado dentro do `Drawer.vue` por `AdminUsersView.vue`,
 * mesmo padrão visual dos outros forms de CRUD, só sem a distinção
 * create/edit (`CrudFormActions` sempre com o rótulo de "Adicionar").
 */
import { useI18n } from 'vue-i18n'
import { useCreateAdminUserForm } from '../composables/useCreateAdminUserForm'
import type { CreateAdminUserFormValues } from '../schemas/createAdminUserFormSchema'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'
import type { AdminUser } from '@/core/types/adminUser.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const emit = defineEmits<{
  cancel: []
  saved: [user: AdminUser]
}>()

const { t } = useI18n()
const { errors, isSubmitting, reset, submit, values } = useCreateAdminUserForm()

reset()

// Mesmas opções/chaves de `EditUserRoleModal.vue` — `role` chegou pro
// contrato de criação em 2026-09-01 (backend agora aceita, opcional,
// default `user` quando omitido).
const roleOptions: SelectOption[] = [
  { label: t('identity.admin.users.roles.user'), value: 'user' },
  { label: t('identity.admin.users.roles.admin_master'), value: 'admin_master' },
]

function fieldError(key: keyof CreateAdminUserFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const created = await submit()

  if (created) {
    emit('saved', created)
  }
}
</script>

<template>
  <form class="create-admin-user-form" @submit.prevent="handleSubmit">
    <div class="create-admin-user-form__fields">
      <FormGroup :error="fieldError('name')" :label="$t('identity.admin.users.form.fields.name')">
        <Input v-model="values.name" autocomplete="off" :invalid="Boolean(fieldError('name'))" />
      </FormGroup>

      <FormGroup :error="fieldError('email')" :label="$t('identity.admin.users.form.fields.email')">
        <Input
          v-model="values.email"
          autocomplete="off"
          :invalid="Boolean(fieldError('email'))"
          type="email"
        />
      </FormGroup>

      <FormGroup
        :error="fieldError('password')"
        :label="$t('identity.admin.users.form.fields.password')"
      >
        <Input
          v-model="values.password"
          autocomplete="new-password"
          :invalid="Boolean(fieldError('password'))"
          type="password"
        />
      </FormGroup>

      <FormGroup
        :error="fieldError('passwordConfirmation')"
        :label="$t('identity.admin.users.form.fields.passwordConfirmation')"
      >
        <Input
          v-model="values.passwordConfirmation"
          autocomplete="new-password"
          :invalid="Boolean(fieldError('passwordConfirmation'))"
          type="password"
        />
      </FormGroup>

      <FormGroup
        :error="fieldError('role')"
        :label="$t('identity.admin.users.form.fields.role')"
      >
        <Select
          :model-value="values.role"
          :options="roleOptions"
          @update:model-value="(value) => (values.role = value as CreateAdminUserFormValues['role'])"
        />
      </FormGroup>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="$t('common.actions.add')"
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.create-admin-user-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  margin-bottom: $spacing-24;
}
</style>
