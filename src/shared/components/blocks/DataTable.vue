<script setup lang="ts" generic="T extends object">
/**
 * Bloco mais rico do catálogo (seção 3.2 de
 * docs/infra/convencoes-frontend-infra.md) — grounded no `COMPONENT_SET
 * "Table Components"` do Figma (header 40px, texto de título "12 Regular"
 * em `{colors.ink-40}`, borda inferior do header em `{colors.ink-20}`,
 * divisor de linha em `{colors.ink-4}`). As variantes de célula do Figma
 * (`Type=Status/Date/Text-Icon/Users/User/Activity`...) viram o slot
 * nomeado `#cell-<key>`, não componentes fixos — quem decide o que
 * renderizar em cada célula é o consumidor (Badge de status, Avatar,
 * data formatada...), o `DataTable` só monta a grade e nunca decide regra
 * de negócio.
 *
 * `#header-<key>` (2026-09-10, pedido direto do usuário — coluna por
 * marketplace em `ProductsView.vue`, cabeçalho precisa ser o LOGO, não
 * texto) — mesmo mecanismo do `#cell-<key>`, opcional: sem esse slot o
 * cabeçalho continua sendo só `column.title` (texto), nenhum consumidor
 * existente precisa mudar.
 *
 * `column.sticky` com MAIS DE UMA coluna marcada (achado real, mesmo
 * dia — usuário marcou "Produto" E "Status" como `sticky` em
 * `ProductMarketplacePricingView.vue` e a 2ª sobrepôs a 1ª): a 1ª versão
 * cravava `left: 0` fixo em toda coluna `sticky`, então duas colunas
 * sticky ocupavam o MESMO lugar. Corrigido medindo a largura real de
 * cada `<th>` sticky via `ResizeObserver` (`stickyColumnWidths`) e
 * empilhando os offsets em ordem (`stickyLeftOffsets` — 1ª coluna sticky
 * fica em `left: 0`, a 2ª em `left: <largura da 1ª>`, e assim por
 * diante). Não é medido estaticamente (largura de coluna é conteúdo
 * dependente, `table-layout: auto`) nem hardcoded — muda sozinho se o
 * conteúdo da coluna sticky mudar de largura (nome de produto mais
 * longo/curto entre páginas, por exemplo).
 *
 * Sem paginação/filtro embutidos de propósito (gap real, não implementado
 * nesta rodada — `Pagination` é um componente próprio no Figma, ainda não
 * mapeado em nenhum tier do catálogo). Ordenação também não ordena os
 * dados sozinha — só emite `sort`, quem decide a ordenação real é o
 * composable do módulo consumidor (mesma régua de "block nunca decide
 * regra de negócio").
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ArrowDown, ArrowsDownUp, ArrowUp } from '@/shared/components/icons/regular.generated'
import Checkbox from '../ui/Checkbox.vue'
import Icon from '../ui/Icon.vue'
import type { DataTableColumn, DataTableSortDirection } from '../ui/types/dataTable.type'

// Constraint `T extends object` (não `Record<string, unknown>`) de
// propósito: uma `interface` TS comum (sem index signature explícita,
// como qualquer DTO tipado do projeto) não é estruturalmente atribuível a
// `Record<string, unknown>` — o generic ficaria inutilizável pra tipos de
// domínio reais. O acesso por chave dinâmica (`column.key`/`rowKey`, só
// conhecidos em runtime) precisa então de um cast pontual pra
// `Record<string, unknown>` em `getCellValue`, isolado num único lugar.
const props = defineProps<{
  columns: DataTableColumn[]
  rows: T[]
  rowKey?: string
  selectable?: boolean
}>()

const emit = defineEmits<{
  sort: [key: string, direction: DataTableSortDirection]
}>()

const selected = defineModel<unknown[]>('selected', { default: () => [] })

const sortState = ref<{ key: string; direction: DataTableSortDirection } | null>(null)

const rowKey = computed(() => props.rowKey ?? 'id')

function getCellValue(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

function handleSort(column: DataTableColumn): void {
  if (!column.sortable) {
    return
  }

  const isSameColumn = sortState.value?.key === column.key
  const nextDirection: DataTableSortDirection = !isSameColumn
    ? 'asc'
    : sortState.value?.direction === 'asc'
      ? 'desc'
      : null

  sortState.value = nextDirection ? { direction: nextDirection, key: column.key } : null
  emit('sort', column.key, nextDirection)
}

function rowIdOf(row: T): unknown {
  return getCellValue(row, rowKey.value)
}

function isSelected(row: T): boolean {
  return selected.value.includes(rowIdOf(row))
}

function toggleRow(row: T): void {
  const id = rowIdOf(row)
  selected.value = isSelected(row)
    ? selected.value.filter((selectedId) => selectedId !== id)
    : [...selected.value, id]
}

const allSelected = computed(
  () => props.rows.length > 0 && props.rows.every((row) => isSelected(row)),
)
const someSelected = computed(() => !allSelected.value && props.rows.some((row) => isSelected(row)))

function toggleAll(): void {
  selected.value = allSelected.value ? [] : props.rows.map(rowIdOf)
}

// Largura real (medida, não estimada) de cada `<th>` marcado `sticky` —
// só existe entrada aqui pra coluna que realmente é sticky, ver
// `setStickyHeaderRef`/`stickyLeftOffsets`.
const stickyColumnWidths = reactive<Record<string, number>>({})
const stickyHeaderElements = new Map<string, HTMLElement>()
let stickyResizeObserver: ResizeObserver | null = null

function setStickyHeaderRef(key: string, el: Element | null): void {
  const previous = stickyHeaderElements.get(key)

  if (previous) {
    stickyResizeObserver?.unobserve(previous)
    stickyHeaderElements.delete(key)
  }

  if (el instanceof HTMLElement) {
    stickyHeaderElements.set(key, el)
    stickyColumnWidths[key] = el.offsetWidth
    stickyResizeObserver?.observe(el)
  }
}

onMounted(() => {
  stickyResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const key = [...stickyHeaderElements.entries()].find(
        ([, element]) => element === entry.target,
      )?.[0]

      if (key) {
        stickyColumnWidths[key] = (entry.target as HTMLElement).offsetWidth
      }
    }
  })

  for (const element of stickyHeaderElements.values()) {
    stickyResizeObserver.observe(element)
  }
})

onBeforeUnmount(() => {
  stickyResizeObserver?.disconnect()
})

/**
 * Offset acumulado por coluna `sticky`, na mesma ordem de `columns` — a
 * 1ª coluna sticky fica em `left: 0`, cada uma seguinte soma a largura
 * medida das anteriores. Colunas sem `sticky` não entram na conta (não
 * têm `left` nenhum, continuam no fluxo normal da tabela).
 */
const stickyLeftOffsets = computed<Record<string, number>>(() => {
  const offsets: Record<string, number> = {}
  let cumulative = 0

  for (const column of props.columns) {
    if (!column.sticky) {
      continue
    }

    offsets[column.key] = cumulative
    cumulative += stickyColumnWidths[column.key] ?? 0
  }

  return offsets
})

// Reobserva quando o SET de colunas sticky muda (não só a largura de uma
// já observada, isso o ResizeObserver já cobre sozinho) — ex.: colunas
// dinâmicas por marketplace entrando/saindo em `ProductsView.vue`.
watch(
  () => props.columns.filter((column) => column.sticky).map((column) => column.key),
  () => {
    for (const key of [...stickyHeaderElements.keys()]) {
      if (!props.columns.some((column) => column.key === key && column.sticky)) {
        setStickyHeaderRef(key, null)
      }
    }
  },
)
</script>

<template>
  <!--
    `data-vaul-no-drag` — achado real, reportado pelo usuário em
    2026-09-03 (`AdminPricingRuleList.vue`, dentro do `Drawer.vue` de
    editar marketplace): arrastar o scroll horizontal da tabela também
    arrastava/fechava o Drawer. Causa: `vaul-vue` intercepta gesto de
    arrasto no MESMO eixo da direção do drawer (`direction="right"` →
    horizontal) pra decidir "arrastando pra fechar" — sem diferenciar de
    um scroll horizontal comum dentro do conteúdo. `data-vaul-no-drag` é
    o escape hatch documentado da própria lib (`node_modules/vaul-vue`,
    checado via `el.closest('[data-vaul-no-drag]')` no handler de
    pointerdown) pra excluir uma área do gesto de arrasto do drawer sem
    desativar o scroll dela. Fixado aqui (bloco compartilhado, não só na
    tela de regras de comissão) porque qualquer `DataTable` dentro de
    qualquer `Drawer.vue` teria o mesmo bug — sem efeito nenhum fora de
    um Drawer, é só um atributo que a lib lê.
  -->
  <div class="ui-data-table-wrapper" data-vaul-no-drag>
    <table class="ui-data-table">
      <thead>
        <tr>
          <th v-if="selectable" class="ui-data-table__select-cell">
            <Checkbox
              :model-value="allSelected ? true : someSelected ? 'indeterminate' : false"
              @update:model-value="toggleAll"
            />
          </th>
          <th
            v-for="column in columns"
            :ref="(el) => column.sticky && setStickyHeaderRef(column.key, el as Element | null)"
            :key="column.key"
            :class="[
              'ui-data-table__header-cell',
              {
                'ui-data-table__header-cell--sortable': column.sortable,
                'ui-data-table__header-cell--align-right': column.align === 'right',
                'ui-data-table__header-cell--sticky': column.sticky,
              },
            ]"
            :style="column.sticky ? { left: `${stickyLeftOffsets[column.key] ?? 0}px` } : undefined"
            @click="handleSort(column)"
          >
            <span class="ui-data-table__header-content">
              <slot :name="`header-${column.key}`" :column="column">
                <span>{{ column.title }}</span>
              </slot>
              <Icon
                v-if="column.sortable"
                :icon="
                  sortState?.key === column.key
                    ? sortState.direction === 'asc'
                      ? ArrowUp
                      : ArrowDown
                    : ArrowsDownUp
                "
                :size="12"
              />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(rowIdOf(row))">
          <td v-if="selectable" class="ui-data-table__select-cell">
            <Checkbox :model-value="isSelected(row)" @update:model-value="toggleRow(row)" />
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'ui-data-table__cell',
              {
                'ui-data-table__cell--align-right': column.align === 'right',
                'ui-data-table__cell--sticky': column.sticky,
              },
            ]"
            :style="column.sticky ? { left: `${stickyLeftOffsets[column.key] ?? 0}px` } : undefined"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(row, column.key)">
              {{ getCellValue(row, column.key) }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td class="ui-data-table__empty" :colspan="columns.length + (selectable ? 1 : 0)">
            <slot name="empty">Nenhum dado encontrado.</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">

.ui-data-table-wrapper {
  overflow-x: auto;
}

.ui-data-table {
  width: 100%;
  font-size: $font-size-sm;
  border-collapse: collapse;
}

// Achado real: o reset global (`svg { max-width: 100% }`,
// core/styles/_reset.scss) colapsa a largura de um `<svg>` pra 0 quando
// ele fica dentro de uma célula de `<table>` com `table-layout: auto` —
// confirmado via `getBoundingClientRect()` real (width:0 no Checkbox de
// seleção de linha, mesmo a `<td>` já tendo largura resolvida de 32px).
// É uma dependência circular de layout (a célula quer se ajustar ao
// conteúdo, o conteúdo quer ser 100% da célula), não um bug do Checkbox
// em si — o mesmo Checkbox funciona normalmente fora de tabela. Corrigido
// neutralizando o `max-width` só dentro do escopo da tabela, via `:deep()`
// (alcança o `<svg>` de qualquer componente filho, incluindo os que vêm
// de slots do consumidor — a regra é por posição no DOM real, não por
// quem declarou o template).
.ui-data-table :deep(svg) {
  max-width: none;
}

.ui-data-table__select-cell {
  width: 24px;
  padding: $spacing-8 $spacing-16;
}

.ui-data-table__header-cell {
  padding: $spacing-8 $spacing-16;
  font-weight: $font-weight-regular;
  color: $color-ink-40;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid $color-ink-20;
}

.ui-data-table__header-content {
  display: inline-flex;
  align-items: center;
  gap: $spacing-4;
}

.ui-data-table__header-cell--sortable {
  cursor: pointer;
  user-select: none;
}

// `text-align` no `<th>` também empurra `.ui-data-table__header-content`
// (inline-flex) pra direita — o ícone de ordenação continua colado no
// texto, só o par inteiro migra de lado.
.ui-data-table__header-cell--align-right {
  text-align: right;
}

// `sticky` (2026-09-10, pedido direto do usuário —
// `ProductMarketplacePricingView.vue`, coluna "Produto" fixa no scroll
// lateral da tabela de 10+ parcelas de breakdown). `left` NÃO fica fixo
// aqui — vem de `:style` inline (`stickyLeftOffsets`, `<script setup>`),
// medido em runtime pra suportar mais de uma coluna sticky ao mesmo
// tempo sem a 2ª sobrepor a 1ª (achado real, mesmo dia). `background-color`
// explícito nas duas (header E cell) é obrigatório — sem ele a coluna
// "flutua" transparente por cima das outras no scroll, deixando o texto
// delas vazando por baixo. `z-index: 1` só pra ficar acima das células
// comuns (sem sticky nenhuma, `z-index` default já resolveria sozinho,
// mas o navegador empilha por ordem de pintura, não de DOM, entre
// elementos sticky/estáticos misturados).
.ui-data-table__header-cell--sticky {
  position: sticky;
  z-index: 1;
  background-color: $color-bg-1;
  // Hairline (mesmo token de `button-secondary`) separando a coluna fixa
  // do conteúdo que desliza por baixo — sem isso, a transição pareceria
  // um corte reto sem nenhuma pista visual de "isso aqui não rola".
  box-shadow: 1px 0 0 $color-ink-10;
}

.ui-data-table__cell {
  padding: $spacing-8 $spacing-16;
  color: $color-ink;
  // Divisor sutil entre linhas — aproximação do gradiente quase
  // imperceptível do Figma ("Black/5%"), mesmo critério já usado no
  // Badge/Search pra valor fora da escala sólida.
  border-bottom: 1px solid $color-ink-4;
}

.ui-data-table__cell--align-right {
  text-align: right;
}

.ui-data-table__cell--sticky {
  position: sticky;
  z-index: 1;
  background-color: $color-bg-1;
  box-shadow: 1px 0 0 $color-ink-10;
}

.ui-data-table__empty {
  padding: $spacing-24;
  color: $color-ink-40;
  text-align: center;
}
</style>
