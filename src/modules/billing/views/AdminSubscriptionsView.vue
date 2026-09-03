<script setup lang="ts">
/**
 * "Assinaturas" (admin) — Fase 7 (Financeiro), "ver TODAS as assinaturas
 * de todos os usuários" (`GET /admin/subscriptions`,
 * `AdminSubscriptionController`). Mesma forma de `AdminMarketplacesView.vue`
 * (`useResourceList`/`DataTable`/`PaginationNav`+`ListToolbar`), mas
 * **sem `useCrudDrawer`**: não existe criar/excluir assinatura por aqui
 * (`AdminSubscriptionController` só tem `index`/`show`/`update`) — só
 * `Modal` (`OverrideSubscriptionModal.vue`) pra corrigir `status`/
 * `end_date` manualmente, mesma categoria de `EditUserRoleModal.vue`
 * (2 campos, ação pontual, `useOverrideSubscriptionForm.ts` bespoke).
 *
 * `user`/`plan` já vêm embutidos no resource (`AdminUserResource`/
 * `PlanResource` completos) — nunca UUID cru, mesmo padrão já resolvido
 * em `AdminAuditLogResource` no mesmo dia.
 *
 * Filtro de `status` (`ListToolbar` `#filters`, `Select`, sentinel
 * `'all'`). **Fase 9 (fechamento de gaps do OpenAPI), 2026-09-01**:
 * `user_id`/`plan_id` ganharam filtro também — `useAdminUserOptions`
 * (`core/composables/`) e `useAdminPlanOptions` (local, só este módulo
 * consome) resolvem a listagem.
 *
 * **`Combobox.vue` no lugar de `Select.vue`, pedido direto do usuário
 * em 2026-09-01** — usuário pediu explicitamente uma variante buscável
 * (com 100 usuários, digitar "joao" pra filtrar em vez de rolar a lista
 * inteira). `Combobox.vue` (novo, `shared/components/ui/`) é a mesma
 * caixa/borda/raio do `Select`, só com o trigger virando campo de texto
 * que filtra a lista embutida da Reka UI (`ComboboxRoot` com filtro
 * nativo, sensibilidade `base` — ignora acento/caixa).
 *
 * **`label` em TODO filtro desta barra, correção pedida pelo usuário
 * no mesmo dia** — a 1ª versão do `Combobox` tinha saído sem `label`
 * pra bater com a altura do `Select` de status (que também não tinha),
 * só que aí nada identificava visualmente "isso filtra por usuário"/
 * "isso filtra por plano" antes de abrir. Usuário corrigiu o raciocínio:
 * prefere `label` em TODOS os campos, sempre — nunca tirar de um pra
 * bater com o outro que não tem. `status` (que nunca teve `label`)
 * ganhou um agora, pra ficar igual aos outros 2 da mesma barra.
 */
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Combobox from '@/shared/components/ui/Combobox.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { PencilSimpleLine } from '@/shared/components/icons/regular.generated'
import { useAdminUserOptions } from '@/core/composables/useAdminUserOptions'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { parseApiError } from '@/shared/services/parseApiError'
import OverrideSubscriptionModal from '../components/OverrideSubscriptionModal.vue'
import { useAdminPlanOptions } from '../composables/useAdminPlanOptions'
import { useAdminSubscriptionList } from '../composables/useAdminSubscriptionList'
import { type AdminSubscription, subscriptionStatusColor } from '../types/subscription.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const list = useAdminSubscriptionList()
onMounted(list.refresh)

const userOptions = useAdminUserOptions()
onMounted(userOptions.load)

const planOptions = useAdminPlanOptions()
onMounted(planOptions.load)

const statusFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('billing.mySubscription.status.pending'), value: 'pending' },
  { label: t('billing.mySubscription.status.active'), value: 'active' },
  { label: t('billing.mySubscription.status.canceled'), value: 'canceled' },
  { label: t('billing.mySubscription.status.expired'), value: 'expired' },
  { label: t('billing.mySubscription.status.payment_failed'), value: 'payment_failed' },
])

const userFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  ...userOptions.options.value,
])

const planFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  ...planOptions.options.value,
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'user', title: t('billing.admin.subscriptions.columns.user') },
  { key: 'plan', title: t('billing.admin.subscriptions.columns.plan') },
  { key: 'status', title: t('billing.admin.subscriptions.columns.status') },
  { key: 'startDate', sortable: true, title: t('billing.admin.subscriptions.columns.startDate') },
  { key: 'endDate', sortable: true, title: t('billing.admin.subscriptions.columns.endDate') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatDate(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

const editingSubscription = ref<AdminSubscription | null>(null)
const isEditModalOpen = ref(false)

function openEdit(subscription: AdminSubscription): void {
  editingSubscription.value = subscription
  isEditModalOpen.value = true
}

function handleEdited(): void {
  void list.refresh()
}
</script>

<template>
  <div class="admin-subscriptions-view">
    <h1 class="admin-subscriptions-view__title">{{ $t('billing.admin.subscriptions.title') }}</h1>

    <ListToolbar :addable="false" :filterable="false" :searchable="false" :sortable="false">
      <template #filters>
        <Select
          :label="$t('billing.admin.subscriptions.filters.status')"
          :model-value="list.statusFilter.value"
          :options="statusFilterOptions"
          @update:model-value="(value) => list.setStatusFilter(value)"
        />
        <Combobox
          :label="$t('billing.admin.subscriptions.filters.user')"
          :model-value="list.userIdFilter.value"
          :options="userFilterOptions"
          @update:model-value="(value) => list.setUserIdFilter(value)"
        />
        <Combobox
          :label="$t('billing.admin.subscriptions.filters.plan')"
          :model-value="list.planIdFilter.value"
          :options="planFilterOptions"
          @update:model-value="(value) => list.setPlanIdFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-subscriptions-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-user="{ row }">
        {{ row.user.name }}
      </template>
      <template #cell-plan="{ row }">
        {{ row.plan.name }}
      </template>
      <template #cell-status="{ row }">
        <StatusDot :color="subscriptionStatusColor(row.status)">
          {{ $t(`billing.mySubscription.status.${row.status}`) }}
        </StatusDot>
      </template>
      <template #cell-startDate="{ row }">
        {{ formatDate(row.startDate) }}
      </template>
      <template #cell-endDate="{ row }">
        {{ formatDate(row.endDate) }}
      </template>
      <template #cell-operations="{ row }">
        <Button
          :aria-label="$t('billing.admin.subscriptions.editButton')"
          :icon-before="PencilSimpleLine"
          variant="ghost"
          @click="openEdit(row)"
        />
      </template>
      <template #empty>
        {{ $t('billing.admin.subscriptions.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <OverrideSubscriptionModal
      v-model="isEditModalOpen"
      :subscription="editingSubscription"
      @saved="handleEdited"
    />
  </div>
</template>

<style scoped lang="scss">

.admin-subscriptions-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-subscriptions-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-subscriptions-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
