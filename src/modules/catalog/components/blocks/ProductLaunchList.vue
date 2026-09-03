<script setup lang="ts">
/**
 * "Lançamentos" — pendência real da Fase 3 (`docs/planejamento/plano-implementacao.md`):
 * histórico de `PRODUCT_LAUNCH` de um produto, sempre aninhado (nunca uma
 * listagem própria — `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.3). Vive em `components/blocks/` (não solto em `components/`,
 * como `ProductForm.vue`) porque é uma COMPOSIÇÃO de verdade
 * (`DataTable`+toolbar+`Modal`+`ConfirmDialog`), não um form simples —
 * primeiro componente do módulo a justificar a subpasta (seção 3.3 de
 * `docs/infra/convencoes-frontend-infra.md`).
 *
 * Mesmo motor genérico de `ProductsView.vue`
 * (`useResourceList`/`useCrudDrawer`/`useConfirmAction`) — `useCrudDrawer`
 * é reaproveitado aqui apesar do nome sugerir `Drawer.vue`: a lógica
 * (`isOpen`/`mode`/`editingRecord`) não conhece qual componente de UI a
 * consome, só o consumidor decide (`Modal.vue`, não `Drawer.vue` — já
 * estamos dentro do Drawer de edição do produto, ver `ProductLaunchForm.vue`).
 * Sem `ListToolbar` (teria `filterable`/`sortable` desligados igual
 * `ProductsView.vue`, mas sem NENHUM filtro/busca real pra oferecer aqui
 * — a API de lançamento não tem filtro de texto nenhum) — só um botão
 * "Novo lançamento" simples.
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useToast } from '@/shared/composables/useToast'
import { formatMoney } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import dayjs from 'dayjs'
import ProductLaunchForm from '../ProductLaunchForm.vue'
import { useProductLaunchList } from '../../composables/useProductLaunchList'
import { deleteProductLaunch } from '../../services/catalogApi'
import type { ProductLaunch } from '../../types/productLaunch.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const props = defineProps<{ productId: string }>()

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useProductLaunchList(props.productId)
onMounted(list.refresh)

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const modal = useCrudDrawer<ProductLaunch>()
const deleteConfirmation = useConfirmAction<ProductLaunch>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'date', sortable: true, title: t('catalog.products.launches.columns.date') },
  {
    key: 'purchasePrice',
    sortable: true,
    title: t('catalog.products.launches.columns.purchasePrice'),
  },
  { key: 'quantity', sortable: true, title: t('catalog.products.launches.columns.quantity') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatDate(value: string): string {
  return dayjs(value).format('DD/MM/YYYY')
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteProductLaunch(props.productId, target.id)
    toast.success(t('catalog.products.launches.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  modal.close()
  void list.refresh()
}
</script>

<template>
  <div class="product-launch-list">
    <div class="product-launch-list__toolbar">
      <Button variant="primary" @click="modal.openCreate()">
        {{ $t('catalog.products.launches.createButton') }}
      </Button>
    </div>

    <p v-if="listErrorMessage" class="product-launch-list__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-date="{ row }">
        {{ formatDate(row.date) }}
      </template>
      <template #cell-purchasePrice="{ row }">
        {{ formatMoney(row.purchasePrice) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="product-launch-list__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="modal.openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Trash" variant="ghost" @click="deleteConfirmation.request(row)">
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('catalog.products.launches.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Modal
      v-model="modal.isOpen.value"
      :title="
        modal.mode.value === 'create'
          ? $t('catalog.products.launches.form.createTitle')
          : $t('catalog.products.launches.form.editTitle')
      "
    >
      <ProductLaunchForm
        :launch="modal.editingRecord.value"
        :mode="modal.mode.value"
        :product-id="productId"
        @cancel="modal.close()"
        @saved="handleSaved"
      />
    </Modal>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('catalog.products.launches.deleteConfirm.description')"
      :title="$t('catalog.products.launches.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">

.product-launch-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.product-launch-list__toolbar {
  display: flex;
  justify-content: flex-end;
}

.product-launch-list__row-actions {
  display: flex;
  gap: $spacing-4;
}

// Mesma técnica já usada em `ProductsView.vue`.
.product-launch-list__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
