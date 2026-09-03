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
 * Sem paginação/filtro embutidos de propósito (gap real, não implementado
 * nesta rodada — `Pagination` é um componente próprio no Figma, ainda não
 * mapeado em nenhum tier do catálogo). Ordenação também não ordena os
 * dados sozinha — só emite `sort`, quem decide a ordenação real é o
 * composable do módulo consumidor (mesma régua de "block nunca decide
 * regra de negócio").
 */
import { computed, ref } from 'vue'
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
            :key="column.key"
            :class="[
              'ui-data-table__header-cell',
              { 'ui-data-table__header-cell--sortable': column.sortable },
            ]"
            @click="handleSort(column)"
          >
            <span class="ui-data-table__header-content">
              <span>{{ column.title }}</span>
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
          <td v-for="column in columns" :key="column.key" class="ui-data-table__cell">
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

.ui-data-table__cell {
  padding: $spacing-8 $spacing-16;
  color: $color-ink;
  // Divisor sutil entre linhas — aproximação do gradiente quase
  // imperceptível do Figma ("Black/5%"), mesmo critério já usado no
  // Badge/Search pra valor fora da escala sólida.
  border-bottom: 1px solid $color-ink-4;
}

.ui-data-table__empty {
  padding: $spacing-24;
  color: $color-ink-40;
  text-align: center;
}
</style>
