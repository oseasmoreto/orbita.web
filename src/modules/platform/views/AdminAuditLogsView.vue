<script setup lang="ts">
/**
 * "Auditoria" — admin, read-only (`AdminAuditLogController` só tem
 * `index`/`show`). Mesma forma de `TransactionsView.vue`
 * (`useResourceList`/`DataTable`/`PaginationNav`, sem `ListToolbar`/
 * `useCrudDrawer`/`ConfirmDialog` — não há criar/editar/excluir log de
 * auditoria).
 *
 * Filtros por `module`/`action` (exatos, `filter[module]`/`filter[action]`
 * reais da API) — sem filtro por `user_id`/`impersonated_by` ainda,
 * exigiria um seletor de usuário que depende da tela de admin de
 * usuários (Fase 6 — construída, mas ainda sem um `Select` de busca por
 * usuário, revisitável sob demanda).
 *
 * **`user`/`impersonator` embutidos, 2026-09-01** — achado real
 * corrigido no mesmo dia: até então `userId`/`impersonatedBy` só vinham
 * como UUID cru (`AdminAuditLogResource` não embutia nome/e-mail), então
 * a coluna mostrava o UUID mesmo, sem cruzar com `admin-users` (mesma
 * régua de "não inventar dado que a API não dá"). Pedido pro backend,
 * resolvido no mesmo dia — `AuditLog.user`/`.impersonator` (`AdminUser`
 * completo, mesmo shape de `GET /admin/users`) substituem a exibição de
 * UUID cru. Coluna "Impersonado por" (existia no catálogo `pt-BR.ts`
 * desde a criação desta tela, mas nunca tinha entrado no array
 * `columns` — gap adicional fechado junto).
 *
 * **Filtros migrados pro `ListToolbar`, 2026-09-01, pedido direto do
 * usuário** ("falta de padrão nos forms, só produto tem a filterbar") —
 * os mesmos 2 `Input` de texto livre (`module`/`action`) + botão
 * "Filtrar" agora vivem dentro da mesma barra visual dos outros CRUDs
 * (slot `#filters`), sem mudar o comportamento (continua exigindo o
 * clique — texto livre não aplica a cada tecla, diferente dos filtros
 * enum/`Select` dos outros CRUDs). `addable`/`searchable`/`filterable`/
 * `sortable` todos desligados: sem criar/editar/excluir log de
 * auditoria, sem campo de busca real além dos 2 já oferecidos.
 */
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { parseApiError } from '@/shared/services/parseApiError'
import { useAuditLogList } from '../composables/useAuditLogList'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const list = useAuditLogList()
onMounted(list.refresh)

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'action', title: t('platform.admin.auditLogs.columns.action') },
  { key: 'module', title: t('platform.admin.auditLogs.columns.module') },
  { key: 'description', title: t('platform.admin.auditLogs.columns.description') },
  { key: 'user', title: t('platform.admin.auditLogs.columns.userId') },
  { key: 'impersonator', title: t('platform.admin.auditLogs.columns.impersonatedBy') },
  { key: 'ipAddress', title: t('platform.admin.auditLogs.columns.ipAddress') },
  { key: 'createdAt', sortable: true, title: t('platform.admin.auditLogs.columns.createdAt') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}
</script>

<template>
  <div class="admin-audit-logs-view">
    <h1 class="admin-audit-logs-view__title">{{ $t('platform.admin.auditLogs.title') }}</h1>

    <ListToolbar :addable="false" :filterable="false" :searchable="false" :sortable="false">
      <template #filters>
        <Input
          v-model="list.module.value"
          :label="$t('platform.admin.auditLogs.filters.module')"
          :placeholder="$t('platform.admin.auditLogs.filters.modulePlaceholder')"
          @keyup.enter="list.applyFilters()"
        />
        <Input
          v-model="list.action.value"
          :label="$t('platform.admin.auditLogs.filters.action')"
          :placeholder="$t('platform.admin.auditLogs.filters.actionPlaceholder')"
          @keyup.enter="list.applyFilters()"
        />
        <Button variant="outline" @click="list.applyFilters()">
          {{ $t('common.actions.filter') }}
        </Button>
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-audit-logs-view__error" role="alert">
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
      <template #cell-impersonator="{ row }">
        {{ row.impersonator?.name ?? '—' }}
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #empty>
        {{ $t('platform.admin.auditLogs.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-audit-logs-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-audit-logs-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// Os 2 `Input` com `label` (variante "boxed", mais alto) ficam
// desalinhados com o botão "Filtrar" no `align-items: center` padrão do
// `ListToolbar` — override pontual pra alinhar todos pela base, mesmo
// visual que a barra de filtro tinha antes da migração.
.admin-audit-logs-view :deep(.ui-toolbar__filters) {
  align-items: flex-end;
}

.admin-audit-logs-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
