<script setup lang="ts">
/**
 * CRUD de `SETTINGS` — configuração interna em chave-valor, exclusiva do
 * admin (Fase 6). Mesma forma exata de `AdminPlansView.vue`.
 *
 * **`ListToolbar` com filtro de `type`, 2026-09-01, pedido direto do
 * usuário** ("falta de padrão nos forms, só produto tem a filterbar") —
 * `Select` no slot `#filters`, mesmo raciocínio de
 * `AdminMarketplacesView.vue`. `listSettings` já aceitava o param, só
 * nunca tinha UI conectada.
 */
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import AdminSettingForm from '../components/AdminSettingForm.vue'
import { useAdminSettingList } from '../composables/useAdminSettingList'
import { deleteSetting } from '../services/platformApi'
import type { Setting } from '../types/setting.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminSettingList()
onMounted(list.refresh)

const typeFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('platform.admin.settings.types.int'), value: 'int' },
  { label: t('platform.admin.settings.types.string'), value: 'string' },
  { label: t('platform.admin.settings.types.enum'), value: 'enum' },
  { label: t('platform.admin.settings.types.text'), value: 'text' },
  { label: t('platform.admin.settings.types.json'), value: 'json' },
  { label: t('platform.admin.settings.types.bool'), value: 'bool' },
  { label: t('platform.admin.settings.types.float'), value: 'float' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const drawer = useCrudDrawer<Setting>()
const deleteConfirmation = useConfirmAction<Setting>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'hash', title: t('platform.admin.settings.columns.hash') },
  { key: 'name', sortable: true, title: t('platform.admin.settings.columns.name') },
  { key: 'value', title: t('platform.admin.settings.columns.value') },
  { key: 'type', title: t('platform.admin.settings.columns.type') },
  { key: 'createdAt', sortable: true, title: t('platform.admin.settings.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteSetting(target.hash)
    toast.success(t('platform.admin.settings.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  drawer.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-settings-view">
    <h1 class="admin-settings-view__title">{{ $t('platform.admin.settings.title') }}</h1>

    <ListToolbar
      :add-label="$t('platform.admin.settings.createButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="drawer.openCreate()"
    >
      <template #filters>
        <Select
          :label="$t('platform.admin.settings.filters.type')"
          :model-value="list.typeFilter.value"
          :options="typeFilterOptions"
          @update:model-value="(value) => list.setTypeFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-settings-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="hash"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-type="{ row }">
        {{ $t(`platform.admin.settings.types.${row.type}`) }}
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <Button
          :aria-label="$t('common.actions.edit')"
          :icon-before="PencilSimpleLine"
          variant="ghost"
          @click="drawer.openEdit(row)"
        />
        <Button
          :aria-label="$t('common.actions.delete')"
          :icon-before="Trash"
          variant="ghost"
          @click="deleteConfirmation.request(row)"
        />
      </template>
      <template #empty>
        {{ $t('platform.admin.settings.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Drawer
      v-model="drawer.isOpen.value"
      size="md"
      :title="
        drawer.mode.value === 'create'
          ? $t('platform.admin.settings.form.createTitle')
          : $t('platform.admin.settings.form.editTitle')
      "
    >
      <AdminSettingForm
        :mode="drawer.mode.value"
        :setting="drawer.editingRecord.value"
        @cancel="drawer.close()"
        @saved="handleSaved"
      />
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('platform.admin.settings.deleteConfirm.description')"
      :title="$t('platform.admin.settings.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">

.admin-settings-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-settings-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-settings-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
