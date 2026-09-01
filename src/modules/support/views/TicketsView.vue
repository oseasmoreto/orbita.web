<script setup lang="ts">
/**
 * "Meus chamados" — chamados do PRÓPRIO usuário (`GET /tickets`). Mesma
 * forma dos outros CRUDs (`useResourceList`/`DataTable`/`PaginationNav`+
 * `ListToolbar`), mas o "editar" de `useCrudDrawer` vira "abrir a
 * conversa" (`TicketThreadPanel.vue`, estrutura do frame "Chats" do
 * Figma "AiDEA", pedido direto do usuário em 2026-09-01) — não existe
 * editar um chamado no sentido de formulário, só responder/resolver/
 * disputar dentro da própria thread.
 */
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import DateRangePicker from '@/shared/components/ui/DateRangePicker.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { Eye } from '@/shared/components/icons/regular.generated'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { parseApiError } from '@/shared/services/parseApiError'
import CreateTicketForm from '../components/CreateTicketForm.vue'
import TicketThreadPanel from '../components/TicketThreadPanel.vue'
import { useTicketList } from '../composables/useTicketList'
import { type Ticket, ticketStatusColor } from '../types/ticket.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const list = useTicketList()
onMounted(list.refresh)

const statusFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('support.tickets.status.open'), value: 'open' },
  { label: t('support.tickets.status.resolved'), value: 'resolved' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'subject', title: t('support.tickets.columns.subject') },
  { key: 'status', title: t('support.tickets.columns.status') },
  { key: 'createdAt', sortable: true, title: t('support.tickets.columns.createdAt') },
  { key: 'resolvedAt', sortable: true, title: t('support.tickets.columns.resolvedAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatDate(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}

const drawer = useCrudDrawer<Ticket>()

function handleCreated(created: Ticket): void {
  void list.refresh()
  drawer.openEdit(created)
}

function handleUpdated(): void {
  void list.refresh()
}
</script>

<template>
  <div class="tickets-view">
    <h1 class="tickets-view__title">{{ $t('support.tickets.title') }}</h1>

    <ListToolbar
      :add-label="$t('support.tickets.createButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="drawer.openCreate()"
    >
      <template #filters>
        <Select
          :label="$t('support.tickets.filters.status')"
          :model-value="list.statusFilter.value"
          :options="statusFilterOptions"
          @update:model-value="(value) => list.setStatusFilter(value)"
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

    <p v-if="listErrorMessage" class="tickets-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
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
          @click="drawer.openEdit(row)"
        />
      </template>
      <template #empty>
        {{ $t('support.tickets.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Drawer
      v-model="drawer.isOpen.value"
      :size="drawer.mode.value === 'edit' ? 'lg' : 'md'"
      :title="
        drawer.mode.value === 'create'
          ? $t('support.tickets.form.createTitle')
          : $t('support.tickets.thread.title')
      "
    >
      <CreateTicketForm
        v-if="drawer.mode.value === 'create'"
        @cancel="drawer.close()"
        @saved="handleCreated"
      />
      <TicketThreadPanel
        v-else-if="drawer.editingRecord.value"
        :ticket="drawer.editingRecord.value"
        @updated="handleUpdated"
      />
    </Drawer>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.tickets-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.tickets-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.tickets-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
