# Componentes — Blocks e overlays

FormGroup, CrudFormActions, Modal, ConfirmDialog, Drawer, DataTable, AvatarGroup, IconTile, IconText, PaginationNav, ListToolbar, DropdownMenu, Breadcrumb, TabBar, BlockTab — composições de `shared/components/blocks/` e os átomos de sobreposição (Modal/Drawer) de `shared/components/ui/`.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## FormGroup (`shared/components/blocks/FormGroup.vue`)

**Sem frame próprio no Figma** — o "Form" do Figma só define
Input/Select/Date/Switch/Tags/Checkbox isolados, nenhum com um padrão de
mensagem de erro (confirmado lendo o `COMPONENT_SET "Form"` inteiro).
`FormGroup` é composição nossa mesmo, prevista desde a seção 3.2 de
`docs/infra/convencoes-frontend-infra.md` — agrupa label + controle +
mensagem de erro, nunca decide regra de validação (isso é do composable
`use<Recurso>Form` de cada módulo, `error` chega já resolvido via prop).

- **`label` envolve o controle** (`<label>` ao redor do `<slot />`, não
  `for`/`id`) — `Input.vue`/`Select.vue`/`Checkbox.vue` não expõem um `id`
  externo (cada um gera o próprio via `useId()` interno), então a
  associação por atributo não alcançaria o elemento real de dentro do
  slot. Envolver funciona sem isso: `<label>` foca automaticamente o
  primeiro descendente focável (`<input>` nativo do Input.vue, `<button>`
  do Reka UI por trás de Select/Checkbox), confirmado clicando o texto do
  label e checando `document.activeElement` — focou o `<input>` real.
  Existe uma sobreposição possível a evitar: usar a prop `label` do
  `FormGroup` já cobre o rótulo, então o controle dentro do slot deveria
  ficar sem a própria prop `label` interna (Input-A/Select-A, não
  Input-B/Select-B) pra não duplicar o rótulo.
- `error` (opcional): mensagem abaixo do controle, `{colors.accent-red}`,
  `role="alert"`.

**Prop `labelTooltip`, 2026-09-02** — primeiro consumidor:
`ProductForm.vue`, campo "Preço de custo" (pedido direto do usuário
junto com a mudança de contrato `purchase_price`→`cost_price`, ver seção
`ProductForm` abaixo). Ícone `Info` (14px) + `Tooltip.vue` ao lado do
texto do label, dentro do mesmo `<label>` que já envolve o controle —
`@click.stop` no trigger evita que o clique borbulhe pro `<label>` e
foque o `<input>` por engano (o `<label>` já foca o primeiro descendente
focável de propósito, ver bullet acima; sem o `.stop`, clicar no ícone de
tooltip também focaria o campo). Opcional, `undefined` por padrão — todo
consumidor existente continua sem nenhuma mudança visual.

**`ean`/`ncm` viraram opcionais, 2026-09-04** (`ProductForm.vue`,
mudança de contrato do backend, pedido direto do usuário — "nem todo
vendedor tem os dois em mãos no momento do cadastro") — `productFormSchema.ts`
perdeu o `.min(1, ...)` dos dois campos (viram `z.string()` puro, sem
`.nullable()`: o model de `values` continua `string`, `Input.vue` não
tem variante nullable, mesmo padrão já usado em `responsibleDocument`,
`companyFormSchema.ts`). Conversão string vazia ↔ `null` fica só na
BORDA (`useProductForm.ts`): `toFormValues` faz `product.ean ?? ''` (a
API agora pode devolver `null`), `toRequestPayload` faz `values.ean ||
null`. Chaves i18n mortas removidas do catálogo
(`catalog.products.form.errors.eanRequired`/`ncmRequired`, sem mais
consumidor) — a validação de FORMATO quando o campo é preenchido
continua intacta (`errors.validation.byField.ean`/`ncm`,
`closure_validation_rule`, resolvida por `useApiMessage`), só a
obrigatoriedade caiu. Sem mudança nenhuma de template — nenhum dos dois
campos tinha indicador visual de obrigatório (asterisco/etc.) pra
remover. Teste novo em `productFormSchema.test.ts` confirmando que os
dois campos vazios agora validam com sucesso.

## CrudFormActions (`shared/components/blocks/CrudFormActions.vue`)

**Sem frame próprio no Figma** (mesma categoria de `FormGroup`/`Modal` —
composição nossa, não do design source) — extraído em 2026-08-31, pedido
direto do usuário ("composables e componentes abstraídos pra evitar
duplicidade"), depois de notar que `ProductForm.vue`/
`ProductLaunchForm.vue` (`.product-form__actions`/
`.product-launch-form__actions`) tinham exatamente a mesma marcação+CSS:
rodapé com 2 `Button` (Cancelar `outline`, Submit `primary`), alinhados
à direita, `gap: {spacing.8}`, `padding-top: {spacing.16}`.

- Props: `cancelLabel`/`submitLabel` (textos já traduzidos pelo
  consumidor — bloco nunca decide texto de UI) + `isSubmitting?`
  (desabilita o botão de submit, mesmo tratamento que os 2 forms já
  faziam). Emite só `cancel` — o submit continua sendo o próprio
  `@submit.prevent` do `<form>` pai, este bloco não precisa saber disso
  (o `<button type="submit">` já dispara o evento nativo do form).
- Puramente de apresentação, sem estado interno — não exige test-first
  (seção 11.2 de `docs/infra/convencoes-frontend-infra.md`), verificado
  em browser real via o fluxo completo de criar/editar/cancelar produto
  e lançamento (`docs/planejamento/plano-implementacao.md`, seção "Padrão
  de CRUD, lado do formulário").
- Ver `.ai/rules/crud-pattern.md` pra quando usar — todo `<Recurso>Form.vue`
  novo (Fase 4 em diante) usa este bloco pro rodapé, nunca reescreve a
  marcação/CSS à mão de novo.

## Modal (`shared/components/ui/Modal.vue`)

**Sem frame próprio no Figma** (gap já registrado em
`docs/design/catalogo-componentes.md`, seção 3) — construído direto sobre
`Dialog*` da Reka UI (`DialogRoot`/`DialogPortal`/`DialogOverlay`/
`DialogContent`/`DialogTitle`/`DialogDescription`/`DialogClose`) + tokens
do design system, mesmo caminho já usado por Select/Tooltip.

- Overlay `{colors.ink-40}`, conteúdo `{colors.bg-1}`, `{rounded.16}` —
  primeiro uso desse raio (documentado como "reservado pra card" desde a
  Fase 0, nenhum componente usava ainda).
- Slots: default (corpo, só renderiza `.ui-modal-body` quando o slot tem
  conteúdo — evita um espaço vazio quando o consumidor usa só
  `title`/`description`, como o `ConfirmDialog` faz) e `footer` (ações,
  mesmo padrão condicional).
- Prop `title` obrigatória (sempre vira `DialogTitle`, a11y). `description`
  é opcional — sem ela, mesmo achado do `DrawerTitle`/`Description` do
  `AppSidebar`: Reka UI ainda exige uma `DialogDescription` associada, daí
  entra escondida via `VisuallyHidden` (`as-child`), nunca `display:none`
  (que também a removeria da árvore de acessibilidade).
- Fecha via `DialogClose` (ícone `X`, canto superior direito), clique no
  overlay ou `Esc` — os 3 confirmados em browser real.
- `DialogPortal` teletransporta pro fim do `<body>`, mesmo achado já
  documentado pro Select/Tooltip — todas as classes usam `:global(...)`
  com seletor "plano" (nunca `&` aninhado dentro do `:global()`, é o bug
  real já corrigido no Select — ver seção Select acima).

**Variante `centered` + slot `#icon`, 2026-08-30** — pedida direto pelo
usuário comparando o modal de sucesso do reset de senha
(`ResetPasswordView.vue`) com a captura real do Figma: a v1 punha o ícone
no slot padrão (corpo), que no `Modal` sempre renderiza DEPOIS do
título/descrição — errado contra a referência, que mostra ícone em círculo
tintado ACIMA do título, texto centralizado e um único botão esticado pra
largura total, não alinhado à direita.

- Slot novo `#icon`, renderizado antes de `DialogTitle` (só aparece quando
  o consumidor passa conteúdo, mesmo padrão condicional de `body`/`footer`)
  — `Modal.vue` só centraliza o slot (`display:flex; justify-content:center`)
  e dá `margin-bottom`, nunca decide cor/tamanho do badge: isso é
  apresentação específica do consumidor (ex.: círculo verde de sucesso em
  `ResetPasswordView.vue`, `$size-64` + `color-mix()` sobre
  `{colors.accent-green}`, mesma técnica já usada no `StatusDot` variante
  `pill`) — sem grounding pra padronizar isso como átomo próprio ainda
  (só 1 consumidor real).
- Prop `centered?: boolean` (default `false`) — quando `true`, título e
  descrição ganham `text-align: center` e o footer vira coluna com cada
  filho a `width: 100%` (botão único esticado). Sem `centered`, o `Modal`
  continua exatamente como antes (título à esquerda, footer alinhado à
  direita) — `ConfirmDialog`/demais usos não mudam nada.

**Anel de foco cortado — mesmo bug real de `Drawer.vue`, corrigido
junto, 2026-08-31**: `.ui-modal-body` (`overflow-y: auto`) também não
tinha padding nenhum, cortando o `focus-ring` de qualquer campo
encostado na borda (ex.: `ProductLaunchForm.vue` dentro do `Modal` de
lançamento). Mesma correção: `padding: $spacing-4` + `margin` negativo
compensando — ver seção Drawer acima pro relato completo (raciocínio,
técnica de compensação e verificação são idênticos nos dois).

## ConfirmDialog (`shared/components/blocks/ConfirmDialog.vue`)

Composição de `Modal.vue` + 2 `Button` — confirmação de ação (cancelar
assinatura, excluir produto, desconectar marketplace...). Só emite
`confirm`/`cancel`, nunca decide o que a ação faz de verdade (bloco nunca
tem regra de negócio, seção 3.2 de `docs/infra/convencoes-frontend-infra.md`).

- **Sem variante "destrutiva"/vermelha de propósito**: `Button.vue` não
  tem `variant="danger"` (removido na reimplementação da Tier 0 — o Figma
  não define essa variante) e o design system só permite `{colors.primary}`
  como cor de ação (ver "Don't" abaixo). Reintroduzir vermelho aqui
  contradiria as duas decisões já tomadas — o botão de confirmar é sempre
  `variant="primary"`, o de cancelar sempre `variant="outline"`.
- Props: `title`, `description?`, `confirmLabel` (default "Confirmar"),
  `cancelLabel` (default "Cancelar"). `v-model:open` + eventos `confirm`/
  `cancel` — ambos fecham o diálogo automaticamente depois de emitir.

## Drawer (`shared/components/ui/Drawer.vue`)

**Pedido direto do usuário em 2026-08-27** (variação do `Modal`, não do
Figma): painel lateral encostado em `top: 0`/`right: 0`, `height: 100vh`,
3 tamanhos (`sm`/`md`/`lg`), com o mesmo efeito de slide já usado no drawer
mobile da sidebar (`core/layouts/AppSidebar.vue`). Construído com o mesmo
primitivo `vaul-vue` de lá, só que `direction="right"` em vez de `"left"` —
reaproveita a mecânica de arrasto/animação em vez de reimplementá-la.

- **Larguras sem grounding no Figma** (mesmo caso do `max-width` do
  `Modal`) — decisão nossa: `sm` 320px, `md` 480px, `lg` 640px. Revisar se
  um frame real de painel lateral aparecer depois.
- Estrutura igual ao `Modal` (`title` obrigatório, `description?` com
  fallback `VisuallyHidden`, slots `default`/`footer` só renderizam com
  conteúdo, `DrawerClose` com ícone `X` no canto) — a diferença é só
  geometria (`top`/`right`/altura total em vez de centralizado) e a
  animação de slide/arrasto que o `vaul-vue` já resolve.
- `vaul-vue` reexporta os primitivos `Dialog*` da Reka UI com nome
  `Drawer*` (`DrawerTitle`/`DrawerDescription`/`DrawerPortal`/`DrawerClose`
  são literalmente `Dialog*` por baixo) — `VisuallyHidden` não tem
  reexport próprio no `vaul-vue`, importado direto de `reka-ui`.

**Correção pedida pelo usuário em 2026-08-27, com referência visual de
outro produto (não do Figma do design system)**: abaixo do breakpoint
`md` (mesmo `64rem`/1024px já usado pra alternar `AppSidebar`/`AppHeader`
entre mobile e desktop) o Drawer vira **bottom sheet** — desliza de baixo
pra cima, sempre 100% de largura (os 3 tamanhos só valem no desktop),
`DrawerHandle` (alça de arrastar) visível no topo. Acima do breakpoint
continua painel lateral direito como antes.

- **A troca de eixo é reativa via JS (`useMediaQuery` do `@vueuse/core`),
  não só CSS**: o `direction` do `vaul-vue` (`'bottom'` no mobile,
  `'right'` no desktop) controla a mecânica de arrasto/animação, então
  puro CSS não bastaria — o componente precisa saber em qual eixo o
  `vaul-vue` deve interpretar o gesto de arrastar pra fechar.
- CSS mobile-first (sem media query = bottom sheet, `min-width: $breakpoint-md`
  = painel lateral) — mesma convenção mobile-first já usada no resto do
  projeto, nunca `max-width` como padrão.
- `DrawerHandle` (primitivo próprio do `vaul-vue` pra bottom sheet)
  estilizado como barra curta arredondada (`{colors.ink-20}`), escondida
  via `display:none` acima do breakpoint — não existe equivalente no
  painel lateral de desktop, que não tem gesto de arrasto vertical.
- Confirmado em browser real nos dois viewports: mobile (390px) —
  `bottom:0`/`left:0`/`right:0`, largura igual à da janela, handle visível;
  desktop (1280px) — `top:0`/`right:0`, altura igual à da janela, largura
  conforme `size`, handle escondido. Fecha com `Esc` nos dois casos.
- **Achado real na verificação**: medir a posição (`getBoundingClientRect`)
  logo após o clique que abre o painel ainda pega a animação de mola
  (spring) do `vaul-vue` em andamento — `right`/`transform` só zeram de
  vez depois dela estabilizar (~1s). Não é bug, é phys-based animation;
  quem for testar isso de novo precisa esperar a animação terminar antes
  de inspecionar posição/transform.

**Anel de foco cortado, achado real reportado pelo usuário em
2026-08-31** ("borda do focus cortando, já vi isso em outros forms") —
`.ui-drawer-body` (o miolo rolável do Drawer, `overflow-y: auto`) tinha
`padding: 0`. Qualquer campo focado ENCOSTADO na borda desse container
(ex.: o campo "Nome" de `ProductForm.vue`, o primeiro do formulário) tinha
o próprio `focus-ring` (mixin: `outline: 2px solid` + `outline-offset: 2px`
= 4px de extensão pra fora da caixa) CORTADO pelo `overflow` do
container — o outline nunca aparecia de verdade, só a borda reta de 1px
do campo, exatamente a captura que o usuário mandou. Mesmo bug existia em
`Modal.vue` (`.ui-modal-body`) e em `ProductForm.vue`
(`.product-form__fields`, um segundo `overflow-y: auto` ANINHADO dentro
do body do Drawer, pro rodapé de ações ficar fixo enquanto só os campos
rolam).

- **Corrigido nos 3** com a técnica padrão pra esse problema: `padding: $spacing-4`
  (4px, do tamanho exato da extensão do `focus-ring`) + `margin` NEGATIVO
  compensando o padding novo nos mesmos 4 lados (inclusive combinado com
  o `margin-top: $spacing-16` que o Drawer/Modal já tinham, virando
  `calc($spacing-16 - $spacing-4)`) — o conteúdo visível fica
  PIXEL-A-PIXEL onde estava antes (nada se move, nenhum desalinhamento
  novo contra o rodapé de ações, que não tem esse padding), só a ÁREA DE
  CLIPPING do `overflow` cresce o suficiente pro anel de foco não ser
  cortado.
- Verificado em browser real com `getBoundingClientRect()`: antes do fix,
  o wrapper do input ficava exatamente flush com a borda do container
  (0px de folga); depois, sobra exatamente 4px de cada lado — o outline
  (4px de extensão) cabe inteiro sem cortar.

## DataTable (`shared/components/blocks/DataTable.vue`)

Grounded no `COMPONENT_SET "Table Components"` do Figma — header 40px
(padding `{spacing.8} {spacing.16}`), texto de título "12 Regular" em
`{colors.ink-40}` (match com "Black/40%"), borda inferior do header em
`{colors.ink-20}` ("Black/20%"), divisor entre linhas em `{colors.ink-4}`
(aproximação de um gradiente quase imperceptível, "Black/5%" — mesmo
critério já usado no Badge/Search pra valor fora da escala sólida).

- **As variantes de célula do Figma
  (`Type=Status/Date/Text-Icon/Users/User/Activity`...) viram o slot
  nomeado `#cell-<key>="{ row, value }"`, não componentes fixos** — quem
  decide o que renderizar em cada célula é o consumidor (`Badge` de
  status, `Avatar`, data formatada...), o `DataTable` só monta a grade e
  nunca decide regra de negócio (mesma régua de bloco da seção 3.2 de
  `docs/infra/convencoes-frontend-infra.md`).
- **Genérico de verdade** (`<script setup generic="T extends object">`,
  Vue 3.3+) — tipagem forte sem `any`, mas a constraint é `object`, não
  `Record<string, unknown>`: uma `interface` TS comum (sem index signature
  explícita, como qualquer DTO tipado do projeto) não é estruturalmente
  atribuível a `Record<string, unknown>`, o generic ficaria inutilizável
  pra tipos de domínio reais. O acesso por chave dinâmica (`column.key`,
  só conhecida em runtime) usa um cast pontual pra `Record<string,
  unknown>`, isolado numa única função (`getCellValue`).
- **Seleção** (`selectable` + `v-model:selected`) e **ordenação**
  (`column.sortable` + evento `sort`) são só mecânica de UI — o
  `DataTable` não ordena os dados sozinho (quem decide a ordenação real é
  o composable do módulo consumidor), só emite `sort` com `key`/`direction`
  e mantém o ícone do cabeçalho em sincronia.
- **Sem paginação/filtro embutidos** (gap real, não implementado nesta
  rodada) — `Pagination` é um componente próprio no Figma, ainda não
  mapeado em nenhum tier do catálogo.
- **Achado real, sistêmico — afeta qualquer ícone dentro de célula de
  `<table>`, não só o `Checkbox`**: o reset global (`svg { max-width:
  100% }`, `core/styles/_reset.scss`) colapsa a largura de um `<svg>` pra
  `0` quando ele fica dentro de uma célula de tabela com `table-layout:
  auto` — é uma dependência circular de resolução de largura (a célula
  quer se ajustar ao conteúdo, o conteúdo quer ser 100% da célula), não um
  bug do `Checkbox` em si (o mesmo componente funciona normalmente fora de
  tabela, confirmado por comparação). Descoberto ao testar o checkbox de
  seleção de linha: `getBoundingClientRect()` retornava `width: 0` mesmo
  com a `<td>` já tendo largura resolvida (32px) e o atributo `width="20"`
  presente no próprio SVG. **Corrigido** com `.ui-data-table :deep(svg) {
  max-width: none; }` — o `:deep()` alcança o `<svg>` de qualquer
  componente filho **por posição no DOM real**, cobrindo tanto os ícones
  que o próprio `DataTable` renderiza (checkbox, seta de ordenação) quanto
  os que vierem de dentro de um slot de célula do consumidor (ex.: `Badge`
  com ícone em `#cell-margin`), sem exigir que cada consumidor lembre de
  aplicar a correção manualmente. Reconfirmado depois: `20px` de largura
  real em toda a cadeia de ancestrais.

**Cobertura de célula completada em 2026-08-28, pedido direto pelo
usuário com captura da linha inteira do `COMPONENT_SET`** — nova seção
"Table Components" na vitrine (`HomeView.vue`) demonstra, numa única
linha, todos os tipos já citados desde a Tier 6: Title (texto apagado
`{colors.ink-40}`, estado vazio/placeholder — não existe grounding pra
diferenciar de "Text" além da cor), Text (fallback padrão do slot), Text-
Icon (`Icon` 14px + texto), User (`Avatar` 20px + nome), Users
(`AvatarGroup.vue`, novo — ver seção própria abaixo), Date (`CalendarBlank`
14px + texto), Status (`StatusDot.vue` da Tier 14, não mais `Badge` — a
célula "Status" do Figma real é ponto+texto, não pill), Operation (nas
duas variantes vistas na captura: menu de kebab via `DropdownMenu` E
botão de ícone solto, aqui "Baixar"), Activity (`IconTile.vue`, novo —
ver seção própria abaixo). **"Select" fica sem cobertura** — é o único
tipo nomeado no doc de convenções (`docs/infra/convencoes-frontend-infra.md`)
sem representante visualmente distinguível de "Text" na captura recebida;
não implementado por falta de grounding real, não por esquecimento —
revisitável se uma captura futura mostrar a variante de verdade.

## AvatarGroup (`shared/components/blocks/AvatarGroup.vue`)

Grounded na célula "Users" do `COMPONENT_SET "Table Components"` — 2+
avatares sobrepostos seguidos de um contador "+N" pra quem não coube.

- **Anel entre avatares via `box-shadow`, não `border`** — um `border`
  somaria ao diâmetro real do círculo (`box-sizing` à parte, ainda
  precisaria compensar), enquanto `box-shadow: 0 0 0 2px {colors.bg-1}`
  desenha o contorno por cima sem alterar o tamanho que o consumidor pediu
  via prop `size`.
- Sobreposição via `margin-left` negativo (`-{spacing.8}`) em todo item
  exceto o primeiro — mesma técnica universal de "avatar stack" de
  qualquer design system, sem novidade aqui.
- Prop `max` (default 3) corta a lista visível; o restante vira só um
  número no contador "+N", nunca mais avatares reais — evita compor uma
  segunda camada de complexidade (tooltip com a lista completa, por
  exemplo) sem pedido real.
- **Nunca decide a lista de pessoas** — só recebe `people`
  (`AvatarGroupPerson[]`, `{ name, src? }`) já pronta, mesma régua de
  bloco sem regra de negócio.
- Verificado em browser real contra a captura: 2 avatares sobrepostos
  (iniciais "KM"/"OM") + contador "+3" pra uma lista de 5 pessoas com
  `max={2}`, mesmo resultado visual da referência.

## IconTile (`shared/components/ui/IconTile.vue`)

**Resolve o gap "Featured Icon" do catálogo** — planejado desde a Tier 3
como "IconTile.vue (nome a definir)", nunca extraído porque só tinha 1
consumidor até agora (`NotificationItem.vue`, que já usava esse tile
inline, com classes/CSS próprias). A célula "Activity" do `DataTable`
(ícone `PencilSimpleLine` + texto) foi o segundo consumidor real —
cruzou o critério de promoção pra `shared/` já documentado ("só sobe
quando um **segundo** consumidor precisar de verdade", seção 2 de
`docs/infra/convencoes-frontend-infra.md`).

- Mesmos tokens que já existiam no tile do `NotificationItem`: `{size.24}`
  de tile (prop `size`, customizável), `{radius.8}`, ícone 16px (prop
  `iconSize`), fundo `{colors.tint-1}`("blue")/`{colors.tint-2}`("purple")
  — os mesmos "tons reservados sem papel definido" do design system,
  agora com um segundo papel real confirmado (célula de tabela, além do
  tile de notificação).
- **`NotificationItem.vue` refatorado pra consumir o átomo** em vez da
  `<div>`+classes que tinha antes — `.notification-item__icon*` removido
  do arquivo, substituído por `<IconTile :icon="notification.icon"
  :tint="notification.tint" />`. Reconfirmado em browser real (painel de
  notificações reaberto, 5 tiles renderizando idênticos a antes da
  refatoração) — zero mudança visual, só remoção de duplicação.
- **Fix de contraste em tema escuro, 2026-08-28** — mesmo achado do
  `StatCard` (seção abaixo): o ícone usava `color: $color-ink`, que vira
  branco no tema escuro, mas o fundo (`{colors.tint-1}`/`{colors.tint-2}`)
  não tem variante escura — ícone branco sobre fundo claro fixo ficava
  invisível. Trocado por `$color-ink-fixed` (token novo em `_tokens.scss`
  que nunca flips com o tema).

## IconText (`shared/components/ui/IconText.vue`)

**Extraído de `HomeView.vue` a pedido do usuário em 2026-08-28** — a
vitrine tinha uma classe `.showcase__cell-marketplace` (`display: flex;
gap: 8px`) copiada em 6 slots de célula diferentes do `DataTable`
(marketplace/assignedTo/textIcon/user/date/activity), cobrindo 3 dos
tipos nomeados do `COMPONENT_SET "Table Components"` (User, Text-Icon/
Date, Activity). O usuário notou a duplicação e perguntou se não devia
virar componente — reuso real (6 usos, não hipotético), mesmo critério
de promoção já usado no `IconTile`/`AvatarGroup`.

- **Só organiza layout, não sabe o que é o elemento à esquerda** — recebe
  `Avatar`/`Icon`/`IconTile`/qualquer coisa pelo slot default, e o texto
  via prop `text`. Não é um componente "ícone + texto" de verdade (nome
  herdado do tipo de célula "Text-Icon" do Figma, mas serve pros outros
  2 tipos igual, já que os três têm exatamente o mesmo esqueleto visual).
- **Prop `text: string`, não `unknown`** — os slots de célula do
  `DataTable` expõem `value: unknown` (chave dinâmica, tipo não conhecido
  em compile-time), então os 3 consumidores que passam o `value` do slot
  direto (`textIcon`/`date`/`activity`) precisam de `String(value)` no
  call site — não é responsabilidade do `IconText` fazer esse narrowing,
  ele só aceita o tipo que já documenta (`string`).
- **Não usado na célula "Title"** (texto apagado sozinho, sem elemento à
  esquerda) nem na "Users" (já é `AvatarGroup`, elemento múltiplo, não
  ícone+texto simples) — só entra onde o padrão "1 elemento à esquerda +
  1 texto" realmente se repete.
- Verificado em browser real: as 3 tabelas da vitrine (produtos,
  variante simples, Table Components) renderizam pixel-idênticas a antes
  da extração — só a duplicação de CSS saiu do arquivo.

## PaginationNav (`shared/components/blocks/PaginationNav.vue`)

Grounded na instância "Pagination" do Figma (`#4113:42236`, ao lado do
frame "Table", reportado pelo usuário em 2026-08-27 a partir de um
screenshot mais completo do mesmo arquivo) — seta anterior/próxima
(`ArrowLineLeft`/`ArrowLineRight`) + até 5 botões de número de página, o
atual destacado com `variant="secondary"` do `Button` (aproxima
`{colors.ink-4}`, "Black/5%" no Figma).

- **Lógica de janela é estado de bloco de verdade, com teste primeiro**
  (test-first obrigatório pra bloco com lógica de estado, seção 11.2 de
  `docs/infra/convencoes-frontend-infra.md` — "emite `update:page` ao
  clicar próximo" é literalmente o exemplo canônico usado na própria
  convenção). Testado em
  `tests/shared/components/blocks/PaginationNav.test.ts`: janela completa
  quando `totalPages` cabe em 5, janela centralizada na página atual
  quando excede, clamp nas bordas (início/fim do intervalo), emissão de
  `update:currentPage` ao clicar num número ou nas setas, setas
  desabilitadas nos limites.
- **Nunca decide o total de páginas/busca dado novo** — só recebe
  `totalPages` e emite a página desejada; quem busca os dados da página
  nova é o composable do módulo consumidor (mesma régua de bloco sem
  regra de negócio).
- Renomeado de "Pagination" (nome do Figma) pra `PaginationNav` durante a
  implementação — `vue/multi-word-component-names` exige nome composto
  pra blocks (a exceção de nome único, seção 3.1, vale só pros átomos de
  `shared/components/ui/`).

## ListToolbar (`shared/components/blocks/ListToolbar.vue`)

Grounded na instância "Function Bar" do Figma (`#4113:42235`) — fundo
`{colors.bg-2}` (aproximação de `#F7F9FB`, mesmo critério de valor fora da
escala sólida já usado no Search/Badge), 3 `Button` `variant="ghost"`
ícone-only (Adicionar/Filtrar/Ordenar — o "Button Group" do Figma **não é
um primitivo próprio**: confirmado no `layout` do Figma que é só 3
`Button` independentes com `gap: 8px`, sem borda compartilhada) + `Search`
embutido.

- **Nome genérico de propósito, não `TableToolbar`** — o mesmo padrão
  "Function Bar" aparece solto em outras telas do Figma, não é exclusivo
  de tabela.
- **Puramente de apresentação, sem estado interno de bloco** — só emite
  `add`/`filter`/`sort` (eventos, sem decidir o que cada ação faz de
  verdade) e repassa o texto de busca via `v-model:search`. Não exige
  test-first (não há lógica de estado além de passthrough), mas foi
  verificado em browser real (clique nos 3 botões, digitação na busca).

**Achado de escopo, não achado técnico**: `Table-B` do Figma (variante
mais simples, sem seleção nem menu de operação por linha — colunas
Title/Assigned to/Time Spend/Status) **não exigiu nenhuma mudança de
código** — já é coberta pela API genérica do `DataTable` (`selectable`
omitido, colunas sem `sortable`), confirmado renderizando o mesmo
componente com esse conjunto de colunas.

**Prop `addDisabled`, pedida direto pelo usuário em 2026-08-31**
(`usePlanLimit`, `docs/planejamento/plano-implementacao.md` — checagem
proativa de `PLAN.max_products`) — `ProductsView.vue` desabilita o botão
"Novo produto" quando o limite do plano já foi atingido, em vez de deixar
o usuário só descobrir isso no 422 do backend. Bloco continua sem regra
de negócio própria: só repassa o booleano já decidido pelo consumidor
pro `Button` interno (`disabled`, nas duas variantes — com ou sem
`addLabel`).

**Props `addable`/`searchable` + slot `#filters`, 2026-09-01, pedido
direto do usuário** ("venho notando uma falta de padrão nos forms,
somente produto tem a filterbar") — até então só `ProductsView.vue`
usava `ListToolbar`; os outros 6 CRUDs admin (Marketplaces/Planos/
Usuários/Notificações/Configurações/Auditoria) tinham caído pra um
header solto (`h1` + `Button`) porque a API deles só tem filtro
enum/boolean (`active`/`role`/`status`/`type`/`billing_cycle`), nunca
texto livre, e `Search` sempre renderizava mesmo sem nenhum campo real
pra buscar. Resolvido sem o bloco aprender sobre domínio (continuaria
violando "block nunca tem regra de negócio", seção 3.2 de
`docs/infra/convencoes-frontend-infra.md`):

- **`searchable`** (default `true`) — esconde `Search` por completo,
  mesmo padrão opt-out de `filterable`/`sortable`.
- **`addable`** (default `true`) — esconde o botão de criar por
  completo (cobre o caso read-only, `AdminAuditLogsView.vue` — sem isso
  um `v-else` ghost "+" sem handler seria botão morto, a régua que já
  motivou `filterable`/`sortable` virarem opt-out em 2026-08-28).
- **Slot `#filters`** — cada view encaixa os próprios `Select`s de
  domínio (`role`/`status`/`active`/`type`/`billing_cycle`); decisão de
  quais opções existem é 100% da view/composable, o bloco só reserva o
  espaço visual (`.ui-toolbar__filters`, `display:flex; gap: {spacing.8};
  flex-wrap: wrap;`) na mesma barra.

Composables (`useAdminMarketplaceList`/`useAdminPlanList`/
`useAdminUserList`/`useAdminNotificationList`/`useAdminSettingList`)
ganharam `<campo>Filter` (ref) + `set<Campo>Filter()` (aplica na hora,
sem exigir clique num botão "Filtrar" — diferente do texto livre de
`useAuditLogList.ts`, que continua exigindo confirmação porque não é
uma escolha discreta). 2 dos services (`listAdminUsers`/`listSettings`)
já aceitavam os params de filtro desde a Fase 6, só nunca tinham UI
conectada; os outros 3 (`listAdminMarketplaces`/`listAdminPlans`/
`listAdminNotifications`) ganharam o param novo junto.

**Achado real, `SelectItem` da Reka UI rejeita `value=""`** — a primeira
versão da opção "Todos" (limpar filtro) usava `value: ''`, e todo
`Select` quebrava com `"A <SelectItem /> must have a value prop that is
not an empty string"` assim que a view montava (string vazia é
reservada internamente pela lib pra "sem seleção"/mostrar o
placeholder) — confirmado em browser real via console do Playwright.
Corrigido trocando o sentinel de "Todos" pra `'all'` em toda opção +
composable (`refFilter.value === 'all' ? undefined : refFilter.value`,
os refs também nascem em `'all'`, não `''`, pra bater com a opção
selecionada por default) — mesmo sentinel em texto literal nos 5 CRUDs,
sem constante compartilhada (KISS, um string bem documentado repetido 5
vezes não justifica um módulo novo). Reverificado depois: os 6 CRUDs
abrem/fecham os `Select`s de filtro sem nenhum erro no console.

Verificado em browser real contra o backend local: os 6 filtros
(`filter[active]`, `filter[billing_cycle]`, `filter[role]`,
`filter[status]` em Usuários E Notificações, `filter[type]` em
Notificações E Configurações, `filter[module]`/`filter[action]` em
Auditoria) disparam a query certa e a tabela atualiza — confirmado via
URL de rede capturada no Playwright pra cada um, não só inspeção visual.

**Achado real, reportado pelo usuário em 2026-09-01 — 2 `Select` de
filtro empilhavam em vez de ficar lado a lado** (`AdminNotificationsView.vue`,
única tela com 2 filtros simultâneos): `Select.vue` define
`.ui-select-wrapper { width: 100%; }` — correto dentro de um `FormGroup`
(o campo deve ocupar a largura toda do formulário), mas herdado sem
alteração nenhuma dentro do `#filters` do `ListToolbar`, onde isso faz
cada `Select` reivindicar 100% do container como `flex-basis`, forçando
o segundo item pra própria linha mesmo sobrando espaço horizontal —
`Input`/`FormGroup` não tinham o mesmo problema (`Input.vue` não fixa
`width: 100%` no wrapper). Corrigido com um `:deep()` escopado só dentro
de `.ui-toolbar__filters` (`width: auto; min-width: 160px;`), mesma
técnica que o próprio arquivo já usa pra travar a largura do `Search`
logo abaixo — nenhuma mudança em `Select.vue` (continua certo pro caso
de formulário). Verificado em browser real: os 2 `Select` de
`AdminNotificationsView.vue` renderizam na mesma linha
(`getBoundingClientRect()` confirmando mesmo `top`, `left` diferente),
160px cada.

**Filtros alinhados à direita, botão de cadastrar fixo à esquerda,
pedido direto do usuário em 2026-09-01** ("deixe todos os selects de
filtros alinhados a direita, dai o botão de cadastrar fica full a
esquerda e os filtros a direita") — `.ui-toolbar__filters` ganhou
`margin-left: auto`, empurrando o slot (e tudo que viesse depois dele
no fluxo — `Search`, se ligado) pra ponta direita da barra;
`.ui-toolbar__actions` (botão de criar) permanece na ponta esquerda por
ser o primeiro filho. Seguro porque **todo** consumidor real do slot
`#filters` já desliga `searchable` (confirmado auditando os 9 usos) —
`Search` nunca compete pelo mesmo espaço.

- **Achado real, descoberto durante a verificação, não causado por esta
  mudança** — `AdminTicketsView.vue` (3 `Select`/`Combobox` + 2
  `DateRangePicker` + botão "Filtrar", o `#filters` mais carregado do
  projeto) vazava pra fora da borda direita do toolbar mesmo ANTES do
  `margin-left: auto` (reproduzido revertendo a mudança e comparando
  `getBoundingClientRect()`: a borda direita dos filtros já batia em
  `1372px` contra um toolbar de `1232px`, um bug pré-existente que só
  ficou mais visível agora). Causa: `.ui-toolbar__filters` tinha
  `flex-shrink: 0` — um item flex que não pode encolher usa seu
  `max-content` (todos os filhos numa linha só) como piso de largura
  dentro do container PAI, ignorando o próprio `flex-wrap: wrap` que ele
  declara pros FILHOS dele. **Corrigido** trocando `flex-shrink: 0` →
  `1` (agora pode encolher) + `min-width: 0` (remove o piso implícito de
  `max-content` que um flex item carrega por padrão) — com os dois, o
  navegador finalmente respeita a largura do `.ui-toolbar` pai e quebra
  os filtros em várias linhas quando não cabem numa só.
- Verificado em browser real, desktop (1280px) e mobile (390px):
  `AdminSubscriptionsView`/`AdminTransactionsView` (sem botão de criar)
  mostram os filtros colados na borda direita com espaço vazio à
  esquerda; `AdminUsersView`/`AdminPlansView` mostram "Novo usuário"/
  "Novo plano" na ponta esquerda e os `Select` na ponta direita, mesma
  linha; `AdminTicketsView` não vaza mais da borda direita
  (`getBoundingClientRect()` confirmando `right: 1224px` dentro de um
  toolbar de `1232px`, antes `1372px`); no mobile, os 3 têm os filtros
  quebrando em linhas próprias sem overflow horizontal.

**Correção real, reportada pelo usuário em 2026-09-01 com 4 screenshots**
("era pra estarem lado a lado alinhado a esquerda, todos ficaram
empilhados") — o `right-align` acima tinha 2 problemas reais que só
apareceram testando telas com `DateRangePicker`/muitos filtros:

1. **`Combobox.vue`/`DateRangePicker.vue` tinham o mesmo `width: 100%`
   no wrapper que `Select.vue` já tinha (e já tinha sido corrigido) —
   nunca corrigido pros dois novos.** Cada `DateRangePicker` reivindicava
   a largura inteira do `.ui-toolbar__filters`, empurrando o próximo
   filtro pra própria linha mesmo sobrando espaço — o efeito visual era
   cada filtro empilhado numa barra esticada, em vez de lado a lado.
   **Corrigido** com o mesmo `:deep()` já usado pro `Select`
   (`.ui-combobox-wrapper`/`.ui-date-range-picker-wrapper`,
   `width: auto` + `min-width` — 160px pro Combobox, igual ao Select;
   280px pro DateRangePicker, cujo conteúdo — 2 datas + separador + 2
   ícones — precisa de mais espaço mínimo).
2. **Right-align (`margin-left: auto`) fazia sentido só quando existe um
   botão de criar competindo pela ponta esquerda** — nas telas
   read-only (`addable="false"`: Auditoria, Chamados admin,
   Assinaturas...), `.ui-toolbar__filters` é o ÚNICO filho do
   `.ui-toolbar`, e right-align deixava uma faixa cinza vazia enorme à
   esquerda com os filtros espremidos numa coluna estreita à direita —
   pior ainda combinado com o problema 1 (`DateRangePicker` esticado
   dentro de uma coluna já estreita). Pedido explícito do usuário:
   **"quando nao tiver o botão de criar novo, faça com q os filtros
   fiquem full"**. Resolvido com `.ui-toolbar__filters:only-child {
   width: 100%; margin-left: 0; }` — sem precisar de uma prop nova no
   bloco, o CSS detecta sozinho quando não há `.ui-toolbar__actions`
   (todo consumidor do slot `#filters` já desliga `searchable`, então
   `.ui-toolbar__filters` nunca disputa esse `:only-child` com `Search`).
   Com os filtros já compactos (correção 1), eles passam a fluir lado a
   lado a partir da borda esquerda (`justify-content` continua o
   default, `flex-start`), preenchendo a barra inteira em vez de uma
   coluna estreita.
- Verificado em browser real: `TicketsView`/`AdminTicketsView` (COM e
  sem botão de criar, respectivamente) mostram os 2 `DateRangePicker`
  lado a lado na mesma linha do `Select` de status (antes, cada um numa
  linha própria esticada); `AdminAuditLogsView`/`AdminSubscriptionsView`
  (sem botão) mostram os filtros começando da borda esquerda, ocupando a
  largura toda, sem mais faixa cinza vazia; `AdminUsersView` (com botão)
  continua com o right-align de antes, inalterado.

**`size="large"` nos botões de criar/"Filtrar", tentado e revertido no
mesmo dia** — pedido inicial do usuário ("os botões de filtrar e criar
novo, deixe com a variant large pra nao ficar tao estranho"),
implementado nos 3 `Button` internos do `ListToolbar` e nos 3 `Button`
"Filtrar" soltos (`AdminAuditLogsView.vue`/`TicketsView.vue`/
`AdminTicketsView.vue`). Revertido pelo próprio usuário logo em seguida
("vamos sem o large, ficou muito muito, deixe os botões como estavam")
— `medium` (default do `Button`, sem prop `size`) é o tamanho definitivo
aqui, apesar de ficar um pouco menor que as caixas de filtro ao lado
(`Select`/`Combobox`/`DateRangePicker`). Registrado pra não reabrir essa
mudança sem motivo novo.

## DropdownMenu (`shared/components/ui/DropdownMenu.vue`)

**Correção sobre a decisão original da Tier 1**: a linha "Form →
`Type=Select-A/B`, Dropdown" tratava "Dropdown" como sinônimo do combobox
`Select.vue` — escrita sem examinar o frame "Dropdown" de verdade do
Figma (`COMPONENT_SET #4113:42552`). Ele não tem valor selecionado nem
trigger de formulário: é um menu de ação (`_Dropdown Item` = ícone +
texto, separador entre grupos), estrutura da família `DropdownMenu*` da
Reka UI, não de `Select*`. Mesma classe de correção já feita pro
`Search.vue` (Tier 4) — grounding contra o Figma real, não contra a
primeira impressão da lista de componentes.

- **Só a variante "Fewer Items" foi implementada** — o Figma também tem
  "More Items" (busca dentro do menu, submenu com seta, item com toggle,
  item com `Badge-Tag` de valor), mas esse conjunto é pensado pra um menu
  de gerenciamento de coluna de planilha (Type/Sort/Filter/Hide/Wrap
  Column/Delete Property), fora do que o Tier 7 pede (menu de ação de
  linha do `DataTable`: Editar/Baixar/Excluir). Escopo revisitável se um
  caso de uso real pedir submenu/busca dentro do menu.
- Item: `{spacing.8}` de padding/gap, `{radius.8}`, hover/highlighted em
  `{colors.ink-4}` (Figma usa "Black/5%", mesma aproximação já usada em
  outros componentes). Ícone 16px (mesmo tamanho de "ícone de apoio" já
  padronizado no Select). Separador: `1px` em `{colors.ink-4}`.
- `backdrop-filter: blur(8px)` no container — aproximação do efeito "BG
  blur 40" do Figma, mesmo critério já usado no Modal/Tooltip (não existe
  token de blur na escala trazida).
- `DropdownMenuPortal` teletransporta pro fim do `<body>`, mesmo achado
  já documentado pro Select/Tooltip/Modal — todas as classes usam
  `:global(...)` com seletor "plano" (nunca `&` aninhado, é o bug real já
  corrigido no Select).
- Verificado em browser real: menu abre com os 3 itens na ordem certa,
  separador antes de "Excluir", clique emite `select` com a `key` do
  item e fecha o menu.

## Breadcrumb (`shared/components/ui/Breadcrumb.vue`)

Grounded no componente "Breadcrumb" do Figma (`#4113:41858`) — item
ancestral é um link apagado (`{colors.ink-40}`, hover `{colors.ink-4}` de
fundo), o último item (página atual) é texto cheio (`{colors.ink}`) sem
link nem hover, separados por `"/"` em `{colors.ink-20}`.

- **Não reaproveita `Button.vue`** — o padding do botão do Figma
  (`4px 8px`) bate com o `variant="ghost"` medium, mas a cor de texto
  varia por posição no breadcrumb (apagado vs cheio), o que não é uma
  variante genérica de Button (seria uma prop nomeada por caso de uso,
  proibido pra átomos — seção 3.1). O item é markup próprio aqui.
- Prop `items: BreadcrumbItem[]` — item sem `to` vira o texto da página
  atual (`aria-current="page"`, sem link); todo item anterior precisa de
  `to` (`RouteLocationRaw`).

## TabBar (`shared/components/ui/TabBar.vue`)

Grounded no padrão "TopTab" do frame "Tabs" do Figma — trigger
`{spacing.4} {spacing.8}`, inativo `14 Regular` em `{colors.ink-40}`,
ativo `14 Semibold` em `{colors.primary}` com sublinhado de 2px na mesma
cor (`[data-state='active']`, sem `TabsIndicator` deslizante — o Figma
mostra sublinhado estático por aba, não um indicador animado). Construído
sobre `TabsRoot`/`TabsList`/`TabsTrigger` da Reka UI.

- **`TabsContent` não é envolvido pelo componente** — o consumidor
  importa direto de `reka-ui` e usa dentro do slot default do `TabBar`,
  já que o conteúdo de cada aba é sempre específico da tela (mesma régua
  de "block/átomo nunca decide o que a ação faz de verdade").
- **"BlockTab" do mesmo frame (rótulos tipo "Total Users"/"Total
  Projects" misturados com `Badge-Tag` de filtro de data) foi marcado
  fora de escopo aqui** — não é navegação de verdade, é um seletor de
  estatística combinado com filtro. **Decisão parcialmente revertida em
  2026-08-28** (ver `BlockTab.vue`, seção própria abaixo): o padrão de
  rótulo clicável sem sublinhado (sem o `Badge-Tag` de filtro, que
  continua sem caso de uso) já tinha uso real dentro do `ChartCard.vue` e
  virou átomo próprio.
- Verificado em browser real: clique na aba troca o painel visível
  (`data-state="active"` no `TabsContent` correto) e o sublinhado
  acompanha a aba clicada.

## BlockTab (`shared/components/ui/BlockTab.vue`)

**Decisão de "fora de escopo" da Tier 8 parcialmente revertida em
2026-08-28** — o usuário perguntou se eu tinha algo sobre "BlockTab" no
que já foi explorado do Figma; a resposta (documentada acima, na seção
`TabBar`) apontou que o próprio `ChartCard.vue` já usava exatamente esse
padrão como seletor de métrica do cabeçalho (`metrics`), com markup/CSS
duplicado dentro do arquivo do gráfico. O usuário pediu a extração.

- **Rótulos clicáveis sem sublinhado, sem painel de conteúdo real** —
  diferente do `TabBar.vue` (`TopTab`, navegação de verdade com
  `TabsRoot` da Reka UI e `role=tab`), aqui não existe conteúdo
  alternando via ARIA: é só "qual opção está ativa agora" (ex.: qual
  métrica alimenta o mesmo gráfico). Por isso não usa nenhum primitivo
  Reka UI — seria simular semântica de navegação que não existe, mesmo
  raciocínio já registrado no `ChartCard.vue` antes da extração.
- **`ChartCard.vue` migrado pra consumir o átomo** — `chart-card__metrics`/
  `chart-card__metric`/`chart-card__metric--active` removidos do arquivo,
  substituídos por `<BlockTab v-model="activeMetric" :options="metrics" />`.
  Mesmos tokens (`{spacing.16}` de gap entre itens, inativo `14 Regular`
  em `{colors.ink-40}`, ativo `14 Semibold` em `{colors.ink}`), zero
  mudança visual — reconfirmado em browser real (seletor de métrica do
  gráfico "Preço sugerido"/"Margem" clicando e trocando o item ativo).
- **`Badge-Tag` de filtro de data do Figma continua fora de escopo** —
  só o rótulo clicável foi extraído; o filtro combinado ("Current Week"/
  "Previous Week") não tem pedido nem caso de uso ainda.
- Tipo `BlockTabOption` (`{ key, label }`) em
  `shared/components/ui/types/blockTab.type.ts` — mesma forma de
  `ChartMetricOption` (`shared/components/blocks/types/chartCard.type.ts`),
  não fundidos num tipo só porque moram em camadas diferentes (átomo
  genérico vs. tipo específico de domínio do `ChartCard`), compatíveis
  estruturalmente sem conversão.

