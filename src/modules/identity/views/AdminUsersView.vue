<script setup lang="ts">
/**
 * CRUD de `USER` do lado do admin (Fase 6) — mesma forma geral de
 * `AdminMarketplacesView.vue` (`useResourceList`/`DataTable`/
 * `PaginationNav`), mas SEM `useCrudDrawer` pro caso comum de "1 form
 * cria e edita": `CreateAdminUserForm.vue` (Drawer) só cria,
 * `EditUserRoleModal.vue` só edita `role`/`status` — os 2 casos não
 * compartilham nenhum campo (`identityApi.ts`), então 2 componentes/
 * composables próprios, cada um com seu próprio estado de
 * aberto/fechado.
 *
 * Sem exclusão — `AdminUserController` não tem `destroy` (usuário nunca
 * é hard-deletado pelo admin, só o próprio dono via
 * `DeleteUserAccountAction`, autoatendimento).
 *
 * "Impersonar" (`UserSwitch`) só aparece pra `role: 'user'`, nunca pra
 * `admin_master` nem pra própria linha do admin logado
 * (`canImpersonate`, `useImpersonation.ts`, testado). "Editar" (role/
 * status) só aparece fora da própria linha (`canEditUser`, mesmo
 * arquivo) — o backend recusaria as duas coisas de qualquer forma
 * (`errorMessageCannotModifyOwnAccount`/`CannotImpersonateAdminException`),
 * checado aqui só pra não oferecer uma ação que já se sabe que vai falhar.
 *
 * **`ListToolbar` com filtros de `role`/`status`, 2026-09-01, pedido
 * direto do usuário** ("falta de padrão nos forms, só produto tem a
 * filterbar") — 2 `Select`s no slot `#filters` (`searchable`/
 * `filterable`/`sortable` desligados, mesmo raciocínio de
 * `AdminMarketplacesView.vue`). `listAdminUsers` já aceitava os 2 params
 * desde a Fase 6, só nunca tinham UI conectada.
 */
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { PencilSimpleLine, UserSwitch } from '@/shared/components/icons/regular.generated'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useAuthStore } from '@/core/store/useAuthStore'
import { parseApiError } from '@/shared/services/parseApiError'
import CreateAdminUserForm from '../components/CreateAdminUserForm.vue'
import EditUserRoleModal from '../components/EditUserRoleModal.vue'
import { useAdminUserList } from '../composables/useAdminUserList'
import { canEditUser, canImpersonate, useImpersonation } from '../composables/useImpersonation'
import { adminUserStatusColor } from '@/core/types/adminUser.type'
import type { AdminUser } from '@/core/types/adminUser.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()
const authStore = useAuthStore()
const { isProcessing: isImpersonating, startImpersonation } = useImpersonation()

const list = useAdminUserList()
onMounted(list.refresh)

const roleFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('identity.admin.users.roles.user'), value: 'user' },
  { label: t('identity.admin.users.roles.admin_master'), value: 'admin_master' },
])

const statusFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('identity.admin.users.statuses.active'), value: 'active' },
  { label: t('identity.admin.users.statuses.suspended'), value: 'suspended' },
  { label: t('identity.admin.users.statuses.deleted'), value: 'deleted' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', sortable: true, title: t('identity.admin.users.columns.name') },
  { key: 'email', sortable: true, title: t('identity.admin.users.columns.email') },
  { key: 'role', title: t('identity.admin.users.columns.role') },
  { key: 'status', title: t('identity.admin.users.columns.status') },
  { key: 'createdAt', sortable: true, title: t('identity.admin.users.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

const isCreateDrawerOpen = ref(false)

function handleCreated(): void {
  isCreateDrawerOpen.value = false
  void list.refresh()
}

const editingUser = ref<AdminUser | null>(null)
const isEditModalOpen = ref(false)

function openEdit(user: AdminUser): void {
  editingUser.value = user
  isEditModalOpen.value = true
}

function handleEdited(): void {
  void list.refresh()
}

function canEditRow(user: AdminUser): boolean {
  return Boolean(authStore.user && canEditUser(authStore.user.id, user))
}

function canImpersonateRow(user: AdminUser): boolean {
  return Boolean(authStore.user && canImpersonate(authStore.user.id, user))
}
</script>

<template>
  <div class="admin-users-view">
    <h1 class="admin-users-view__title">{{ $t('identity.admin.users.title') }}</h1>

    <ListToolbar
      :add-label="$t('identity.admin.users.createButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="isCreateDrawerOpen = true"
    >
      <template #filters>
        <Select
          :label="$t('identity.admin.users.filters.role')"
          :model-value="list.roleFilter.value"
          :options="roleFilterOptions"
          @update:model-value="(value) => list.setRoleFilter(value)"
        />
        <Select
          :label="$t('identity.admin.users.filters.status')"
          :model-value="list.statusFilter.value"
          :options="statusFilterOptions"
          @update:model-value="(value) => list.setStatusFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-users-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-role="{ row }">
        {{ $t(`identity.admin.users.roles.${row.role}`) }}
      </template>
      <template #cell-status="{ row }">
        <StatusDot :color="adminUserStatusColor(row.status)">
          {{ $t(`identity.admin.users.statuses.${row.status}`) }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <Button
          v-if="canEditRow(row)"
          :aria-label="$t('common.actions.edit')"
          :icon-before="PencilSimpleLine"
          variant="ghost"
          @click="openEdit(row)"
        />
        <Button
          v-if="canImpersonateRow(row)"
          :aria-label="$t('identity.admin.users.impersonateButton')"
          :disabled="isImpersonating"
          :icon-before="UserSwitch"
          variant="ghost"
          @click="startImpersonation(row)"
        />
      </template>
      <template #empty>
        {{ $t('identity.admin.users.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Drawer
      v-model="isCreateDrawerOpen"
      size="md"
      :title="$t('identity.admin.users.form.createTitle')"
    >
      <CreateAdminUserForm @cancel="isCreateDrawerOpen = false" @saved="handleCreated" />
    </Drawer>

    <EditUserRoleModal v-model="isEditModalOpen" :user="editingUser" @saved="handleEdited" />
  </div>
</template>

<style scoped lang="scss">

.admin-users-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-users-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-users-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
