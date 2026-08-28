<script setup lang="ts">
/**
 * Grounded na instância "Function Bar" do Figma (`#4113:42235`, ao lado do
 * frame "Table" — mas o mesmo padrão aparece solto em outras telas, não é
 * exclusivo de tabela, daí o nome genérico em vez de `TableToolbar`).
 * Fundo `{colors.bg-2}` (aproximação de "#F7F9FB", mesmo critério já usado
 * em valores fora da escala sólida), 3 botões ghost em grupo (Adicionar/
 * Filtro/Ordenar — o "Button Group" do Figma não é um primitivo próprio,
 * é só 3 `Button` com gap 8px, confirmado sem borda compartilhada entre
 * eles) + `Search`.
 *
 * Puramente de apresentação — não decide o que "adicionar"/"filtrar"/
 * "ordenar" fazem de verdade, só emite os eventos e repassa o texto de
 * busca via `v-model:search` (seção 3.2 de
 * docs/infra/convencoes-frontend-infra.md, bloco nunca tem regra de
 * negócio).
 *
 * **`addLabel`, pedido direto pelo usuário em 2026-08-28** (primeiro CRUD
 * real, "Produtos"): botão de criar precisa de texto explícito, não só o
 * ícone `+` do Figma original — mas o texto ("Novo produto") é específico
 * da entidade, não dá pra fixar aqui (bloco nunca decide texto de
 * domínio). Prop opcional: com `addLabel`, vira um botão `primary` com
 * ícone+texto (o CTA principal da tela); sem ela, mantém o ícone-só
 * `ghost` original — qualquer consumidor futuro sem CRUD (ex.: uma
 * barra de ferramentas sem ação de "criar" nomeável) não é afetado.
 * `filter`/`sort` continuam ícone-só de propósito — só "editar/excluir/
 * criar" foram citados como precisando de texto explícito.
 *
 * **`filterable`/`sortable`, pedido direto pelo usuário em 2026-08-28**
 * ("alguns botões da filterbar não fazem nada, se não tem ação tire ou
 * me justifique") — os dois botões emitiam `filter`/`sort` pro consumidor
 * decidir o que fazer, mas `ProductsView.vue` (primeiro CRUD real) nunca
 * escutava nenhum dos dois: botão morto, clique sem efeito. Em vez de
 * remover os botões do bloco (a `ShowcaseView.vue` ainda demonstra os 3
 * botões do "Function Bar" do Figma na íntegra), viraram opt-out — default
 * `true` (mantém o visual documentado no design system pra quem realmente
 * usa), e `ProductsView.vue` desliga os dois explicitamente com o motivo
 * real registrado ali (ordenação já existe via cabeçalho da `DataTable`,
 * filtro não tem nenhuma dimensão além do SKU que a busca já cobre).
 */
import { ArrowsDownUp, FunnelSimple, Plus } from '@/shared/components/icons/regular.generated'
import Button from '../ui/Button.vue'
import Search from '../ui/Search.vue'

withDefaults(
  defineProps<{
    addLabel?: string
    filterable?: boolean
    searchPlaceholder?: string
    sortable?: boolean
  }>(),
  {
    addLabel: undefined,
    filterable: true,
    searchPlaceholder: undefined,
    sortable: true,
  },
)

const emit = defineEmits<{
  add: []
  filter: []
  sort: []
}>()

const search = defineModel<string>('search', { default: '' })
</script>

<template>
  <div class="ui-toolbar">
    <div class="ui-toolbar__actions">
      <Button v-if="addLabel" :icon-before="Plus" variant="primary" @click="emit('add')">
        {{ addLabel }}
      </Button>
      <Button
        v-else
        :aria-label="$t('common.actions.add')"
        :icon-before="Plus"
        variant="ghost"
        @click="emit('add')"
      />
      <Button
        v-if="filterable"
        :aria-label="$t('common.actions.filter')"
        :icon-before="FunnelSimple"
        variant="ghost"
        @click="emit('filter')"
      />
      <Button
        v-if="sortable"
        :aria-label="$t('common.actions.sort')"
        :icon-before="ArrowsDownUp"
        variant="ghost"
        @click="emit('sort')"
      />
    </div>
    <Search v-model="search" :placeholder="searchPlaceholder ?? $t('common.search.placeholder')" />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

// Achado real, testado com o primeiro CRUD (`ProductsView.vue`,
// 2026-08-28): `addLabel` deixa o botão de criar bem mais largo que o
// ícone-só original — no mobile, `actions` + `Search` sem `flex-wrap`
// não cabiam na mesma linha e `Search` saía parcialmente cortado pelo
// `overflow-x: hidden` global (`core/styles/_reset.scss`). `flex-wrap`
// (mobile-first, sem media query — a linha só "sobra" quando não cabe)
// resolve sem precisar de breakpoint: no desktop, os itens já cabem
// numa linha só e o wrap nunca entra em ação.
.ui-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-8;
  background-color: $color-bg-2;
  border-radius: $radius-8;
}

.ui-toolbar__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: $spacing-8;
}

.ui-toolbar :deep(.ui-search) {
  flex: 1;
  min-width: 160px;
}
</style>
