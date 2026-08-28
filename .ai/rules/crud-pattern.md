# Padrão de CRUD reutilizável

Estabelecido com o primeiro CRUD real do projeto (`modules/catalog`,
Produtos — `docs/planejamento/plano-implementacao.md` Fase 3, 2026-08-28),
pedido direto do usuário: "vamos já criar um padrão pra reutilizarmos nos
cruds, tudo abstraído, todos os composables envolvidos". Todo CRUD novo
(ex.: Marketplaces conectados, Fase 4) segue esta forma — não reinventa.

## As 3 peças genéricas (`shared/composables/`)

Nenhuma delas sabe o nome de nenhuma entidade de domínio. Todas test-first.

- **`useResourceList<T>`** — paginação + busca + ordenação + loading/erro.
  Recebe só `fetchPage({ page, perPage, search, sortKey, sortDirection })`.
  Sem debounce embutido de propósito — quem debounce a busca é o
  composable específico do módulo (`refDebounced` do `@vueuse/core`,
  nunca um debounce escrito à mão — decisão já registrada seção 4 de
  `docs/infra/convencoes-frontend-infra.md`).
- **`useCrudDrawer<T>`** — `isOpen`/`mode` (`'create' | 'edit'`)/
  `editingRecord` (`shallowRef<T | null>`, não `ref` — evita a Proxy
  reativa do Vue quebrar igualdade de referência em teste e evita
  reatividade profunda desnecessária numa entidade externa).
  `openCreate()`/`openEdit(record)`/`close()`. `close()` NÃO reseta
  `mode`/`editingRecord` — faria o conteúdo do Drawer trocar visualmente
  antes da animação de saída do `vaul-vue` terminar.
- **`useConfirmAction<T>`** — `isOpen`/`target` (`shallowRef<T | null>`).
  `request(item)`/`cancel()`/`confirm(handler)`. `confirm()` propaga erro
  do `handler` e só fecha/limpa no sucesso — permite tentar de novo sem
  perder o alvo.

## A forma de um módulo CRUD (`modules/<contexto>/`)

```
modules/<contexto>/
  types/<recurso>.type.ts        # camelCase, em cima do schema OpenAPI gerado
  services/<contexto>Api.ts      # list/create/update/delete reais, via apiClient
  schemas/<recurso>FormSchema.ts # createXFormSchema(t) — FÁBRICA, nunca schema estático
  composables/use<Recurso>List.ts   # wraps useResourceList + mapeia sort da UI -> API
  composables/use<Recurso>Form.ts   # valida com o schema, chama o service, toast i18n
  components/<Recurso>Form.vue      # form único: create E edit (prop `mode`)
  views/<Recurso>sView.vue          # a página inteira
```

**Regra não-negociável, herdada de `.ai/rules/i18n.md`**: schema Zod de
formulário nunca é um objeto estático exportado com mensagem hardcoded —
sempre uma função `createXFormSchema(t: (key: string) => string)`, porque
mensagem de validação é texto de UI. `useXForm.ts` chama
`createXFormSchema(t)` internamente (`useI18n()` só existe dentro de
composable/componente). Teste chama a fábrica com `(key) => key` — não
precisa montar o `vue-i18n` de verdade pra testar a lógica de validação.

## A forma da View (`<Recurso>sView.vue`)

Ordem fixa, de cima pra baixo (grounded na captura de referência "Order
List" usada pro CRUD de Produtos):

1. `<h1>` com o título da página (i18n).
2. `ListToolbar` — `add-label` com texto explícito (nunca só ícone `+`
   pra um CRUD — pedido explícito do usuário: "temos que colocar o texto
   dos botões para ficar explícito"), `search-placeholder` específico do
   que a busca realmente filtra (ex.: "Buscar por SKU", não um genérico
   "Buscar" se a API só aceita um filtro exato). **`filterable`/`sortable`
   só ficam ligados (default `true`) se a view realmente escuta
   `@filter`/`@sort` com uma ação de verdade** — regra explícita do
   usuário: "se não tem ação, tire ou justifique". `ProductsView.vue`
   desliga os dois com `:filterable="false" :sortable="false"` porque a
   ordenação já é feita pelo cabeçalho da `DataTable` e não existe segunda
   dimensão de filtro além do SKU que a busca cobre — um CRUD novo repete
   esse raciocínio: só deixa o botão ligado com um handler real por trás,
   nunca por padrão/estética.
3. Banner de erro (`role="alert"`) quando `list.error` existe — nunca
   confundir "lista vazia" com "falha ao carregar".
4. `DataTable` — coluna `operations` com **`Editar`/`Excluir` como
   `Button` ícone+texto visíveis na própria linha**, não escondidos atrás
   de um `DropdownMenu` (decisão explícita do usuário pra este padrão;
   `DropdownMenu` continua válido pra outras telas, só não é o padrão
   default de CRUD). Colunas refletem só campos reais do recurso — nunca
   inventar coluna/badge que dependeria de um cálculo/relação que a API
   ainda não expõe (ex.: Produto não ganhou coluna de "Marketplace"/
   "dentro da margem" porque isso é `PRODUCT_MARKETPLACE`/
   `PricingCalculator`, fora do CRUD de produto puro).
5. `PaginationNav`.
6. `Drawer` (`size="md"`, lateral direito — decisão explícita do usuário:
   "renderizarão no modal lateral direito", não uma rota
   `/recurso/new`/`/recurso/:id/edit` separada) envolvendo
   `<RecursoForm :mode :product @cancel @saved>`.
7. `ConfirmDialog` pra exclusão, ligado a `useConfirmAction`.

`AppFooter` NÃO entra na view — é chrome global, montado uma vez em
`AppLayout.vue` (sticky no bottom, ao lado do `AppHeader` sticky no topo).
Nenhum CRUD novo deve importar `AppFooter` na própria view.

## O que NÃO fazer

- Não escrever um segundo motor de paginação/busca/ordenação do zero —
  sempre `useResourceList`.
- Não duplicar o par `isOpen`/`mode`/`editingRecord` à mão num `ref`
  solto na view — sempre `useCrudDrawer`.
- Não confirmar exclusão com um `confirm()` nativo do browser nem um
  `if` solto — sempre `useConfirmAction` + `ConfirmDialog`.
- Não hardcodar texto de botão/coluna/mensagem — toda string visível
  passa por `$t()`/`t()` (`.ai/rules/i18n.md`), incluindo dentro do
  schema Zod (fábrica, não objeto estático).
