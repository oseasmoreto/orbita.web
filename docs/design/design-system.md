---
version: 1.0.0
name: Orbita-SnowUI
description: Sistema de design neutro e denso em dado, construído para um dashboard de precificação de marketplace — a cor nunca deve competir com o número. Paleta SnowUI (preto como ação primária, acentos pastel reservados pra estado/categoria), Inter Variable como única fonte, densidade "Standard" de espaçamento/tamanho/raio.

colors:
  primary: "#000000"
  ink: "#000000"
  ink-80: "rgb(0 0 0 / 80%)"
  ink-40: "rgb(0 0 0 / 40%)"
  ink-20: "rgb(0 0 0 / 20%)"
  ink-10: "rgb(0 0 0 / 10%)"
  ink-4: "rgb(0 0 0 / 4%)"
  paper: "#ffffff"
  paper-80: "rgb(255 255 255 / 80%)"
  paper-40: "rgb(255 255 255 / 40%)"
  paper-20: "rgb(255 255 255 / 20%)"
  paper-10: "rgb(255 255 255 / 10%)"
  paper-4: "rgb(255 255 255 / 4%)"
  bg-1: "#ffffff"
  bg-2: "#f9f9fa"
  bg-3: "rgb(255 255 255 / 90%)"
  surface-1: "rgb(255 255 255 / 80%)"
  surface-2: "rgb(0 0 0 / 3%)"
  surface-3: "rgb(0 0 0 / 2%)"
  accent-purple: "#b899eb"
  accent-indigo: "#adadfb"
  accent-blue: "#7dbbff"
  accent-cyan: "#a0bce8"
  accent-mint: "#6be6d3"
  accent-green: "#71dd8c"
  accent-yellow: "#ffcc00"
  accent-orange: "#ffb55b"
  accent-red: "#ff4747"
  tint-1: "#e6f1fd"
  tint-2: "#edeefc"
  logo-1: "#4c98fd"
  logo-2: "#4f507f"

typography:
  micro:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 8px
    fontWeight: 400
    lineHeight: 1.3
  caption:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
  lead:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  title:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  display-sm:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.2
  display-lg:
    fontFamily: "Inter Variable, system-ui, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1

rounded:
  "0": 0px
  "4": 4px
  "8": 8px
  "12": 12px
  "16": 16px
  "20": 20px
  "24": 24px
  "28": 28px
  "32": 32px
  "40": 40px
  "48": 48px
  "80": 80px

spacing:
  "0": 0px
  "4": 4px
  "8": 8px
  "12": 12px
  "16": 16px
  "20": 20px
  "24": 24px
  "28": 28px
  "40": 40px
  "48": 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
    padding: "4px 8px"
  button-primary-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.lead}"
    rounded: "{rounded.8}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.ink-4}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
    padding: "4px 8px"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
    border: "1px solid {colors.ink-10}"
    padding: "4px 8px"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
    padding: "4px 8px"
  text-input:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
    border: "1px solid {colors.ink-10}"
    padding: "8px 16px"
  text-input-labeled:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
    border: "1px solid {colors.ink-10}"
    padding: "16px 20px"
  text-input-invalid:
    backgroundColor: "{colors.bg-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.8}"
    border: "1px solid {colors.accent-red}"
  toggle-track-off:
    backgroundColor: "{colors.ink-20}"
    rounded: "{rounded.80}"
  toggle-track-on:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.80}"
  toggle-thumb:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.80}"
  badge-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.4}"
    padding: "1px 4px"
  badge-gray:
    backgroundColor: "{colors.ink-4}"
    textColor: "{colors.ink}"
    rounded: "{rounded.4}"
    padding: "1px 4px"
  avatar:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.80}"
  tooltip:
    backgroundColor: "{colors.ink-80}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.8}"
    padding: "4px 8px"
  search-idle:
    backgroundColor: "{colors.ink-4}"
    rounded: "{rounded.8}"
    padding: "4px 6px"
  search-hover:
    backgroundColor: "{colors.paper-80}"
    border: "1px solid {colors.ink-10}"
    rounded: "{rounded.8}"
  search-focus:
    backgroundColor: "{colors.paper}"
    border: "1px solid {colors.ink-20}"
    rounded: "{rounded.8}"
  form-group-label:
    textColor: "{colors.ink-40}"
    typography: "{typography.label}"
  form-group-error:
    textColor: "{colors.accent-red}"
    typography: "{typography.label}"
  modal-overlay:
    backgroundColor: "{colors.ink-40}"
  modal-content:
    backgroundColor: "{colors.bg-1}"
    rounded: "{rounded.16}"
    padding: "24px"
  drawer-overlay:
    backgroundColor: "{colors.ink-40}"
  drawer-content-sm:
    backgroundColor: "{colors.bg-1}"
    padding: "24px"
  drawer-content-md:
    backgroundColor: "{colors.bg-1}"
    padding: "24px"
  drawer-content-lg:
    backgroundColor: "{colors.bg-1}"
    padding: "24px"
  data-table-header:
    textColor: "{colors.ink-40}"
    typography: "{typography.label}"
    border: "1px solid {colors.ink-20}"
  data-table-cell:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    border: "1px solid {colors.ink-4}"
  pagination-current:
    backgroundColor: "{colors.ink-4}"
    rounded: "{rounded.8}"
  list-toolbar:
    backgroundColor: "{colors.bg-2}"
    rounded: "{rounded.8}"
    padding: "8px"
  dropdown-menu-content:
    backgroundColor: "{colors.bg-1}"
    rounded: "{rounded.8}"
    padding: "8px"
  dropdown-menu-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.8}"
  breadcrumb-link:
    textColor: "{colors.ink-40}"
    typography: "{typography.body}"
  breadcrumb-current:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  tab-bar-trigger-active:
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  tab-bar-trigger-inactive:
    textColor: "{colors.ink-40}"
    typography: "{typography.body}"
  stat-card:
    rounded: "{rounded.16}"
    padding: "24px"
  stat-card-label:
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
  stat-card-value:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  chart-card:
    backgroundColor: "{colors.bg-1}"
    rounded: "{rounded.16}"
    padding: "24px"
---

## Overview

O Orbita é um dashboard de precificação — a tela existe pra alguém decidir,
rápido, se um preço está dentro da margem. Cor decorativa compete com essa
leitura. Por isso a paleta é **SnowUI**: preto puro como cor de ação
primária (não um azul de marca), e todo o resto do sistema é neutro
(`{colors.bg-1}`/`{colors.bg-2}`, tons de cinza quase-branco) até que um
estado real precise de destaque — aí entra um acento pastel específico
(`{colors.accent-red}` pra erro, `{colors.accent-green}` pra sucesso etc.),
nunca decorativo.

**Características-chave:**
- Ação primária em preto (`{colors.primary}`), não numa cor de marca —
  o preto funciona em qualquer contexto sem competir com o dado ao lado.
- Acentos pastel (`{colors.accent-*}`) reservados a estado/categoria — nunca
  decoração.
- Par semântico `ink`/`paper`: em vez de "preto"/"branco" fixos, são o
  "texto de alto contraste" e o "texto sobre `{colors.primary}`" — o motivo
  do nome (não `black`/`white`) é que os dois **trocam de papel** no modo
  escuro (ver seção Colors).
- Inter Variable como única fonte, ladder de peso deliberadamente curto:
  **400 (Regular) e 600 (Semibold), nada entre os dois** — o token de
  origem (`docs/design/tokens/font-weight/`) só define esses dois pesos.
- Sem sombra/elevação nos tokens de origem — profundidade vem de mudança de
  superfície (`{colors.bg-1}` → `{colors.bg-2}`) e hairline
  (`{colors.ink-10}`), não de `box-shadow` (ver "Known Gaps").

## Colors

> Fonte: `docs/design/tokens/colors/SnowUI-Light.tokens.json` (modo padrão)
> e `SnowUI-Dark.tokens.json` (tokens cabeados em `:root[data-theme='dark']`,
> ligados via toggle real desde 2026-08-28 — `shared/composables/useTheme.ts`,
> botão no `AppHeader`, ver seção Components → AppHeader e "Known Gaps").

### Ação
- **Primary** (`{colors.primary}` — light `#000000` / dark
  `{colors.accent-indigo}` `#adadfb`): único acento de ação do sistema.
  Todo botão primário, todo link, todo indicador de foco usa essa cor —
  nunca uma segunda cor de marca.

### Texto — `ink`/`paper`
- **Ink** (`{colors.ink}` — light `#000000` / dark `#ffffff`): texto de
  alto contraste sobre `{colors.bg-1}`/`{colors.bg-2}`. É o token que o
  Figma chamava de "Black" — renomeado porque ele **vira branco no modo
  escuro**; manter o nome "black" pra um valor que é `#ffffff` seria
  enganoso pra quem lê o código.
- **Paper** (`{colors.paper}` — light `#ffffff` / dark `#000000`): o
  inverso de `ink`, pensado pra texto **sobre** `{colors.primary}`. Por
  construção, `paper` sempre contrasta com `primary` nos dois temas: no
  claro `primary` é preto (texto `paper` branco funciona); no escuro
  `primary` vira indigo claro (texto `paper` preto funciona). É por isso
  que `button-primary` usa `{colors.paper}` sem precisar de um segundo
  token por tema.
- **Rampas de opacidade** (`ink-80/40/20/10/4`, `paper-80/40/20/10/4`):
  variações de transparência do mesmo par — usadas pra hairline
  (`{colors.ink-10}`), texto secundário (`{colors.ink-40}`), disabled
  (`{colors.ink-20}`). As rampas de `ink` no modo escuro não são espelho
  exato do claro (10%→15%, 4%→10%) — o token de origem já compensa
  contraste em fundo escuro, não é erro de transcrição.

### Superfície
- **Background** (`{colors.bg-1}` `#ffffff` / `{colors.bg-2}` `#f9f9fa` /
  `{colors.bg-3}` — 90% opaco): camadas de fundo da página. `bg-1` é o
  fundo padrão, `bg-2` é onde um input/card precisa se diferenciar
  sutilmente do fundo (ver `text-input`), `bg-3` é uma camada quase-opaca
  usada sobre conteúdo (ex: barra fixa).
- **Surface** (`{colors.surface-1/2/3}`): tints translúcidos muito sutis
  (3–4% de opacidade), pensados pra hover/estado, não pra fundo de card —
  não confundir com `background`.

### Acentos (estado/categoria)
`{colors.accent-purple}`, `{colors.accent-indigo}`, `{colors.accent-blue}`,
`{colors.accent-cyan}`, `{colors.accent-mint}`, `{colors.accent-green}`,
`{colors.accent-yellow}`, `{colors.accent-orange}`, `{colors.accent-red}` —
idênticos entre claro/escuro. Cada um existe pra marcar **um** significado
(erro = red, sucesso = green, aviso = yellow) ou uma categoria (ex: chip de
marketplace); nunca dois acentos pro mesmo significado.

### Tokens reservados (uso restrito)
- **`{colors.logo-1}`/`{colors.logo-2}`**: cores do logotipo, marcadas como
  "oculto de publicação" na origem Figma — reservadas pro componente de
  marca (ainda não existe), nunca usadas como cor de UI genérica.
- **`{colors.tint-1}`/`{colors.tint-2}`**: tints decorativos claros, sem
  papel definido ainda nos componentes atuais — documentados aqui pra não
  se perderem, sem uso obrigatório.

## Typography

### Font Family
Uma fonte só, sem par título/corpo: **Inter Variable** (`@fontsource-variable/inter`,
auto-hospedada — nunca Google Fonts CDN, o app é PWA offline-first e o
service worker já faz precache de `woff2`). Fallback:
`system-ui, -apple-system, "Segoe UI", sans-serif`.

**Nome de família é literalmente `"Inter Variable"`, não `"Inter"`** — é
como o pacote `@fontsource-variable/inter` registra o `@font-face`. Usar
`"Inter"` sozinho não bate com nenhuma fonte carregada e cai pro fallback
sem erro nenhum (bug real, pego ao verificar em browser — ver `_tokens.scss`).

### Hierarquia

| Token | Tamanho | Peso | Uso |
|---|---|---|---|
| `{typography.micro}` | 8px | 400 | Legenda jurídica, rodapé denso |
| `{typography.caption}` | 10px | 400 | Chip/tag, metadado secundário |
| `{typography.label}` | 12px | 400 | Label de campo de formulário |
| `{typography.body}` | 14px | 400 | Parágrafo/texto padrão |
| `{typography.body-strong}` | 14px | 600 | Ênfase inline, valor numérico em tabela |
| `{typography.lead}` | 18px | 600 | Subtítulo de seção |
| `{typography.title}` | 24px | 600 | Título de página |
| `{typography.display-sm}` | 36px | 600 | Número grande de destaque (ex: KPI) |
| `{typography.display-lg}` | 48px | 600 | Hero — uso raro num dashboard |

### Princípios
- **Ladder de peso é só 400/600.** Nunca 500, nunca 700 — o token de
  font-weight de origem só define Regular/Semibold. Emphasis é sempre
  Semibold, nunca "um pouco mais forte".
- **Sem letter-spacing customizado.** Token de origem (`font/Inter.tokens.json`)
  define `letter-spacing: 0` — diferente de sistemas tipo Apple/SF Pro que
  usam tracking negativo, aqui é sempre o normal da fonte.
- **Espaçamento de parágrafo = tamanho da própria fonte** (token
  `paragraph/Paragraph.tokens.json`): um `<p>` ganha `margin-bottom` igual
  ao seu `font-size` (mixin `paragraph-spacing($font-size)` em
  `_mixins.scss`). Texto de UI (label, botão) não herda esse espaçamento —
  fica em 0 por padrão (modo "Text" do token de origem).

## Layout

### Espaçamento
Escala "Standard" de `docs/design/tokens/spacing/`: `{spacing.0}` ·
`{spacing.4}` · `{spacing.8}` · `{spacing.12}` · `{spacing.16}` ·
`{spacing.20}` · `{spacing.24}` · `{spacing.28}` · `{spacing.40}` ·
`{spacing.48}`. Nomeado pelo valor em px, não por um nome semântico
(`sm`/`md`/`lg`) — evita a escala do CSS divergir silenciosamente do token
de origem se ele for regenerado.

Existe também uma escala de **tamanho** (`--size-12` até `--size-80`,
mesma densidade Standard) — pra dimensão de ícone/avatar/controle, um eixo
diferente do espaçamento apesar de compartilhar os primeiros valores.

### Breakpoints
**Não vêm de `docs/design/tokens/`** (o export de design não cobre
breakpoint) — mantidos da Fase 0: `$breakpoint-sm` (40rem/640px),
`$breakpoint-md` (64rem/1024px), `$breakpoint-lg` (80rem/1280px).
Mobile-first, sempre `min-width`.

## Elevation & Depth

**Não há token de sombra na origem** (`docs/design/tokens/` não exporta
nenhum grupo de elevação/shadow) — profundidade no sistema atual vem só de:

| Recurso | Tratamento |
|---|---|
| Mudança de superfície | `{colors.bg-1}` → `{colors.bg-2}` diferencia um campo/card do fundo |
| Hairline | Borda 1px em `{colors.ink-10}` (ver `button-secondary`, `text-input`) |
| Estado hover | `filter: brightness(92%)` no botão primário — nunca uma segunda cor fixa |

Se um componente futuro precisar de elevação de verdade (dropdown sobre
conteúdo, modal), isso é uma decisão nova a tomar — não existe token pra
seguir aqui ainda.

## Shapes

### Escala de raio

| Token | Valor | Uso atual |
|---|---|---|
| `{rounded.0}` | 0px | — |
| `{rounded.4}` | 4px | — |
| `{rounded.8}` | 8px | Botão, input — raio padrão de controle |
| `{rounded.12}` | 12px | — |
| `{rounded.16}` | 16px | Reservado pra card (nenhum componente usa ainda) |
| `{rounded.20}`–`{rounded.48}` | 20–48px | Reservados, sem componente ainda |
| `{rounded.80}` | 80px | Reservado pra elemento pill-shaped (badge, chip) |

Todos os 12 valores do token de origem foram trazidos mesmo sem uso atual
— ver seção "Iteration Guide" pra como usar um novo sem inventar valor.

## Components

Só documenta o que **existe de verdade** em `shared/components/ui/`. Cresce
por fase, igual o catálogo do `core/i18n` (`docs/planejamento/plano-implementacao.md`)
— nunca adianta receita de componente que ainda não foi construído.

**Este documento traz só os tokens/princípios fundamentais (Colors,
Typography, Layout, Elevation, Shapes) e as regras não-negociáveis (Do's and
Don'ts, Iteration Guide, Known Gaps). A especificação de cada componente —
tokens usados, variantes, achados reais e histórico de correção — foi
particionada nos arquivos abaixo pra este arquivo não crescer sem limite
(era >6000 linhas, carregado inteiro em toda sessão via `@docs/design/design-system.md`
no CLAUDE.md raiz do frontend). Antes de implementar/alterar QUALQUER
componente ou tela listado abaixo, leia o arquivo correspondente — o índice
aqui é só um mapa, não substitui o conteúdo real.

### Componentes de `shared/` (átomos e blocks)

- Button (`shared/components/ui/Button.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Icon (`shared/components/ui/Icon.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Input (`shared/components/ui/Input.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Textarea (`shared/components/ui/Textarea.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Checkbox (`shared/components/ui/Checkbox.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Toggle (`shared/components/ui/Toggle.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Select (`shared/components/ui/Select.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Combobox (`shared/components/ui/Combobox.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Badge (`shared/components/ui/Badge.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Avatar (`shared/components/ui/Avatar.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Tooltip (`shared/components/ui/Tooltip.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Spinner (`shared/components/ui/Spinner.vue`) — ver `docs/design/components/atoms-and-forms.md`
- Search (`shared/components/ui/Search.vue`) — ver `docs/design/components/atoms-and-forms.md`
- FormGroup (`shared/components/blocks/FormGroup.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- CrudFormActions (`shared/components/blocks/CrudFormActions.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- Modal (`shared/components/ui/Modal.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- ConfirmDialog (`shared/components/blocks/ConfirmDialog.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- Drawer (`shared/components/ui/Drawer.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- DataTable (`shared/components/blocks/DataTable.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- AvatarGroup (`shared/components/blocks/AvatarGroup.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- IconTile (`shared/components/ui/IconTile.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- IconText (`shared/components/ui/IconText.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- PaginationNav (`shared/components/blocks/PaginationNav.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- ListToolbar (`shared/components/blocks/ListToolbar.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- DropdownMenu (`shared/components/ui/DropdownMenu.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- Breadcrumb (`shared/components/ui/Breadcrumb.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- TabBar (`shared/components/ui/TabBar.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- BlockTab (`shared/components/ui/BlockTab.vue`) — ver `docs/design/components/blocks-and-overlays.md`
- Notifiers / Toast (`shared/composables/useToast.ts`) — ver `docs/design/components/feedback-and-data-viz.md`
- NotificationItem (`modules/platform/components/NotificationItem.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- NotificationPanel (`modules/platform/components/NotificationPanel.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- StatCard (`shared/components/blocks/StatCard.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- ProgressBar (`shared/components/ui/ProgressBar.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- ChartCard (`shared/components/blocks/ChartCard.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- DatePicker (`shared/components/ui/DatePicker.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- DateRangePicker (`shared/components/ui/DateRangePicker.vue`) — ver `docs/design/components/feedback-and-data-viz.md`
- TagsInput (`shared/components/ui/TagsInput.vue`) — ver `docs/design/components/feedback-and-data-viz.md`

### Shell do app (`core/layouts/`)

- AppSidebar (`core/layouts/{AppSidebar,AppSidebarContent,AppSidebarNavItem}.vue`) — ver `docs/design/components/shell-and-layout.md`
- AppHeader (`core/layouts/AppHeader.vue`) — ver `docs/design/components/shell-and-layout.md`
- AppFooter (`core/layouts/AppFooter.vue`) — ver `docs/design/components/shell-and-layout.md`
- StatusDot (`shared/components/ui/StatusDot.vue`) — ver `docs/design/components/shell-and-layout.md`

### Telas por módulo (`modules/*`, `shared/views/`)

- PlanCard (`modules/billing/components/blocks/PlanCard.vue`) — ver `docs/design/screens/billing-and-identity.md`
- DocumentPromptModal — removido em 2026-09-02 — ver `docs/design/screens/billing-and-identity.md`
- CompanyForm / CompanyRegistrationView (`modules/identity/components/CompanyForm.vue`, `modules/identity/views/CompanyRegistrationView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- BillingCheckoutResultView (`modules/billing/views/BillingCheckoutResultView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- MySubscriptionView (`modules/billing/views/MySubscriptionView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- TransactionsView (`modules/billing/views/TransactionsView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- AdminSubscriptionsView / OverrideSubscriptionModal (`modules/billing/`) — ver `docs/design/screens/billing-and-identity.md`
- AdminTransactionsView (`modules/billing/views/AdminTransactionsView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- AccountView (`modules/identity/views/AccountView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- DeleteAccountModal (`modules/identity/components/DeleteAccountModal.vue`) — ver `docs/design/screens/billing-and-identity.md`
- Instalar aplicativo / PWA install prompt (`core/pwa/composables/useInstallPrompt.ts`, seção em `AccountView.vue`) — ver `docs/design/screens/billing-and-identity.md`
- ProductLaunchList (`modules/catalog/components/blocks/ProductLaunchList.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- ProductsView (`modules/catalog/views/ProductsView.vue`) — atalho "Ver precificação" — ver `docs/design/screens/catalog-and-pricing.md`
- AdminMarketplacesView (`modules/pricing/views/AdminMarketplacesView.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- AdminMarketplaceForm (`modules/pricing/components/AdminMarketplaceForm.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- MarketplaceLogo (`modules/pricing/components/MarketplaceLogo.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- MarketplacesView (`modules/pricing/views/MarketplacesView.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- ConnectMarketplaceModal (`modules/pricing/components/blocks/ConnectMarketplaceModal.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- ProductMarketplacePricingView (`modules/pricing/views/ProductMarketplacePricingView.vue`) — adendo `coupon` — ver `docs/design/screens/catalog-and-pricing.md`
- ProductMarketplacesView (`modules/pricing/views/ProductMarketplacesView.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- AdminProductCategoriesView / AdminProductCategoryForm (`modules/pricing/views/AdminProductCategoriesView.vue`, `modules/pricing/components/AdminProductCategoryForm.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- AdminCategoryMarketplaceList / AdminCategoryMarketplaceForm (`modules/pricing/components/blocks/AdminCategoryMarketplaceList.vue`, `modules/pricing/components/AdminCategoryMarketplaceForm.vue`) — ver `docs/design/screens/catalog-and-pricing.md`
- NotificationItem/NotificationPanel/NotificationsView (`modules/platform/`) — ver `docs/design/screens/platform-and-support.md`
- useNotificationStore (`core/store/useNotificationStore.ts`) — ver `docs/design/screens/platform-and-support.md`
- AdminNotificationsView (`modules/platform/views/AdminNotificationsView.vue`) — ver `docs/design/screens/platform-and-support.md`
- AdminAuditLogsView (`modules/platform/views/AdminAuditLogsView.vue`) — ver `docs/design/screens/platform-and-support.md`
- AdminUsersView / CreateAdminUserForm / EditUserRoleModal (`modules/identity/`) — ver `docs/design/screens/platform-and-support.md`
- ImpersonationBanner (`core/layouts/ImpersonationBanner.vue`) — ver `docs/design/screens/platform-and-support.md`
- AdminPlansView / AdminPlanForm (`modules/billing/`) — ver `docs/design/screens/platform-and-support.md`
- AdminSettingsView / AdminSettingForm (`modules/platform/`) — ver `docs/design/screens/platform-and-support.md`
- TicketMessageList / TicketThreadPanel / AdminTicketThreadPanel (`modules/support/`) — ver `docs/design/screens/platform-and-support.md`
- PricingDashboardMockupView (`shared/views/PricingDashboardMockupView.vue`) — ver `docs/design/screens/pricing-dashboard-and-help.md`
- ProductMarketplacePricingView (`modules/pricing/views/ProductMarketplacePricingView.vue`) — ver `docs/design/screens/pricing-dashboard-and-help.md`
- HelpView (`shared/views/HelpView.vue`) — ver `docs/design/screens/pricing-dashboard-and-help.md`

## Do's and Don'ts

### Do
- Usar sempre as variáveis SCSS de `core/styles/_variables.scss`
  (`$color-primary`, `$spacing-16`, `$radius-8`...) — nunca um hex/px
  solto no componente. Regra não-negociável (ver
  `docs/infra/convencoes-frontend-infra.md`).
- Usar `{colors.paper}` (nunca uma cor fixa) como texto sobre
  `{colors.primary}` — é o que garante contraste correto se o tema escuro
  for ligado um dia.
- Manter o ladder de peso em 400/600 — emphasis é sempre Semibold.
- Adicionar um novo valor de raio/espaçamento/tamanho só se ele já existir
  na escala Standard trazida aqui — nunca um valor arbitrário fora dela.

### Don't
- Não usar `{colors.ink}`/`{colors.paper}` como se fossem literalmente
  "preto"/"branco" fixos em lógica condicional — eles trocam de valor no
  modo escuro.
- Não inventar uma segunda cor de ação além de `{colors.primary}`.
- Não usar peso 500 ou 700 — não existem no token de origem.
- Não adicionar `box-shadow` decorativo — não existe token de elevação
  ainda (ver "Known Gaps"); se precisar de verdade, é uma decisão nova, não
  uma extensão silenciosa do sistema atual.
- Não usar `{colors.logo-1}`/`{colors.logo-2}` como cor de UI genérica —
  são reservados pro futuro componente de marca.

## Responsive Behavior

### Breakpoints

| Nome | Largura | Fonte |
|---|---|---|
| `$breakpoint-sm` | 40rem (640px) | Mantido da Fase 0 — não coberto pelos tokens |
| `$breakpoint-md` | 64rem (1024px) | Idem |
| `$breakpoint-lg` | 80rem (1280px) | Idem |

Media queries sempre `min-width` (mobile-first) — sem exceção.

## Iteration Guide

1. Referencie o token direto pelo nome (`{colors.ink}`, `{typography.body}`,
   `{rounded.8}`) — nunca copie o valor hexadecimal/px pra dentro de um
   componente.
2. Se o valor que você precisa não existe na escala trazida aqui
   (`spacing`/`rounded`/`size`), ele **existe no export de origem**
   (`docs/design/tokens/`, densidade Standard) mas ainda não foi trazido
   pra `_tokens.scss` — traga o valor que falta, não invente um novo.
3. Variante de componente existente (`-active`, `-invalid`, `-2`...) vira
   uma entrada nova em `components:`, do mesmo jeito que
   `text-input-invalid` é uma variante de `text-input`.
4. Emphasis tipográfico é sempre um salto de peso (400→600), nunca de
   tamanho sozinho.
5. Modo escuro já está cabeado em `[data-theme='dark']` — um componente
   novo não precisa de nenhum código condicional de tema, só use as
   variáveis SCSS normalmente; elas resolvem sozinhas.

## Known Gaps

- **Modo escuro — RESOLVIDO em 2026-08-28**: `shared/composables/useTheme.ts`
  agora liga/desliga `data-theme` em `document.documentElement` (botão de
  tema do `AppHeader`, ver seção Components → AppHeader), persistido em
  `localStorage`. Histórico do gap, mantido por contexto: os tokens
  `SnowUI-Dark` já estavam 100% cabeados em `_tokens.scss`
  (`:root[data-theme='dark']`) desde a Fase 0, só faltava um jeito de
  ligar. **Achado real, mesmo dia, anterior a este composable**: o
  seletor não estava ancorado em `:root` até então — corrigido depois de
  descobrir, via integração do `vue-sonner`, que um atributo
  `data-theme="dark"` de QUALQUER elemento da página (não só a raiz)
  ativava os tokens escuros ali dentro, mesmo sem toggle nenhum ligado
  (ver seção Components → Notifiers/Toast) — sem esse achado anterior, o
  toggle novo teria herdado o mesmo bug (um `data-theme="dark"` de
  qualquer lib de terceiro vazando pro app inteiro em vez de só afetar o
  próprio componente).
- **Sem token de elevação/sombra**: o export de `docs/design/tokens/` não
  inclui nenhum grupo de shadow — qualquer necessidade futura de elevação
  de verdade (modal, dropdown flutuante) exige uma decisão nova, não uma
  extensão silenciosa das regras acima.
- **Uso de `{colors.logo-1}`/`{colors.logo-2}` ainda indefinido**: trazidos
  pra não se perderem do export original, mas nenhum componente os
  consome hoje. `{colors.tint-1}`/`{colors.tint-2}` já têm um primeiro
  papel real desde 2026-08-27 (tile de ícone do `NotificationItem`, fundo
  de card do `StatCard`, seção Components acima) — aproximação, não valor
  exato do Figma.
- **`{colors.tint-1}`/`{colors.tint-2}` não têm variante pro tema
  escuro** — o export de origem só define um valor (claro) pros dois,
  sem par `[data-theme='dark']` como o resto da paleta. Achado real ao
  simular `data-theme="dark"` no `StatCard` (2026-08-27): o fundo
  continua claro (correto, é o mesmo valor único do token), mas o texto
  em cima usa `{colors.ink}`, que troca pra branco no tema escuro — texto
  branco sobre fundo claro, ilegível. **Sem impacto hoje** (não existe
  toggle de tema em produção ainda, ver gap logo abaixo), mas quem for
  ligar o toggle precisa resolver isso antes: ou definir um par escuro de
  verdade pra `tint-1`/`tint-2` (não inventado por nós — puxar do export
  de origem quando existir) ou trocar `{colors.ink}` por um tom fixo que
  não acompanhe o tema nos textos que ficam em cima desses tints
  especificamente.
- **Escala tipográfica não foi validada em tela de verdade**: os nomes de
  papel (`lead`, `title`, `display-sm`...) são um mapeamento razoável dos 8
  tamanhos do token `paragraph/Paragraph.tokens.json` pros papéis comuns de
  um dashboard — nenhuma tela usa `display-lg`/`display-sm` ainda, então o
  encaixe real só se confirma quando uma tela precisar de um KPI grande de
  verdade.
- **Gap "sem card/tabela/badge" — RESOLVIDO há tempos, bullet ficou
  esquecido aqui**: `Badge`/`DataTable`/`StatCard`/o padrão de "seção com
  borda" (`{radius.16}`) já existem e são usados extensivamente desde as
  Fases 1-9. A dashboard de precificação (Fase 4) tem tanto o rascunho
  VISUAL mockado (`PricingDashboardMockupView.vue`, seção própria acima,
  2026-09-02, sem dado real) quanto — desde 2026-09-03 — uma tela REAL
  por conexão (`ProductMarketplacePricingView.vue`, seção própria acima):
  `PricingCalculator` antigo nunca foi conectado a rota nenhuma, mas o
  motor novo (`ProductMarketplacePricingCalculator`, backend) já está.
  Listagem/cálculo funcionam contra a API de verdade; só a edição do
  preço praticado tem um bug real do backend ainda aberto (ver seção
  `ProductMarketplacePricingView` acima).
- **Os quase 2600 ícones gerados não foram revisados um a um
  visualmente** — a estrutura é uniforme e validada programaticamente
  (todo `<path>`/`<circle>` extraído, `fill` trocado por `currentColor`
  exceto cor explícita preservada, viewBox por ícone), mas não há como
  conferir manualmente cada pictograma individual. Se um ícone específico
  renderizar errado, o bug mais provável é no SVG de origem, não no
  gerador.
- **`Loading1` (`docs/icons-snow-ui/Loading-1.svg`) perde o efeito de
  gradiente cônico** — o Figma exportou esse spinner com um hack de
  `foreignObject`/`conic-gradient` que não é um `<path>`/`<circle>` de
  verdade; o gerador ignora esse elemento (não tem como reproduzir gradiente
  cônico com a factory atual) e mantém só o anel sólido de fallback que o
  próprio SVG já trazia — degrada bem (não quebra), só perde o fade.
