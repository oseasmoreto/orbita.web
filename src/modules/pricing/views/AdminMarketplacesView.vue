<script setup lang="ts">
/**
 * CRUD de `MARKETPLACE` — exclusivo do admin
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 3), primeira
 * tela admin do projeto. Mesma forma exata de `ProductsView.vue`
 * (Catalog) — `.ai/rules/crud-pattern.md`: `useResourceList`/
 * `useCrudDrawer`/`useConfirmAction` pro CRUD principal, `TabBar` dentro
 * do Drawer de edição pra "Regras de comissão" (só existe em modo
 * `edit` — marketplace precisa existir pra ter regra), mesmo padrão de
 * "Lançamentos" em `ProductsView.vue`.
 *
 * **`ListToolbar` com filtro de `active`, 2026-09-01, pedido direto do
 * usuário** ("falta de padrão nos forms, só produto tem a filterbar") —
 * a API admin continua sem filtro de TEXTO por nome, mas `filter[active]`
 * (boolean) agora tem UI de verdade: `Select` no slot `#filters` do
 * `ListToolbar` (`searchable`/`filterable`/`sortable` desligados — sem
 * campo de busca real, ordenação já existe via cabeçalho da `DataTable`,
 * mesmo raciocínio de `ProductsView.vue`).
 */
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { TabsContent } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import TabBar from '@/shared/components/ui/TabBar.vue'
import AdminMarketplaceForm from '../components/AdminMarketplaceForm.vue'
import MarketplaceLogo from '../components/MarketplaceLogo.vue'
import IconText from '@/shared/components/ui/IconText.vue'
import AdminCategoryMarketplaceList from '../components/blocks/AdminCategoryMarketplaceList.vue'
import AdminPricingRuleList from '../components/blocks/AdminPricingRuleList.vue'
import { deleteAdminMarketplace } from '../services/pricingApi'
import { useAdminMarketplaceList } from '../composables/useAdminMarketplaceList'
import type { AdminMarketplace } from '../types/marketplace.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminMarketplaceList()
onMounted(list.refresh)

const activeFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('common.status.active'), value: 'true' },
  { label: t('common.status.inactive'), value: 'false' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const drawer = useCrudDrawer<AdminMarketplace>()
const deleteConfirmation = useConfirmAction<AdminMarketplace>()

/**
 * "Regras de comissão" é sempre uma aba dentro do detalhe de UM
 * marketplace, mesmo padrão de "Lançamentos" em `ProductsView.vue` —
 * reseta pra "Dados" toda vez que um edit novo é aberto (`drawer.close()`
 * não reseta `mode`/`editingRecord` de propósito, evita flicker na
 * animação de saída).
 */
const activeMarketplaceTab = ref('details')
const marketplaceDrawerTabs = computed<TabBarOption[]>(() => [
  { key: 'details', label: t('pricing.admin.marketplaces.form.tabs.details') },
  { key: 'pricingRules', label: t('pricing.admin.marketplaces.form.tabs.pricingRules') },
  { key: 'categories', label: t('pricing.admin.marketplaces.form.tabs.categories') },
])

function openEdit(marketplace: AdminMarketplace): void {
  activeMarketplaceTab.value = 'details'
  drawer.openEdit(marketplace)
}

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', sortable: true, title: t('pricing.admin.marketplaces.columns.name') },
  { key: 'active', title: t('pricing.admin.marketplaces.columns.active') },
  { key: 'createdAt', sortable: true, title: t('pricing.admin.marketplaces.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminMarketplace(target.id)
    toast.success(t('pricing.admin.marketplaces.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  drawer.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-marketplaces-view">
    <h1 class="admin-marketplaces-view__title">{{ $t('pricing.admin.marketplaces.title') }}</h1>

    <ListToolbar
      :add-label="$t('pricing.admin.marketplaces.createButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="drawer.openCreate()"
    >
      <template #filters>
        <Select
          :label="$t('pricing.admin.marketplaces.filters.active')"
          :model-value="list.activeFilter.value"
          :options="activeFilterOptions"
          @update:model-value="(value) => list.setActiveFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-marketplaces-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-name="{ row }">
        <IconText :text="row.name">
          <MarketplaceLogo :logo-url="row.logoUrl" :name="row.name" :size="24" />
        </IconText>
      </template>
      <template #cell-active="{ row }">
        <StatusDot :color="row.active ? 'green' : 'gray'">
          {{
            row.active
              ? $t('pricing.admin.marketplaces.status.active')
              : $t('pricing.admin.marketplaces.status.inactive')
          }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="admin-marketplaces-view__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Trash" variant="ghost" @click="deleteConfirmation.request(row)">
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('pricing.admin.marketplaces.empty') }}
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
          ? $t('pricing.admin.marketplaces.form.createTitle')
          : $t('pricing.admin.marketplaces.form.editTitle')
      "
    >
      <template v-if="drawer.mode.value === 'edit' && drawer.editingRecord.value">
        <TabBar v-model="activeMarketplaceTab" :tabs="marketplaceDrawerTabs">
          <TabsContent value="details">
            <AdminMarketplaceForm
              :marketplace="drawer.editingRecord.value"
              :mode="drawer.mode.value"
              @cancel="drawer.close()"
              @saved="handleSaved"
            />
          </TabsContent>
          <TabsContent value="pricingRules">
            <AdminPricingRuleList :marketplace-id="drawer.editingRecord.value.id" />
          </TabsContent>
          <TabsContent value="categories">
            <AdminCategoryMarketplaceList :marketplace-id="drawer.editingRecord.value.id" />
          </TabsContent>
        </TabBar>
      </template>
      <AdminMarketplaceForm
        v-else
        :marketplace="drawer.editingRecord.value"
        :mode="drawer.mode.value"
        @cancel="drawer.close()"
        @saved="handleSaved"
      />
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('pricing.admin.marketplaces.deleteConfirm.description')"
      :title="$t('pricing.admin.marketplaces.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-marketplaces-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-marketplaces-view :deep(.ui-tab-bar) {
  margin-bottom: $spacing-16;
}

.admin-marketplaces-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-marketplaces-view__row-actions {
  display: flex;
  gap: $spacing-4;
}

.admin-marketplaces-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
