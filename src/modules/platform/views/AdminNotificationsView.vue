<script setup lang="ts">
/**
 * "Notificações" (admin) — gerenciamento/broadcast
 * (`AdminNotificationController`), diferente do sino do `AppHeader`
 * (caixa de entrada do PRÓPRIO usuário). Mesma forma de
 * `AdminMarketplacesView.vue`: `useResourceList`/`useConfirmAction` pro
 * CRUD (aqui só leitura + exclusão, sem editar conteúdo já enviado) +
 * `Modal` (não `Drawer`) pro broadcast — é uma ação "fire-and-forget",
 * não um recurso que se edita depois (`useBroadcastNotificationForm.ts`).
 *
 * **"Enviar pra 1 usuário" implementado na Fase 9 (fechamento de gaps
 * do OpenAPI, 2026-09-01)** — `POST /admin/notifications`
 * (`SendNotificationToUserRequest`) já tinha service function desde a
 * Fase 5 (`sendNotificationToUser`), nunca chamada: exigia um seletor de
 * usuário, que só fazia sentido depois de `AdminUsersView.vue` (Fase 6)
 * existir. **Vive aqui, não em `AdminUsersView.vue`** — mesmo a ação
 * "nascer" olhando pra um usuário específico, `identity` nunca pode
 * importar de `platform` nem vice-versa (regra de fronteira de módulo,
 * seção 2 de `docs/infra/convencoes-frontend-infra.md`); o seletor de
 * usuário (`useAdminUserOptions`, `core/composables/`) resolve isso sem
 * cruzar módulo — botão "Notificar usuário" abre um 2º `Modal` com
 * `Select` de usuário + `title`/`message` opcionais.
 *
 * `title`/`message` da listagem passam por `useApiMessage().resolveMessage()`
 * (chave catalogada ou texto livre, mesma disciplina de sempre) — nunca
 * `$t()` direto num valor vindo da API.
 *
 * **`ListToolbar` com filtros de `type`/`status`, 2026-09-01, pedido
 * direto do usuário** ("falta de padrão nos forms, só produto tem a
 * filterbar") — 2 `Select`s no slot `#filters`, mesmo raciocínio de
 * `AdminMarketplacesView.vue`. O botão de "add" do `ListToolbar` sempre
 * usa o ícone `Plus` fixo (sem prop pra customizar — um `addIcon` só pra
 * este único consumidor seria abstração antecipada); "Transmitir" perde
 * o ícone `Broadcast` específico em troca da mesma barra visual dos
 * outros CRUDs, semanticamente ainda é "criar uma `NOTIFICATION` nova".
 */
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Textarea from '@/shared/components/ui/Textarea.vue'
import { Trash } from '@/shared/components/icons/regular.generated'
import { useAdminUserOptions } from '@/core/composables/useAdminUserOptions'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { useAdminNotificationList } from '../composables/useAdminNotificationList'
import { useBroadcastNotificationForm } from '../composables/useBroadcastNotificationForm'
import { useSendNotificationToUserForm } from '../composables/useSendNotificationToUserForm'
import { deleteAdminNotification } from '../services/platformApi'
import { notificationStatusColor } from '../types/adminNotification.type'
import type { AdminNotification } from '../types/adminNotification.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminNotificationList()
onMounted(list.refresh)

const typeFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  {
    label: t('platform.admin.notifications.types.subscription_activated'),
    value: 'subscription_activated',
  },
  {
    label: t('platform.admin.notifications.types.impersonation_started'),
    value: 'impersonation_started',
  },
  {
    label: t('platform.admin.notifications.types.admin_announcement'),
    value: 'admin_announcement',
  },
])

const statusFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('platform.admin.notifications.status.pending'), value: 'pending' },
  { label: t('platform.admin.notifications.status.sending'), value: 'sending' },
  { label: t('platform.admin.notifications.status.sent'), value: 'sent' },
  { label: t('platform.admin.notifications.status.cancelled'), value: 'cancelled' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'title', title: t('platform.admin.notifications.columns.title') },
  { key: 'type', title: t('platform.admin.notifications.columns.type') },
  { key: 'status', title: t('platform.admin.notifications.columns.status') },
  { key: 'createdAt', sortable: true, title: t('platform.admin.notifications.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}

const isBroadcastModalOpen = ref(false)
const broadcastForm = useBroadcastNotificationForm()

function openBroadcastModal(): void {
  broadcastForm.reset()
  isBroadcastModalOpen.value = true
}

async function handleBroadcastSubmit(): Promise<void> {
  const succeeded = await broadcastForm.submit()

  if (succeeded) {
    isBroadcastModalOpen.value = false
    await list.refresh()
  }
}

const userOptions = useAdminUserOptions()
const isSendToUserModalOpen = ref(false)
const sendToUserForm = useSendNotificationToUserForm()

function openSendToUserModal(): void {
  sendToUserForm.reset()
  isSendToUserModalOpen.value = true
  void userOptions.load()
}

async function handleSendToUserSubmit(): Promise<void> {
  const succeeded = await sendToUserForm.submit()

  if (succeeded) {
    isSendToUserModalOpen.value = false
    await list.refresh()
  }
}

const deleteConfirmation = useConfirmAction<AdminNotification>()

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminNotification(target.id)
    toast.success(t('platform.admin.notifications.deleteSuccess'))
    await list.refresh()
  })
}
</script>

<template>
  <div class="admin-notifications-view">
    <div class="admin-notifications-view__header">
      <h1 class="admin-notifications-view__title">
        {{ $t('platform.admin.notifications.title') }}
      </h1>
      <Button variant="outline" @click="openSendToUserModal">
        {{ $t('platform.admin.notifications.sendToUserButton') }}
      </Button>
    </div>

    <ListToolbar
      :add-label="$t('platform.admin.notifications.broadcastButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="openBroadcastModal"
    >
      <template #filters>
        <Select
          :label="$t('platform.admin.notifications.filters.type')"
          :model-value="list.typeFilter.value"
          :options="typeFilterOptions"
          @update:model-value="(value) => list.setTypeFilter(value)"
        />
        <Select
          :label="$t('platform.admin.notifications.filters.status')"
          :model-value="list.statusFilter.value"
          :options="statusFilterOptions"
          @update:model-value="(value) => list.setStatusFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-notifications-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-title="{ row }">
        {{ resolveMessage(row.title) }}
      </template>
      <template #cell-type="{ row }">
        {{ $t(`platform.admin.notifications.types.${row.type}`) }}
      </template>
      <template #cell-status="{ row }">
        <StatusDot :color="notificationStatusColor(row.status)">
          {{ $t(`platform.admin.notifications.status.${row.status}`) }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <Button
          :icon-before="Trash"
          variant="ghost"
          @click="deleteConfirmation.request(row)"
        />
      </template>
      <template #empty>
        {{ $t('platform.admin.notifications.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Modal v-model="isBroadcastModalOpen" :title="$t('platform.admin.notifications.broadcastModal.title')">
      <p class="admin-notifications-view__broadcast-description">
        {{ $t('platform.admin.notifications.broadcastModal.description') }}
      </p>

      <FormGroup :label="$t('platform.admin.notifications.broadcastModal.fields.title')">
        <Input
          v-model="broadcastForm.values.title"
          maxlength="255"
          :placeholder="$t('platform.admin.notifications.broadcastModal.placeholders.title')"
        />
      </FormGroup>

      <FormGroup :label="$t('platform.admin.notifications.broadcastModal.fields.message')">
        <Textarea
          v-model="broadcastForm.values.message"
          :placeholder="$t('platform.admin.notifications.broadcastModal.placeholders.message')"
        />
      </FormGroup>

      <template #footer>
        <Button variant="outline" @click="isBroadcastModalOpen = false">
          {{ $t('common.actions.cancel') }}
        </Button>
        <Button :disabled="broadcastForm.isSubmitting.value" variant="primary" @click="handleBroadcastSubmit">
          {{ $t('platform.admin.notifications.broadcastModal.submit') }}
        </Button>
      </template>
    </Modal>

    <Modal
      v-model="isSendToUserModalOpen"
      :title="$t('platform.admin.notifications.sendToUserModal.title')"
    >
      <FormGroup :label="$t('platform.admin.notifications.sendToUserModal.fields.user')">
        <Select
          v-model="sendToUserForm.values.userId"
          :options="userOptions.options.value"
          :placeholder="$t('platform.admin.notifications.sendToUserModal.placeholders.user')"
        />
      </FormGroup>

      <FormGroup :label="$t('platform.admin.notifications.sendToUserModal.fields.title')">
        <Input
          v-model="sendToUserForm.values.title"
          maxlength="255"
          :placeholder="$t('platform.admin.notifications.broadcastModal.placeholders.title')"
        />
      </FormGroup>

      <FormGroup :label="$t('platform.admin.notifications.sendToUserModal.fields.message')">
        <Textarea
          v-model="sendToUserForm.values.message"
          :placeholder="$t('platform.admin.notifications.broadcastModal.placeholders.message')"
        />
      </FormGroup>

      <template #footer>
        <Button variant="outline" @click="isSendToUserModalOpen = false">
          {{ $t('common.actions.cancel') }}
        </Button>
        <Button
          :disabled="sendToUserForm.isSubmitting.value || !sendToUserForm.values.userId"
          variant="primary"
          @click="handleSendToUserSubmit"
        >
          {{ $t('platform.admin.notifications.sendToUserModal.submit') }}
        </Button>
      </template>
    </Modal>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('platform.admin.notifications.deleteConfirm.description')"
      :title="$t('platform.admin.notifications.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-notifications-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-notifications-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
}

.admin-notifications-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-notifications-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.admin-notifications-view__broadcast-description {
  margin-bottom: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
