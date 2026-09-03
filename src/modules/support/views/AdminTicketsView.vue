<script setup lang="ts">
/**
 * "Chamados" (admin) — todos os chamados de todos os usuários (`GET
 * /admin/tickets`, `AdminTicketController`). Mesma forma de
 * `TicketsView.vue`, sem `addable` (não existe criar chamado pelo admin
 * — quem abre é sempre o usuário) e coluna extra `user` (quem abriu, já
 * que aqui não é sempre o próprio ator, mesmo padrão de
 * `AdminSubscriptionsView.vue`).
 */
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Combobox from '@/shared/components/ui/Combobox.vue'
import DateRangePicker from '@/shared/components/ui/DateRangePicker.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { Eye } from '@/shared/components/icons/regular.generated'
import { useAdminUserOptions } from '@/core/composables/useAdminUserOptions'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { parseApiError } from '@/shared/services/parseApiError'
import AdminTicketThreadPanel from '../components/AdminTicketThreadPanel.vue'
import { useAdminTicketList } from '../composables/useAdminTicketList'
import { type AdminTicket, ticketStatusColor } from '../types/ticket.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const list = useAdminTicketList()
onMounted(list.refresh)

const userOptions = useAdminUserOptions()
onMounted(userOptions.load)

const statusFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('support.tickets.status.open'), value: 'open' },
  { label: t('support.tickets.status.resolved'), value: 'resolved' },
])

const userFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  ...userOptions.options.value,
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'user', title: t('support.admin.tickets.columns.user') },
  { key: 'subject', title: t('support.tickets.columns.subject') },
  { key: 'status', title: t('support.tickets.columns.status') },
  { key: 'createdAt', sortable: true, title: t('support.tickets.columns.createdAt') },
  { key: 'resolvedAt', sortable: true, title: t('support.tickets.columns.resolvedAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatDate(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}

const isDrawerOpen = ref(false)
const viewingTicket = ref<AdminTicket | null>(null)

function openTicket(ticket: AdminTicket): void {
  viewingTicket.value = ticket
  isDrawerOpen.value = true
}

function handleUpdated(): void {
  void list.refresh()
}
</script>

<template>
  <div class="admin-tickets-view">
    <h1 class="admin-tickets-view__title">{{ $t('support.admin.tickets.title') }}</h1>

    <ListToolbar :addable="false" :filterable="false" :searchable="false" :sortable="false">
      <template #filters>
        <Select
          :label="$t('support.admin.tickets.filters.status')"
          :model-value="list.statusFilter.value"
          :options="statusFilterOptions"
          @update:model-value="(value) => list.setStatusFilter(value)"
        />
        <Combobox
          :label="$t('support.admin.tickets.filters.user')"
          :model-value="list.userIdFilter.value"
          :options="userFilterOptions"
          @update:model-value="(value) => list.setUserIdFilter(value)"
        />
        <Combobox
          :label="$t('support.admin.tickets.filters.repliedBy')"
          :model-value="list.repliedByFilter.value"
          :options="userFilterOptions"
          @update:model-value="(value) => list.setRepliedByFilter(value)"
        />
        <DateRangePicker
          v-model:end="list.createdTo.value"
          v-model:start="list.createdFrom.value"
          :label="$t('support.tickets.filters.createdBetween')"
        />
        <DateRangePicker
          v-model:end="list.resolvedTo.value"
          v-model:start="list.resolvedFrom.value"
          :label="$t('support.tickets.filters.resolvedBetween')"
        />
        <Button variant="outline" @click="list.applyDateFilters()">
          {{ $t('common.actions.filter') }}
        </Button>
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-tickets-view__error" role="alert">
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
      <template #cell-status="{ row }">
        <StatusDot :color="ticketStatusColor(row.status)">
          {{ $t(`support.tickets.status.${row.status}`) }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
      <template #cell-resolvedAt="{ row }">
        {{ formatDate(row.resolvedAt) }}
      </template>
      <template #cell-operations="{ row }">
        <Button
          :aria-label="$t('common.actions.view')"
          :icon-before="Eye"
          variant="ghost"
          @click="openTicket(row)"
        />
      </template>
      <template #empty>
        {{ $t('support.admin.tickets.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Drawer v-model="isDrawerOpen" size="lg" :title="$t('support.tickets.thread.title')">
      <AdminTicketThreadPanel v-if="viewingTicket" :ticket="viewingTicket" @updated="handleUpdated" />
    </Drawer>
  </div>
</template>

<style scoped lang="scss">

.admin-tickets-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-tickets-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-tickets-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
