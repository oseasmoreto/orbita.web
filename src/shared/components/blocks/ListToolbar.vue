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
 *
 * **`addDisabled`, pedido direto pelo usuário em 2026-08-31** (Fase 3,
 * `usePlanLimit`): checagem PROATIVA de `PLAN.max_products` —
 * `ProductsView.vue` desabilita o botão de criar quando o limite já foi
 * atingido, em vez de deixar o usuário só descobrir isso no 422 do
 * backend (`CreateProductAction`, continua sendo a trava real). Bloco
 * continua sem regra de negócio própria: só repassa o booleano já
 * decidido pelo consumidor pro `Button` interno.
 *
 * **`addable`/`searchable` + slot `#filters`, 2026-09-01** — pedido
 * direto do usuário depois de notar que só `ProductsView.vue` tinha essa
 * barra: os outros CRUDs (Marketplaces/Planos/Usuários/Notificações/
 * Configurações/Auditoria, admin) caíram pra um header solto (`h1` +
 * `Button`) porque a API deles não tem filtro de TEXTO livre (só
 * enum/boolean — `active`/`role`/`status`/`type`/`billing_cycle`), e
 * `Search` sempre renderizava mesmo sem nenhum campo real pra buscar.
 * Em vez do bloco aprender sobre esses domínios (violaria "block nunca
 * tem regra de negócio", seção 3.2 de `docs/infra/convencoes-frontend-infra.md`),
 * ele ganhou 2 saídas genéricas: `searchable` (esconde `Search` por
 * completo quando não há campo de texto real — mesmo espírito de
 * `filterable`/`sortable`) e um slot `#filters`, onde cada view encaixa
 * os próprios `Select`s de domínio (ex.: `role`/`status` em Usuários) —
 * a decisão de quais opções existem continua 100% da view/composable,
 * o bloco só reserva o espaço visual na mesma barra. `addable` (esconde
 * o botão de criar por completo) cobre o caso de tela read-only
 * (Auditoria) — sem isso, um `v-else` ghost "+" sem handler seria botão
 * morto, a mesma regra que já motivou `filterable`/`sortable` virarem
 * opt-out.
 */
import { ArrowsDownUp, FunnelSimple, Plus } from '@/shared/components/icons/regular.generated'
import Button from '../ui/Button.vue'
import Search from '../ui/Search.vue'

withDefaults(
  defineProps<{
    addable?: boolean
    addDisabled?: boolean
    addLabel?: string
    filterable?: boolean
    searchable?: boolean
    searchPlaceholder?: string
    sortable?: boolean
  }>(),
  {
    addable: true,
    addDisabled: false,
    addLabel: undefined,
    filterable: true,
    searchable: true,
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
    <div v-if="addable || filterable || sortable" class="ui-toolbar__actions">
      <Button
        v-if="addable && addLabel"
        :disabled="addDisabled"
        :icon-before="Plus"
        variant="primary"
        @click="emit('add')"
      >
        {{ addLabel }}
      </Button>
      <Button
        v-else-if="addable"
        :aria-label="$t('common.actions.add')"
        :disabled="addDisabled"
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
    <div v-if="$slots.filters" class="ui-toolbar__filters">
      <slot name="filters" />
    </div>
    <Search
      v-if="searchable"
      v-model="search"
      :placeholder="searchPlaceholder ?? $t('common.search.placeholder')"
    />
  </div>
</template>

<style scoped lang="scss">

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

// `margin-left: auto` empurra o slot inteiro (e tudo que vier depois
// dele no fluxo — `Search`, quando ligado) pra ponta direita da barra,
// deixando `.ui-toolbar__actions` (botão de cadastrar) fixo na ponta
// esquerda — pedido direto do usuário em 2026-09-01. Seguro porque todo
// consumidor real do slot `#filters` já desliga `searchable` (`Search`
// nunca aparece ao lado dos filtros de domínio, confirmado em auditoria
// de todos os usos) — sem esse cuidado, `Search` (que já é `flex: 1`)
// ficaria espremido entre o `margin-left: auto` e a borda, em vez de
// ocupar o espaço à esquerda dos filtros como um campo de busca deveria.
.ui-toolbar__filters {
  display: flex;
  flex-shrink: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-8;
  margin-left: auto;
  // `min-width: 0` — sem isso, um item flex com `flex-wrap` PRÓPRIO
  // ainda usa seu `max-content` (todos os filhos numa linha só, sem
  // quebrar) como largura mínima dentro do container PAI, ignorando o
  // `flex-wrap` do pai. Achado real: `AdminTicketsView.vue` (3 filtros +
  // 2 `DateRangePicker` + botão "Filtrar") ultrapassava a borda direita
  // do toolbar mesmo com `flex-wrap: wrap` nos dois níveis — o item
  // nunca herdava um teto de largura pra decidir quebrar linha. Trocado
  // `flex-shrink: 0` → `1` (agora pode encolher) + `min-width: 0`
  // (remove o piso implícito de `max-content`) — com os dois, o
  // navegador finalmente respeita a largura do container pai e quebra
  // os filtros em várias linhas quando não cabem numa só.
  min-width: 0;
}

// Achado real, reportado pelo usuário em 2026-09-01: `Select.vue` tem
// `.ui-select-wrapper { width: 100% }` (correto dentro de um `FormGroup`,
// onde o campo deve ocupar a largura toda) — mas herdado sem alteração
// aqui, cada `Select` de filtro forçava `flex-basis` pra 100% do
// container, fazendo o segundo `Select` (ex.: `type`+`status` em
// `AdminNotificationsView.vue`) sempre quebrar linha mesmo sobrando
// espaço. `Input`/`FormGroup` não têm o mesmo problema (`Input.vue` não
// fixa `width: 100%` no próprio wrapper). Corrigido travando a largura
// do `Select` só dentro do toolbar, mesma técnica já usada pro `Search`
// logo abaixo.
//
// **Mesmo achado, `Combobox.vue`/`DateRangePicker.vue`, reportado pelo
// usuário em 2026-09-01** ("era pra estarem lado a lado alinhado a
// esquerda, todos ficaram empilhados") — os dois têm o mesmo
// `width: 100%` no wrapper (`.ui-combobox-wrapper`/
// `.ui-date-range-picker-wrapper`, mesma origem de "boxed" do resto da
// família Form), com o mesmo efeito: cada um reivindicava a largura
// inteira do container, empurrando o próximo filtro pra própria linha
// mesmo sobrando espaço — pior ainda no `DateRangePicker`, cuja caixa
// virava uma barra esticada quase do tamanho do toolbar inteiro, em vez
// da caixa compacta esperada. Mesma correção, mesma técnica.
.ui-toolbar__filters :deep(.ui-select-wrapper),
.ui-toolbar__filters :deep(.ui-combobox-wrapper) {
  width: auto;
  min-width: 160px;
}

.ui-toolbar__filters :deep(.ui-date-range-picker-wrapper) {
  width: auto;
  min-width: 280px;
}

.ui-toolbar :deep(.ui-search) {
  flex: 1;
  min-width: 160px;
}

// **`margin-left: auto` só quando há algo à esquerda pra empurrar contra
// (o botão de cadastrar), pedido direto do usuário em 2026-09-01**
// ("quando nao tiver o botão de criar novo, faça com q os filtros
// fiquem full") — sem `.ui-toolbar__actions` (telas read-only:
// `addable="false"`), `.ui-toolbar__filters` é o ÚNICO filho do
// `.ui-toolbar` (todo consumidor do slot `#filters` já desliga
// `searchable`, confirmado em auditoria — nunca sobra um 3º elemento
// competindo). Right-align nesse cenário só deixava uma faixa cinza
// vazia enorme à esquerda com os filtros espremidos numa coluna estreita
// à direita. `:only-child` detecta esse caso sem precisar de uma prop
// nova no bloco: zera o `margin-left` e estica o container pra 100% da
// barra — os filtros (já compactos pela correção acima) então fluem
// lado a lado a partir da borda esquerda, como qualquer flex row normal
// (`justify-content` continua `flex-start`, o default).
.ui-toolbar__filters:only-child {
  width: 100%;
  margin-left: 0;
}
</style>
