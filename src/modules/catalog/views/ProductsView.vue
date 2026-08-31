<script setup lang="ts">
/**
 * Primeiro CRUD real do Orbita (pedido direto do usuário, 2026-08-28,
 * grounded numa captura de referência de uma tela "Order List" —
 * estrutura adaptada, não copiada: sem coluna de usuário/endereço, que
 * não existem no domínio de `PRODUCT`). Consome `GET/POST/PATCH/DELETE
 * /products`, endpoint real já implementado no backend
 * (`core/api/schema.d.ts` tem `ProductResource` gerado de verdade — não
 * é dado placeholder como o dashboard, `HomeView.vue`).
 *
 * **Padrão pra reutilizar em qualquer CRUD futuro** (pedido explícito):
 * `useResourceList`/`useCrudDrawer`/`useConfirmAction`
 * (`shared/composables/`) fazem TODO o estado genérico — este arquivo só
 * pluga `catalogApi`/`ProductForm` neles. Um CRUD novo (ex.: Marketplaces
 * conectados, Fase 4) repete exatamente esta forma, trocando só o
 * service/tipo/colunas/form.
 *
 * Colunas espelham só campos reais de `ProductResource` — sem
 * "Marketplace" (isso é `PRODUCT_MARKETPLACE`, fora do CRUD de produto)
 * nem badge de "dentro/fora da margem" (precisaria do preço sugerido,
 * gap de backend já registrado — `PricingCalculator` nunca exposto em
 * rota). `targetMargin` aparece como o valor configurado, não um status
 * calculado.
 *
 * **Drawer sincronizado com a URL, 2026-08-31** — pedido direto do
 * usuário ("acessar direto e abrir os modais"): `/products/new`/
 * `/products/:id/edit` (`routes.ts`) apontam pro MESMO componente, a
 * tabela continua renderizada por trás; o `watch` de `route.name`/
 * `route.params.id` abaixo é quem decide abrir o Drawer (nunca uma
 * página cheia nova — continua valendo a decisão original de
 * "renderizarão no modal lateral direito"). Fluxo:
 * - Clicar "Novo produto"/"Editar" navega (`router.push`) em vez de
 *   chamar `drawer.openCreate()`/`openEdit()` direto — o `watch` abaixo é
 *   quem de fato abre o Drawer, reagindo à mudança de rota. Única fonte
 *   de verdade, evita estado duplicado (rota vs. Drawer divergindo).
 * - Fechar o Drawer (Cancelar, salvar, `Esc`, clique fora, arrastar no
 *   mobile — QUALQUER caminho, o `vaul-vue` sempre atualiza
 *   `drawer.isOpen.value` via `v-model`) navega de volta pra `/products`
 *   via um segundo `watch` só em `drawer.isOpen.value` — central, não
 *   precisa lembrar de `router.push` em cada handler de fechamento.
 * - `/products/:id/edit` acessado direto (F5, link compartilhado) busca
 *   o produto via `getProduct()` quando ele ainda não está na página da
 *   listagem já carregada (`list.items.value`); se o id não existir,
 *   mostra o erro e volta pra `/products`.
 */
import { PencilSimpleLine, Storefront, Trash } from '@/shared/components/icons/regular.generated'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { TabsContent } from 'reka-ui'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import TabBar from '@/shared/components/ui/TabBar.vue'
import ProductForm from '../components/ProductForm.vue'
import ProductLaunchList from '../components/blocks/ProductLaunchList.vue'
import { deleteProduct, getProduct } from '../services/catalogApi'
import { useProductList } from '../composables/useProductList'
import { usePlanLimit } from '../composables/usePlanLimit'
import type { Product } from '../types/product.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useProductList()
void list.refresh()

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const drawer = useCrudDrawer<Product>()
const deleteConfirmation = useConfirmAction<Product>()

/**
 * Checagem proativa de `PLAN.max_products` (`usePlanLimit.ts`) — só
 * desabilita o botão "Novo produto" e mostra um aviso, nunca bloqueia a
 * ROTA `/products/new` em si (quem acessar direto por URL ainda vê o
 * form; `CreateProductAction`, backend, continua a trava real no
 * submit). `list.total` já é a contagem real vinda da paginação
 * (`useResourceList`), não uma segunda busca.
 */
const planLimit = usePlanLimit(() => list.total.value)

/**
 * "Lançamentos" (`PRODUCT_LAUNCH`) é sempre uma aba dentro do detalhe de
 * UM produto (`core/layouts/config/navigation.ts` já documenta essa
 * decisão) — só faz sentido em modo `edit` (produto precisa existir pra
 * ter lançamentos). `activeProductTab` reseta pra "Dados" toda vez que
 * um edit novo é aberto — `drawer.close()` não reseta `mode`/`editingRecord`
 * de propósito (`useCrudDrawer.ts`, evita flicker na animação de saída),
 * então sem esse reset explícito reabrir o Drawer pra um produto
 * DIFERENTE poderia herdar a aba "Lançamentos" ainda ativa da edição
 * anterior.
 */
const activeProductTab = ref('details')
const productDrawerTabs = computed<TabBarOption[]>(() => [
  { key: 'details', label: t('catalog.products.form.tabs.details') },
  { key: 'launches', label: t('catalog.products.form.tabs.launches') },
])

function openEdit(product: Product): void {
  activeProductTab.value = 'details'
  drawer.openEdit(product)
}

function goToCreate(): void {
  void router.push({ name: 'products-new' })
}

function goToEdit(product: Product): void {
  void router.push({ name: 'products-edit', params: { id: product.id } })
}

/**
 * `PRODUCT_MARKETPLACE` é do Bounded Context Pricing (backend,
 * `Api/Pricing/ProductMarketplaceController`) — nunca uma aba dentro
 * deste Drawer (colidiria com a regra de fronteira de módulo, seção 2 de
 * `docs/infra/convencoes-frontend-infra.md`). Navegação por NOME de
 * rota, nunca um import de `modules/pricing/*`.
 */
function goToMarketplaces(product: Product): void {
  void router.push({ name: 'product-marketplaces', params: { id: product.id } })
}

async function openEditById(id: string): Promise<void> {
  const cached = list.items.value.find((product) => product.id === id)

  if (cached) {
    openEdit(cached)
    return
  }

  try {
    const product = await getProduct(id)
    openEdit(product)
  } catch (caughtError) {
    const apiError = parseApiError(caughtError)
    toast.error(resolveMessage(apiError.messageKey))
    await router.push({ name: 'products' })
  }
}

watch(
  () => [route.name, route.params.id] as const,
  ([name, id]) => {
    if (name === 'products-new') {
      activeProductTab.value = 'details'
      drawer.openCreate()
      return
    }

    if (name === 'products-edit' && typeof id === 'string') {
      void openEditById(id)
      return
    }

    if (drawer.isOpen.value) {
      drawer.close()
    }
  },
  { immediate: true },
)

// Fecha por QUALQUER caminho (Cancelar, salvar, Esc, clique fora, arrastar
// no mobile) — `vaul-vue` sempre atualiza `drawer.isOpen.value` via
// `v-model`, então observar só esse valor cobre os 5 casos de uma vez,
// sem precisar de `router.push` espalhado em cada handler de fechamento.
watch(
  () => drawer.isOpen.value,
  (isOpen) => {
    if (!isOpen && (route.name === 'products-new' || route.name === 'products-edit')) {
      void router.push({ name: 'products' })
    }
  },
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', sortable: true, title: t('catalog.products.columns.name') },
  { key: 'sku', title: t('catalog.products.columns.sku') },
  { key: 'fullSalePrice', sortable: true, title: t('catalog.products.columns.fullSalePrice') },
  { key: 'targetMargin', title: t('catalog.products.columns.targetMargin') },
  { key: 'createdAt', sortable: true, title: t('catalog.products.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteProduct(target.id)
    toast.success(t('catalog.products.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  drawer.close()
  void list.refresh()
}
</script>

<template>
  <div class="products-view">
    <h1 class="products-view__title">{{ $t('catalog.products.title') }}</h1>

    <!--
      `filterable`/`sortable` desligados de propósito (2026-08-28, achado
      do usuário: botão sem ação): ordenação já existe via clique no
      cabeçalho da `DataTable` (nome/preço/data — as únicas 3 colunas que
      a API real aceita `sort`, ver `useProductList.ts`), um botão de
      "Ordenar" genérico ao lado não teria nenhuma ação própria pra
      disparar. Filtro não tem nenhuma dimensão real além do SKU, que a
      busca já cobre (`filter[sku]`, a única query da API pra produto) —
      não existe um segundo filtro pra esse botão abrir.
    -->
    <ListToolbar
      v-model:search="list.searchInput.value"
      :add-disabled="planLimit.isLimitReached.value"
      :add-label="$t('catalog.products.createButton')"
      :filterable="false"
      :search-placeholder="$t('catalog.products.searchPlaceholder')"
      :sortable="false"
      @add="goToCreate()"
    />

    <p v-if="planLimit.maxProducts.value !== null" class="products-view__plan-limit">
      {{
        $t('catalog.products.planLimit.usage', {
          max: planLimit.maxProducts.value,
          total: list.total.value,
        })
      }}
    </p>
    <p v-if="planLimit.isLimitReached.value" class="products-view__plan-limit-warning" role="alert">
      {{ $t('catalog.products.planLimit.reached') }}
    </p>

    <p v-if="listErrorMessage" class="products-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-fullSalePrice="{ row }">
        {{ formatMoney(row.fullSalePrice) }}
      </template>
      <template #cell-targetMargin="{ row }">
        {{ formatPercent(row.targetMargin) }}
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="products-view__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="goToEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Storefront" variant="ghost" @click="goToMarketplaces(row)">
            {{ $t('catalog.products.marketplacesButton') }}
          </Button>
          <Button
            :icon-before="Trash"
            variant="ghost"
            @click="deleteConfirmation.request(row)"
          >
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('catalog.products.empty') }}
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
          ? $t('catalog.products.form.createTitle')
          : $t('catalog.products.form.editTitle')
      "
    >
      <template v-if="drawer.mode.value === 'edit' && drawer.editingRecord.value">
        <TabBar v-model="activeProductTab" :tabs="productDrawerTabs">
          <TabsContent value="details">
            <ProductForm
              :mode="drawer.mode.value"
              :product="drawer.editingRecord.value"
              @cancel="drawer.close()"
              @saved="handleSaved"
            />
          </TabsContent>
          <TabsContent value="launches">
            <ProductLaunchList :product-id="drawer.editingRecord.value.id" />
          </TabsContent>
        </TabBar>
      </template>
      <ProductForm
        v-else
        :mode="drawer.mode.value"
        :product="drawer.editingRecord.value"
        @cancel="drawer.close()"
        @saved="handleSaved"
      />
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('catalog.products.deleteConfirm.description')"
      :title="$t('catalog.products.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.products-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

// `TabBar.vue` não tem espaçamento próprio abaixo do trigger — o slot
// (`TabsContent`) encosta direto nele sem esse respiro.
.products-view :deep(.ui-tab-bar) {
  margin-bottom: $spacing-16;
}

.products-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.products-view__row-actions {
  display: flex;
  gap: $spacing-4;
}

// `color-mix()` (mesma técnica já usada em `StatusDot.vue`, variante
// `pill`) deriva um fundo claro a partir de `$color-accent-red` — não
// existe token de "tint vermelho" pronto na escala (só `tint-1`/`tint-2`,
// azul/roxo), e essa técnica já é convenção do projeto pra esse caso.
.products-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.products-view__plan-limit {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

// Mesma técnica de `.products-view__error` — aviso real (limite
// atingido), não erro de request, mas mesma linguagem visual de alerta.
.products-view__plan-limit-warning {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-yellow;
  background-color: color-mix(in srgb, $color-accent-yellow 12%, transparent);
  border-radius: $radius-8;
}
</style>
