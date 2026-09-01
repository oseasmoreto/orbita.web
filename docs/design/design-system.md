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

### Button (`shared/components/ui/Button.vue`)

**Reimplementado em 2026-08-27 contra a spec real do componente `Button`
do Figma** (`docs/design/catalogo-componentes.md`, seção 1) — a versão
anterior tinha `size: sm/md/lg` e `variant: primary/secondary/ghost/danger`
inventados, sem checar o Figma. Variantes via prop `variant`
(`primary`/`secondary`/`outline`/`ghost` — **sem `danger`**, o Figma não
define essa variante), tamanho via prop `size` (`medium`/`large` — **sem
`sm`**, o Figma só tem os dois).

- **`primary`**: fundo `{colors.primary}`, texto `{colors.paper}`. Hover:
  `--color-primary-hover` (`#494949` no modo claro) — **não** dá pra usar
  `filter: brightness()` aqui, preto puro (`#000000`) não clareia com esse
  filtro (0 × qualquer fator continua 0); achado real, o botão antigo não
  tinha efeito de hover nenhum. Disabled: fundo `{colors.ink-4}`, texto
  `{colors.ink-40}` — o Figma troca o fundo inteiro pro cinza quase-branco
  do Secondary, não só reduz opacidade.
- **`secondary`**: fundo `{colors.ink-4}` (Figma usa "Black/5%", nosso
  token mais próximo é 4% — a escala não tem 5%). Hover: `{colors.ink-10}`.
  Disabled: mesmo fundo do default, só o texto vira `{colors.ink-40}`.
- **`outline`**: sem fundo, borda `1px solid {colors.ink-10}`. Hover:
  ganha fundo `{colors.ink-4}`. Disabled: mesmo tratamento do secondary.
- **`ghost`**: sem fundo, sem borda. Hover: `{colors.ink-4}`. Disabled:
  idem.
- **Tamanhos**: `medium` → padding `{spacing.4} {spacing.8}`,
  `{typography.body}` (14/400) — altura nasce do padding + line-height, não
  é um valor fixo. `large` → padding `{spacing.8} {spacing.16}`,
  `{typography.lead}` (18/600).
- **Ícones** (`icon-before`/`icon-after`, aceitam qualquer componente de
  `shared/components/icons/`): tamanho do ícone é **20px no `medium`,
  28px no `large`** — medido direto no Figma (padding + ícone = altura
  desenhada: `4+20+4=28`, `8+28+8=44`), diferente do ícone de apoio de
  Select/Date (16px, ver seção Components → Select mais abaixo quando
  existir). Sem texto no slot padrão + 1 ícone = variante "Icon Only" do
  Figma, vira padding quadrado uniforme automaticamente.
- **Disabled**: `cursor: not-allowed` (tratamento de cor é por variante,
  acima — não é `opacity: 0.5` genérico como na versão anterior).
- **Focus**: outline 2px `{colors.primary}`, offset 2px (mixin `focus-ring`).

### Icon (`shared/components/ui/Icon.vue`)

Wrapper fino sobre um componente de ícone — recebe o componente via prop
`icon` (nunca um mapa nome→ícone), `size` (número/string, default 20). Duas
fontes de ícone convivem:

- **`@lucide/vue`** — ícones stroke-based genéricos, `Icon.vue` passa
  `stroke-width` fixo em 1.75 pra eles.
- **Conjunto próprio do design system** (`shared/components/icons/`),
  gerado via `npm run generate:icons` (`scripts/generate-icons.mjs`) a
  partir de três exports do Figma:
  - `docs/icons-regular/` (1 tom, 1248 ícones) — conteúdo genérico
    (pictogramas, logos de marca, setas...). Todos os SVGs exportados,
    exceto 19 banners de categoria exportados por engano (texto renderizado
    como path, não um ícone: `Arrows`, `Brands`, `Commerce`,
    `Communication`, `Design`, `Development`, `Education`, `Games`,
    `Header`, `Health & Wellness`, `Maps & Travel`, `Math & Finance`,
    `Media`, `Office & Editing`, `People`, `Security & Warnings`,
    `System & Devices`, `Time`, `Weather & Nature`).
  - `docs/icons-duotone/` (2 tons — mesma cor em duas opacidades, nunca
    duas cores — 1248 ícones), mesmo conteúdo do regular em outro estilo.
  - `docs/icons-snow-ui/` (101 ícones) — iconografia própria do kit SnowUI:
    mistura ícones de conteúdo genérico (`Search`, `Close`, `Add`, `Star`,
    `Help`...) com **swatches de estado de controle de UI**
    (`Checkbox`/`Checkbox-1`...`8`, `Toggle`/`Toggle-1`...`5`,
    `Radio`/`Radio-1`...`5` — cada número é um estado visual diferente do
    mesmo controle: vazio, hover, marcado, focado...) e specs de
    tamanho/estilo (`IconSize-N`, `Icon-N`). Gerados como ícones normais
    (não são texto, respeitam a regra de inclusão), mas **não são conteúdo
    genérico** — servem de referência visual pra quando `Checkbox.vue`/
    `Toggle.vue`/`Radio.vue` forem construídos de verdade (ainda não
    existem), não pra uso solto num botão/menu qualquer.

Nenhuma das três fontes tem cor própria por padrão — herdam `color` do
elemento pai via `currentColor`. Exceção de propósito: alguns ícones de
`docs/icons-snow-ui/` (cutout de checkbox/toggle marcado) têm uma segunda
cor literal (`fill="white"`) preservada tal como veio do Figma — o gerador
só substitui por `currentColor` a cor placeholder padrão (`#1C1C1C`),
qualquer outra cor explícita do SVG de origem é mantida.

**Regra não-negociável de import — nunca por namespace:**

```ts
// ✅ Certo — tree-shake elimina os outros 1247 ícones do bundle
import { Check } from '@/shared/components/icons/regular.generated'

// ❌ Errado — bundler não consegue eliminar o resto do módulo ao acessar
// propriedade de um namespace; um `IconsRegular.Check` sozinho já infla o
// chunk de ~1kB pra ~2.4MB (achado real, medido em build de verdade — ver
// docs/planejamento/plano-implementacao.md)
import { IconsRegular } from '@/shared/components/icons'
```

`shared/components/icons/index.ts` de propósito **não** reexporta os
ícones por esse motivo — só `createIcon`/`IconElement` (uso interno do
gerador). `regular.generated.ts`/`duotone.generated.ts`/`snow-ui.generated.ts`
são gerados, nunca editados à mão (mesmo espírito de `core/api/schema.d.ts`)
— rodar `npm run generate:icons` de novo sempre que `docs/icons-regular/`/
`docs/icons-duotone/`/`docs/icons-snow-ui/` mudarem. O gerador tolera pasta
de origem ausente (pula com aviso, mantém o `.generated.ts` já existente) —
`docs/icons-regular/`/`docs/icons-duotone/` já foram removidas do disco
depois de geradas (só o resultado importa, o export bruto do Figma não
precisa ficar versionado pra sempre).

### Input (`shared/components/ui/Input.vue`)

**Reimplementado em 2026-08-27 contra a spec real do Figma** — a versão
anterior usava `{colors.bg-2}` como fundo; o componente real do Figma
(`Type=Input-A`/`Input-B`, dentro do frame "Form") usa fundo
**`{colors.bg-1}` (branco), não `bg-2`**.

- **Input-A** (sem prop `label` — campo isolado): padding
  `{spacing.8} {spacing.16}`, altura fixa por padding+line-height (não um
  valor hardcoded), `{typography.body}`.
- **Input-B** (com prop `label` — campo com rótulo dentro da mesma caixa):
  padding `{spacing.16} {spacing.20}`, altura por conteúdo, label em
  `{typography.label}` (12px) na cor `{colors.ink-40}` acima do valor —
  mesmo padrão visual dos outros campos do frame "Form" do Figma
  (`Select`, `Date`, `Switch`, `Tags`).
- Ambos: fundo `{colors.bg-1}`, borda `1px solid {colors.ink-10}`,
  `{rounded.8}`.
- **`invalid`** (prop): borda vira `1px solid {colors.accent-red}` — a
  borda mora no wrapper (`:has(.ui-input--invalid)`), não no `<input>` em
  si, porque a variante `label` precisa de um wrapper compartilhado pro
  label + campo caberem na mesma caixa.
- **Disabled**: `opacity: 0.5`, `cursor: not-allowed`.
- **Focus**: mesmo `focus-ring` do botão, aplicado ao wrapper via
  `:has(.ui-input:focus-visible)`.

**Bug sistêmico real, 2026-09-01 (Fase 6)** — descoberto testando
`AdminPlanForm.vue` (campo `price`, `79.90`) em browser real: `<input
type="number">` sem `step` tem `step` nativo `1` por padrão. Todo botão
de submit de CRUD (`CrudFormActions.vue`) é `type="submit"` de verdade —
a validação de CONSTRAINT NATIVA do browser (`step mismatch`) bloqueava o
`submit` ANTES do `@submit.prevent` do form rodar, silenciosamente (só um
tooltip nativo do browser, "Please enter a valid value...", nenhum toast
da aplicação). Afetava qualquer campo numérico decimal do app inteiro
(`ProductForm.vue` — `purchasePrice`/`fullSalePrice`/`targetMargin`,
`AdminPricingRuleForm.vue`), não só o formulário novo — nunca pego antes
porque o dado de teste desses forms sempre foi seedado via tinker, nunca
digitado e submetido de verdade pelo browser. Corrigido com
`:step="type === 'number' ? 'any' : undefined"` no `<input>` — o Zod de
cada form já é a fonte de verdade real pra inteiro-vs-decimal
(`.int()` quando faz sentido), o `step` do HTML nunca deveria ser mais
restritivo que isso.

### Textarea (`shared/components/ui/Textarea.vue`)

**Pedido direto pelo usuário em 2026-09-01** ("crie um componente de
textarea pq esses inputs tao paia pra texto grande") — até então
qualquer campo de texto livre mais longo (mensagem de chamado, resposta
de thread — `modules/support/`) usava `Input.vue`, sempre uma linha só.
Sem frame próprio no Figma pra "Textarea" — mesmo tratamento visual de
Input-A/B (padding/borda/fundo/`{rounded.8}`, variante `label` "boxed"),
só trocando `<input>` por `<textarea>`.

- **Auto-grow, sem alça de resize manual** (`resize: none` no CSS) —
  cresce junto com o conteúdo (`el.style.height` recalculado a cada
  `input`, via `scrollHeight`) até `maxRows` (prop, default 8), depois
  rola internamente (`max-height: calc(maxRows * 1.5 * font-size)`,
  `overflow-y: auto`). Prop `rows` (default 3) é só a altura INICIAL,
  antes de qualquer digitação — `useTemplateRef` (Vue 3.5+, mesma versão
  já usada no projeto) em vez do padrão antigo de função-ref, mais
  simples de tipar.
- **Sem prop de "enviar com Enter"** — decisão de propósito: isso é
  comportamento de CONSUMIDOR (faz sentido pro composer de um chat,
  nunca pra um campo de formulário comum como "Mensagem" na abertura de
  chamado), não do átomo. Quem quiser esse comportamento usa
  `@keydown.enter.exact.prevent="handler()"` no consumidor — o
  `.exact` garante que só Enter puro dispara, Shift+Enter continua
  inserindo quebra de linha normalmente (evento de teclado bubbla do
  `<textarea>` interno pro wrapper, onde o listener herdado por
  fallthrough de atributos do Vue já pega — mesmo mecanismo que
  `@keyup.enter` em `Input.vue` já usava noutras telas).
- **Sem `iconBefore`** (diferente de `Input.vue`) — nenhum consumidor
  real pediu ícone dentro de uma área de texto multi-linha; adicionar
  isso sem caso de uso seria abstração antecipada.
- Consumidores reais: `CreateTicketForm.vue` (campo "Mensagem", `rows=5`)
  e o composer das 2 threads de chamado (`TicketThreadPanel.vue`/
  `AdminTicketThreadPanel.vue`, `rows=1` — cresce a partir de uma linha
  só, como um composer de chat de verdade).
- Verificado em browser real: `scrollHeight` cresce de ~40px (1 linha)
  pra >100px depois de 3 linhas de texto digitadas, sem alça de resize
  visível; `Shift+Enter` insere quebra de linha sem disparar envio,
  `Enter` puro envia e limpa o campo.

### Checkbox (`shared/components/ui/Checkbox.vue`)

Construído sobre `CheckboxRoot` da Reka UI. **Os ícones de estado são os
próprios assets do design system** (`docs/icons-snow-ui/Checkbox*.svg`,
já gerados em `shared/components/icons/snow-ui.generated.ts`) — não é
ilustração de referência, é o componente renderizado com o asset final:
`Checkbox` (vazio), `Checkbox3` (indeterminado), `Checkbox6` (marcado),
e as variantes `2`/`5`/`8` pros mesmos três estados quando `disabled`.
Hover (`Checkbox1`/`4`/`7`) não é usado — não troca de ícone no hover, só
o cursor muda.

- Prop `label` (opcional): texto clicável ao lado, alterna o estado (não é
  um `<label>` nativo porque `CheckboxRoot` renderiza um `<button>`, que o
  HTML não associa automaticamente a um `<label>`).
- Tipo do model é `boolean | 'indeterminate'` — o mesmo tipo nativo do
  `CheckboxRoot`, sem prop bridging.
- **Focus**: `focus-ring` no botão interno.
- **Fix de contraste em tema escuro, 2026-08-28** — reportado pelo
  usuário testando o toggle de tema recém-implementado (`AppHeader`):
  `Checkbox3`/`Checkbox6` (indeterminado/marcado) vêm do Figma com o
  traço interno em `fill="white"` LITERAL (não `currentColor`) — no
  claro isso contrasta contra a caixa (que herda `currentColor` = ink =
  preto), mas no escuro a caixa também vira branca (`currentColor` = ink
  = branco) e o traço branco literal fica invisível contra ela (checkbox
  "marcado" virava um quadrado branco sem check nenhum visível). Os SVGs
  são gerados e o export de origem (`docs/icons-snow-ui/`) já foi
  removido do disco depois de gerado — não dá pra corrigir na fonte.
  Corrigido no consumidor: `.ui-checkbox :deep(svg path[fill='white']) {
  fill: $color-paper; }` — CSS de stylesheet vence o atributo de
  apresentação inline do SVG, e `$color-paper` já é o token certo pra
  "texto/traço sobre uma área preenchida com ink" (ver seção Colors),
  resolvendo nos dois temas sem tocar no arquivo gerado. Confirmado via
  `getComputedStyle` no traço interno: `rgb(0, 0, 0)` no tema escuro
  (antes: branco sobre branco).

### Toggle (`shared/components/ui/Toggle.vue`)

Construído sobre `SwitchRoot`/`SwitchThumb` da Reka UI, **estilizado via
CSS** (trilho + thumb com transição), não com os ícones planos de
`docs/icons-snow-ui/Toggle*.svg` — um ícone plano não anima a transição
do thumb deslizando, e o primitivo Reka UI já resolve o trilho/thumb como
dois elementos estilizáveis separadamente (é o padrão idiomático da lib,
"só estiliza via SCSS/props em cima do que a lib já resolve" — seção 3.1
de `docs/infra/convencoes-frontend-infra.md`). Os ícones do Figma
continuam servindo de referência visual de proporção/cor, só não são
renderizados diretamente.

- Trilho: `{size.40}` × `{size.20}`, `{rounded.80}` (pill), fundo
  `{colors.ink-20}` (off) / `{colors.primary}` (on).
- Thumb: `{size.16}`, círculo `{colors.paper}`, translada 2px→22px via
  `data-state` que o Reka UI já expõe.
- **Dimensões não verificadas no Figma** (rate limit da API bateu antes de
  medir esse componente) — construídas a partir da escala de tamanho já
  existente, proporção comum de toggle. Revisar quando o Figma voltar a
  responder (ver `docs/design/catalogo-componentes.md`).

**Variante "boxed" (`title`), pedida direto pelo usuário em 2026-08-28
com captura real do Figma** — faltava a variante do switch dentro da
mesma caixa com borda usada por Input-B/Select-B/DatePicker rotulado
(legenda em cima, `{colors.ink-40}`, `{typography.label}`; caixa
`{colors.bg-1}` + borda `{colors.ink-10}` + `{radius.8}` + padding
`{spacing.16} {spacing.20}`, mesmos tokens dos outros campos do frame
"Form"). Implementada como um novo prop `title` (não `label`) de
propósito: `label` já é o texto clicável ao lado do switch (mesmo papel
do `label` de `Checkbox.vue`, ex.: "Allowed" na captura do usuário) —
reaproveitar o mesmo nome pra dois conceitos diferentes no mesmo
componente (a legenda de cima vs. o texto do lado) confundiria os dois.
Os dois props são combináveis: `title="Title"` + `label="Allowed"`
reproduz exatamente a captura enviada. Sem `title`, o wrapper novo
(`.ui-toggle-wrapper`) fica transparente (sem padding/borda) — o switch
solto de antes continua pixel-idêntico, nenhuma das 3 instâncias
existentes na vitrine precisou mudar. Verificado em browser real: caixa
renderiza igual à captura, clicar no texto "Allowed" (ou no próprio
switch) continua alternando o estado normalmente.

### Select (`shared/components/ui/Select.vue`)

Construído sobre a família `Select*` da Reka UI (`SelectRoot`,
`SelectTrigger`, `SelectContent` via `SelectPortal`, `SelectItem`...).
Mesmo tratamento visual do Input (fundo `{colors.bg-1}`, borda
`{colors.ink-10}`, `{rounded.8}`) — variantes Input-A/Input-B (prop
`label`) se aplicam igual.

- Ícone do trigger: `CaretUpDown` de `icons/regular.generated` — o Figma
  usa um ícone chamado "ArrowLineUpDown" que **não existe** no export de
  `docs/icons-regular/` (gap real, não um erro de nomeação nosso).
- **Achado real**: `SelectContent` é teletransportado (`SelectPortal`)
  pra fora da árvore do componente, direto pro fim do `<body>` — o
  atributo de escopo do Vue (`data-v-xxx`) não alcança esse conteúdo, e
  as classes `.ui-select-content`/`.ui-select-viewport`/`.ui-select-item`/
  `.ui-select-scroll`/`.ui-select-item-indicator` ficam sem nenhum estilo
  se declaradas num `<style scoped>` normal. Corrigido envolvendo essas
  regras em `:global(...)` — técnica documentada do próprio Vue pra esse
  cenário exato (portal/teleport + scoped style). Confirmado inspecionando
  o DOM real antes e depois da correção, não só inferido.
- **Achado real, reportado pelo usuário em 2026-08-27**: toda opção do
  dropdown aparecia com a cor "apagada" de disabled (`{colors.ink-40}`),
  mas continuava clicável/selecionável normalmente — a aparência e o
  comportamento divergiam. Causa: dentro do bloco `:global(.ui-select-item)`,
  as regras aninhadas com `&` (`&:focus-visible`, `&[data-highlighted]`,
  `&[data-disabled]`) perdem a referência ao seletor-pai quando compiladas
  — o CSS final virava só `.ui-select-item { color: ... }` **sem** o
  atributo (`[data-disabled]` desaparecia por completo, não ficava só sem
  o escopo), então a regra de "disabled" se aplicava a toda opção,
  habilitada ou não. Confirmado inspecionando `document.styleSheets` direto
  (a regra compilada realmente não tinha o atributo). **Corrigido**
  reescrevendo como seletores "planos" — `:global(.ui-select-item[data-disabled])`
  em vez de `&[data-disabled]` aninhado dentro de `:global(.ui-select-item)`
  — sem depender do `&` do Sass dentro de um bloco `:global()`. Reconfirmado
  depois: cor da opção habilitada volta a `rgb(0,0,0)` (`{colors.ink}`).
  Vale como regra geral daqui pra frente: **nunca aninhar `&[attr]`/`&:pseudo`
  dentro de um `:global(...)` do Vue** — sempre escrever o seletor completo
  dentro do próprio `:global(...)`.

### Combobox (`shared/components/ui/Combobox.vue`)

**Sem frame próprio no Figma** — pedido direto pelo usuário em
2026-09-01, junto com o achado de um bug real (ver abaixo), pra resolver
o caso "lista de opções grande demais pra rolar" (ex.: escolher 1
usuário entre uma centena, digitando pra filtrar). Construído sobre a
família `Combobox*` da Reka UI (`ComboboxRoot`/`ComboboxAnchor`/
`ComboboxInput`/`ComboboxTrigger`/`ComboboxContent` via `ComboboxPortal`/
`ComboboxItem`/`ComboboxEmpty`) — mesmo primitivo já citado nominalmente
desde a Tier 0 (`docs/infra/convencoes-frontend-infra.md` seção 3.1:
"componente com comportamento complexo... `Combobox`... construído em
cima do primitivo headless equivalente da Reka UI"), nunca implementado
até agora por falta de caso de uso real.

- **Não substitui `Select.vue`** — mesmo shape de props/`SelectOption`,
  mesmos tokens visuais (caixa/borda/raio idênticos, variante `label`
  "boxed" também disponível), mas o trigger vira um campo de texto
  digitável em vez de um botão. `Select.vue` continua sendo a escolha
  padrão pra lista curta/enumerada (status, role, ciclo de cobrança) —
  `Combobox.vue` é só pra picker com lista grande/dinâmica (usuário,
  plano — alimentado por `useAdminUserOptions`/`useAdminPlanOptions`).
- **Filtro nativo da Reka UI** (`useFilter({ sensitivity: 'base' })`,
  Intl `Collator`) — busca case-insensitive E ignora acento
  (`sensitivity: 'base'` da ICU collation), então digitar "joao" já
  encontra "João" sem nenhum tratamento manual de string no componente.
- `displayValue` (prop do `ComboboxInput`) resolve o texto exibido a
  partir do `value` selecionado (`options.find(...).label`) — o model
  público continua sendo só a string do `value`, igual ao `Select.vue`,
  nunca o objeto inteiro da opção.
- Mesmos achados de portal/`:global()` já documentados em `Select.vue`
  (`ComboboxPortal` teletransporta `ComboboxContent` pro fim do
  `<body>`, seletores sempre "planos" dentro do `:global()`, nunca
  `&[attr]` aninhado) — aplicados de propósito desde a primeira versão,
  não descobertos de novo por tentativa e erro.
- `z-index: 200`, mesmo motivo do `Select.vue`/`DatePicker.vue` (precisa
  ficar acima de `Modal.vue`/`Drawer.vue`).

**Achado real, motivou a criação do componente**: `AdminSubscriptionsView.vue`/
`AdminTransactionsView.vue`/`AdminTicketsView.vue` (Fase 9) tinham
misturado `Select` **com** `label` (variante "boxed", caixa mais alta)
ao lado do `Select` de status **sem** `label` (compacto) na mesma
`ListToolbar` — renderizava com alturas diferentes na mesma linha,
lendo como bug visual (reportado pelo usuário com screenshot: "veja um
exemplo de como ficou bugado").

**Primeira correção, revertida no mesmo dia** — a 1ª tentativa tirou o
`label` dos pickers de usuário/plano/respondido-por pra bater com o
`Select` de status (que nunca tinha tido `label`). O usuário corrigiu o
raciocínio: **"eu preferia q vc adicionasse o label nos q faltaram do
q tirar, pq se nao o usuario nao sabe o q vai filtrar, sempre coloque
label nos campos em todos"** — tirar label resolve a altura, mas piora a
identificação (2+ caixas mostrando só "Todos", indistinguíveis antes de
abrir). **Regra definitiva, sem exceção**: todo filtro de `ListToolbar`
(`Select`/`Combobox`/`Input`) sempre tem `label` — nunca o inverso
(remover de um pra bater com outro que não tem). Auditoria completa da
Fase 9 nesse critério, `label` adicionado onde faltava em **10 telas**:
`AdminSubscriptionsView` (status/usuário/plano),
`AdminTransactionsView` (status/usuário), `AdminTicketsView`
(status/usuário/respondido por), `TicketsView` (status),
`AdminPlansView` (ciclo de cobrança), `AdminSettingsView` (tipo),
`AdminNotificationsView` (tipo/status), `AdminMarketplacesView`
(status), `AdminUsersView` (perfil/status) — `AdminAuditLogsView` já
estava correto (todo filtro ali sempre teve `label`, incluindo o
`Combobox` desde a criação). Verificado em browser real, tela a tela:
todas as caixas de filtro de cada `ListToolbar` mostram legenda visível
e mesma altura entre si.

Verificado em browser real: as 3 caixas de filtro de
`AdminSubscriptionsView` (status/usuário/plano) medem a mesma altura
(`35px` nos três, via `getBoundingClientRect()`); digitar "combobox" no
picker de usuário filtra a lista pra só o item que contém o texto
(sensível a substring, testado com um usuário de teste real); selecionar
um item atualiza o texto exibido no campo corretamente.

### Badge (`shared/components/ui/Badge.vue`)

- **`ghost`**: sem fundo, texto `{colors.ink}`.
- **`gray`**: fundo `{colors.ink-4}` (aproximação do "Black/5%" do Figma
  pro token mais próximo da escala, mesmo critério já usado no
  `button-secondary`).
- **Tamanhos**: `sm` → `{typography.caption}` (10px); `md` →
  `{typography.label}` (12px, default).
- Padding medido no Figma: `1px {spacing.4}` — o `1px` vertical é um valor
  real do componente de origem, não arredondado pra escala de 4px (a
  escala de espaçamento não tem um degrau de 1px, e não é caso de "traga o
  valor que falta" — aqui é o próprio componente que usa um valor fora da
  escala geral, só documentado tal como é).
- `icon-before`/`icon-after` (mesmo padrão do Button): ícone fixo em 12px,
  não escala com `size`.

### Avatar (`shared/components/ui/Avatar.vue`)

- Círculo (`{rounded.80}`), fundo `{colors.bg-2}`, iniciais em
  `{typography.label}` semibold, cor `{colors.ink}`.
- **`USER` não tem campo de foto** (`docs/negocio/contexto-plataforma-precificacao.md`
  seção 2.1) — o fallback de iniciais (`AvatarFallback` da Reka UI) é o
  caminho normal do produto, não uma exceção rara de erro de carregamento.
  `src` continua aceito (planos futuros podem adicionar foto), mas hoje
  todo consumidor real passa só `name`.
- Tamanho via prop `size` (px), default 32 — sem variantes fixas
  `sm`/`md`/`lg`, porque o Figma usa o mesmo componente em vários tamanhos
  ad-hoc (dropdown de usuário, lista de contatos), não uma escala fechada.

### Tooltip (`shared/components/ui/Tooltip.vue`)

Construído sobre `TooltipProvider`/`TooltipRoot`/`TooltipContent` (via
`TooltipPortal`) da Reka UI.

- Fundo `{colors.ink-80}` (match exato com "Black/80%" do Figma), texto
  `{colors.paper}`, `{typography.label}` (12px), padding
  `{spacing.4} {spacing.8}`, `{rounded.8}`.
- Prop `shortcut` opcional (ex.: `"⌘N"`) — espelha a propriedade "Show
  Shortcut" do componente Figma; texto do atalho em `{colors.paper-40}`.
- `backdrop-filter: blur(8px)` — o Figma usa um efeito "BG blur 40" atrás
  do tooltip; não existe token de blur na escala trazida, então o valor é
  uma aproximação visual (glassmorphism sutil), não uma medida exata.
- **Achado real, mesma classe do Select**: `TooltipContent` também é
  teletransportado via `TooltipPortal` — todas as classes (`.ui-tooltip`,
  `.ui-tooltip__shortcut`) precisam de `:global(...)`.

**Primeiro consumidor real com ícone (não `Button`) como trigger**,
`ProductForm.vue` (2026-09-01, pedido direto do usuário) — título
"Dimensões da embalagem" acima dos 4 campos (`weight`/`height`/`width`/
`length`) com um ícone `Info` (16px, `{colors.ink-40}`) ao lado,
explicando que essas medidas são usadas pelo sistema pra calcular a
tabela de frete (mesma disciplina de i18n do resto do projeto — texto
via `dimensionsTooltip` no catálogo, nunca hardcoded). O `TooltipTrigger`
(`as-child`) precisa de um elemento focável/interativo pra funcionar
como trigger de verdade — como não é um `Button` aqui (só um ícone
decorativo-informativo, sem ação de clique), o trigger é um `<span
tabindex="0">` em vez de um elemento nativamente focável, garantindo que
o tooltip também abra via teclado (`:focus-visible`, mesmo `focus-ring`
do resto do design system), não só no hover do mouse. Verificado em
browser real: hover no ícone abre o tooltip com o texto correto
("Usado pelo sistema para calcular a tabela de frete.").

### Spinner (`shared/components/ui/Spinner.vue`)

Ícone `Loading` (de `snow-ui.generated.ts`, não `Loading1` — ver "Known
Gaps" sobre a perda do gradiente cônico nesse último) com rotação aplicada
via `@keyframes` CSS (`animation: ui-spinner-spin 0.8s linear infinite`),
não uma segunda variante de ícone por frame.

- **Achado real, sistêmico — afeta todo ícone gerado, não só o Spinner**:
  `createIcon.ts` (a fábrica usada por `regular.generated.ts`/
  `duotone.generated.ts`/`snow-ui.generated.ts`) tinha `inheritAttrs: false`
  pra bloquear o `stroke-width` que `Icon.vue` sempre manda (prop que só
  faz sentido pro `@lucide/vue`, vazaria pro `<svg>` gerado aqui sem
  bloqueio). Efeito colateral não percebido até este componente: isso
  também bloqueava `class`/`style`, então `<Icon class="ui-spinner" .../>`
  simplesmente não chegava no DOM — a animação nunca era aplicada, sem
  nenhum erro/warning no console. Confirmado com
  `document.querySelector('.ui-spinner')` retornando `null` antes da
  correção. **Corrigido** com `useAttrs()` dentro do `setup()`, repassando
  `attrs.class`/`attrs.style` manualmente pro `h('svg', ...)` enquanto
  `inheritAttrs: false` continua bloqueando o resto (`stroke-width`
  incluso). Reconfirmado depois: elemento encontrado,
  `animationName`/`animationDuration` computados corretos.

### Search (`shared/components/ui/Search.vue`)

**Decisão revista em 2026-08-27** — `docs/design/catalogo-componentes.md`
originalmente descrevia isso como "variante de `Input.vue` (`type="search"`
+ ícone)", escrito antes de examinar o frame "Search" de verdade no Figma.
Na prática o componente tem grafia própria (caixa compacta tipo pílula,
3 estados de interação com fundo diferente, hint de atalho de teclado,
botão de limpar) — distante o bastante do Input-A/B (sempre branco, sempre
com borda) pra justificar um arquivo próprio em vez de props extras
empilhadas no Input.

- **3 estados são só CSS de interação, não props** — `Type=Grey` (idle:
  fundo `{colors.ink-4}`, sem borda visível — implementado como borda
  `1px solid transparent` pra não pular o layout quando a borda de verdade
  aparece), `Type=White` (`:hover:not(:focus-within)`: fundo
  `{colors.paper-80}`, borda `{colors.ink-10}`), `Type=Typing`
  (`:focus-within`: fundo `{colors.paper}`, borda `{colors.ink-20}` +
  `focus-ring`).
- Ícone de lupa (`MagnifyingGlass`, `icons/regular.generated`) fixo em
  16px, mesma dimensão medida no Figma (`layout_e4b6f33f`, 16×16).
- Prop `shortcut` opcional (ex.: `"⌘/"`, mesmo padrão do Tooltip) — só
  aparece quando o campo está vazio; texto `12 Regular` em
  `{colors.ink-20}` (medido do próprio frame do Figma, não aproximado).
- Botão de limpar (ícone `XCircles`) aparece só quando há valor —
  substitui o "x" nativo do `type="search"`
  (`::-webkit-search-cancel-button { display: none }`, removido de
  propósito pra não duplicar). "XCircles" é o nome mais próximo do
  `XCircle-f` do Figma que existe no export gerado — mesma classe de gap
  já registrada pro `CaretUpDown`/`ArrowLineUpDown` do Select.
- Padding real medido no Figma: `4px 6px` — o `6px` horizontal não bate
  com nenhum degrau da escala de spacing (0/4/8/12/16...), mesmo caso já
  registrado no padding vertical de `1px` do Badge: valor legítimo do
  componente de origem, não arredondado pra escala geral.

### FormGroup (`shared/components/blocks/FormGroup.vue`)

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

### CrudFormActions (`shared/components/blocks/CrudFormActions.vue`)

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

### Modal (`shared/components/ui/Modal.vue`)

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

### ConfirmDialog (`shared/components/blocks/ConfirmDialog.vue`)

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

### Drawer (`shared/components/ui/Drawer.vue`)

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

### DataTable (`shared/components/blocks/DataTable.vue`)

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

### AvatarGroup (`shared/components/blocks/AvatarGroup.vue`)

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

### IconTile (`shared/components/ui/IconTile.vue`)

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

### IconText (`shared/components/ui/IconText.vue`)

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

### PaginationNav (`shared/components/blocks/PaginationNav.vue`)

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

### ListToolbar (`shared/components/blocks/ListToolbar.vue`)

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

### DropdownMenu (`shared/components/ui/DropdownMenu.vue`)

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

### Breadcrumb (`shared/components/ui/Breadcrumb.vue`)

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

### TabBar (`shared/components/ui/TabBar.vue`)

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

### BlockTab (`shared/components/ui/BlockTab.vue`)

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

### Notifiers / Toast (`shared/composables/useToast.ts`)

Pedido direto pelo usuário em 2026-08-28 com captura real (`success` —
"Successful Operation"/"Done" — e `error` — "Operation Failed"/"Something
Wrong" — lado a lado, fundo escuro sólido uniforme, só o ícone muda de
cor/forma) — `warning`/`info`/`default` pedidos junto, sem captura própria,
extrapolados na mesma linguagem visual da captura. `useToast()` é um
wrapper fino sobre `vue-sonner` (decisão de stack já fixada, seção 15.3
de `docs/infra/convencoes-frontend-infra.md`) — `error`/`info`/`warning`/
`success`/`message` (este último cobre o tipo "default" do pacote,
`toast()` sem sufixo, já usado em `core/pwa/composables/useAppUpdatePrompt.ts`), cada
um um repasse 1:1 pro `toast.*` correspondente. Sem lógica de decisão —
não é candidato a test-first (mesma régua de "services/utils puros" só
vale quando há ramificação real pra testar).

- **Ícone e cor por tipo configurados uma vez só, no `<Toaster>` de
  `App.vue`, nunca em cada chamada** — via slots nomeados
  (`#success-icon`/`#error-icon`/`#warning-icon`/`#info-icon`), cada um
  um `Icon.vue` com `style="color: ..."` direto (`{colors.accent-green}`/
  `{colors.accent-red}`/`{colors.accent-yellow}`/`{colors.accent-blue}`).
  `error` (`Warning`, ícone de triângulo) e `warning` (`WarningCircle`,
  ícone circular) usam **formas diferentes** de propósito, não só cores
  diferentes — a captura só mostrava o triângulo pro caso de erro; dar o
  mesmo triângulo pro warning, só trocando a cor, dificultaria diferenciar
  os dois por daltonismo ou leitura rápida. `default` fica sem ícone —
  não tem slot próprio no pacote, é o caso mais neutro por design.
- **Fundo escuro uniforme pros 5 tipos, não o `rich-colors` do
  `vue-sonner`** — a captura mostra `error` (Operation Failed) com o
  MESMO fundo escuro do `success` (Successful Operation), só o ícone
  muda; `rich-colors` (que estava ligado antes desta rodada) pintaria o
  fundo inteiro de verde/vermelho/etc. por tipo, incompatível com a
  captura. Desligado (removido do `<Toaster>`), tema geral vem de
  `theme="dark"` + variáveis de tema sobrescritas em
  `core/styles/main.scss` (`--normal-bg`/`--normal-border`/`--normal-text`/
  `--border-radius`, todas com os tokens do Orbita: `{colors.ink}` de
  fundo, `{colors.paper}` de texto, `{radius.8}`).
- **Achado real 1 — `vue-sonner/style.css` nunca tinha sido importado no
  projeto.** `import { Toaster } from 'vue-sonner'` sozinho NÃO carrega o
  CSS do pacote (é um export separado, `vue-sonner/style.css`) — sem ele,
  o toast sempre renderizou com `position: static` (não `fixed`), sem
  fundo/raio/z-index nenhum, efetivamente invisível (some no fluxo normal
  da página, longe da viewport). Isso é anterior a esta rodada — o toast
  de atualização do PWA (`useAppUpdatePrompt.ts`) nunca tinha sido
  verificado visualmente em browser real antes de agora. Corrigido com
  `import 'vue-sonner/style.css'` em `main.ts`, junto de `main.scss`.
- **Achado real 2 — variáveis de tema precisam de `!important`.** O
  próprio pacote já define `--normal-bg`/`--normal-text`/etc. via
  `[data-sonner-toaster][data-sonner-theme='dark'] { ... }` (2 seletores
  de atributo, especificidade 0-0-2-0) — um seletor nosso de 1 atributo
  (`[data-sonner-toaster] { --normal-bg: ...; }`) nunca venceria essa
  regra sem `!important`, não importa a ordem de import. Confirmado via
  `getComputedStyle` antes/depois (fundo resolvendo pro branco/preto
  genérico do pacote antes, pro `{colors.ink}` do Orbita depois).
- **Achado real 3, sistêmico — bug em `_tokens.scss`, não só no
  toast.** O seletor de dark mode do design system inteiro
  (`core/styles/_tokens.scss`) era `[data-theme='dark']`, **sem ancorar
  em `:root`** — um seletor de atributo desancorado casa com QUALQUER
  elemento da página que carregue esse atributo, não só a raiz. O
  `<Toaster theme="dark">` do `vue-sonner` bota `data-theme="dark"` no
  próprio container (convenção própria do pacote, sem relação nenhuma
  com a nossa — coincidência de nome de atributo) — sem o `:root`, isso
  ativava os tokens de dark mode do Orbita (`--color-ink` virando branco,
  etc.) só dentro da árvore do toaster, quebrando meu próprio
  `--normal-bg: var(--color-ink)` (a variável em si resolvia pro branco
  do dark mode ali dentro, não pro preto esperado). Descoberto
  comparando `getComputedStyle(toaster).getPropertyValue('--color-ink')`
  (`#ffffff`) contra o mesmo em `document.documentElement`
  (`#000000`) — deveriam ser iguais e não eram. Corrigido pra
  `:root[data-theme='dark']` — sem efeito colateral no app hoje (nenhum
  composable liga esse atributo ainda, "Known Gaps"), mas um bug real
  que só não tinha aparecido porque nada até agora colidia com o nome do
  atributo.
- Verificado em browser real, tipo a tipo (`success`/`error`/`warning`/
  `info`/`default`, cada um isolado numa navegação própria pra evitar
  interferência do empilhamento do `vue-sonner`): `success`/`error`
  batem pixel a pixel com a captura do usuário (fundo, raio, ícone,
  posição do ícone antes do texto); `warning`/`info`/`default` seguem a
  mesma linguagem visual com ícone/cor próprios.
- **Achado real, 2026-08-28, depois do toggle de tema ficar de verdade em
  `AppHeader.vue`**: o toast é DELIBERADAMENTE sempre escuro
  (`theme="dark"` fixo no `<Toaster>`, independente do tema do app) —
  mas `main.scss` fixava `--normal-bg`/`--normal-text` em
  `$color-ink`/`$color-paper`, que FLIPPAM com `data-theme`. No tema
  escuro do app, `$color-ink` virava branco e o toast (que devia
  continuar com cartão escuro) virava um cartão branco — reportado pelo
  usuário junto com o achado do `Checkbox`/`StatCard` da mesma rodada.
  Trocado por `$color-ink-fixed`/`$color-paper-fixed` (tokens novos em
  `_tokens.scss`, nunca redefinidos no bloco `[data-theme='dark']`),
  preservando a intenção original de "sempre escuro" mesmo com o app em
  modo escuro. Confirmado via `getComputedStyle` no card do toast:
  `rgb(0, 0, 0)` de fundo com o app em `data-theme="dark"` (antes:
  branco).

### NotificationItem (`modules/platform/components/NotificationItem.vue`)

**Correção sobre a decisão original da Tier 9**: o catálogo citava
`State=Failure/Successful`, `Size=Big/Small` como referência do Figma —
esse é o `COMPONENT_SET "Notification"` (`#4113:42509`), mas examinando o
frame de verdade ele é um **toast flutuante** (fundo `Black/80%` + blur,
mesma linguagem visual do Tooltip/DropdownMenu), não o item de lista real.
`vue-sonner` já cobre toast avulso (decisão já registrada), então esse
componente nunca deveria ter sido implementado como item de lista. O item
real usado dentro do painel "Notifications" do `RightBar` é a instância
"Avatar-Name-Text" (`#4113:42432`) — ícone num tile colorido + título +
timestamp, sem fundo escuro nem blur. Mesma classe de correção já feita
pro `Search.vue`/`DropdownMenu.vue` — grounding contra o frame certo, não
contra o nome mais parecido.

- Tile do ícone: `{size.24}`, `{radius.8}`. **Primeiro uso real dos tokens
  `{colors.tint-1}`/`{colors.tint-2}`** (documentados desde a Fase 0 como
  "reservados, sem papel definido ainda") — aproximação dos 2 tons claros
  do Figma ("Primary/Blue" `#E3F5FF`, "Primary/Purple" `#E5ECF6`), não são
  valores exatos mas mesma família de cor/matiz.
- Título `{typography.body}` em `{colors.ink}`, timestamp
  `{typography.label}` em `{colors.ink-40}` — já formatado
  ("Just now", "12 hours ago"...) como vem do Figma; formatação de data
  real (`dayjs`) é responsabilidade do composable do módulo quando o
  backend existir (Fase 5), não deste componente de apresentação.
- Hover `{colors.ink-4}` — não está no Figma estático, mas é o mesmo
  affordance já usado em outras linhas clicáveis do design system
  (`AppSidebarNavItem`, item de `DropdownMenu`).

**Estado "não lida", pedido direto do usuário em 2026-08-27**: prop
`notification.read` espelha `USER_NOTIFICATION.read`
(`docs/negocio/contexto-plataforma-precificacao.md` seção 2.5) — "lida"/
"não lida" mora na entrega, nunca na notificação em si, mesma regra do
domínio. Quando `read: false`:

- Título ganha `{typography.body-strong}` (salto de peso 400→600, nunca
  cor/tamanho sozinho — mesma regra do "Do's and Don'ts" abaixo).
- Um ponto de `{spacing.8}` (sem token de tamanho abaixo de `{size.12}`,
  usa o token de espaçamento em vez de inventar um valor de pixel) em
  `{colors.accent-red}` aparece ao lado do conteúdo — grounded no padrão
  "Badge-Dot" visto no Figma sobreposto a ícone de botão (não há frame
  isolado desse dot dentro de uma linha de lista, adaptação nossa do
  mesmo padrão pro contexto de lista). Cor exata do "Dot" do Figma não foi
  resolvível no dump em cache (rate limit já em curso) —
  `{colors.accent-red}` é aproximação documentada, mesma convenção comum
  de "precisa de atenção".

### NotificationPanel (`modules/platform/components/NotificationPanel.vue`)

Grounded na seção "Notifications" do `RightBar` do Figma (`#4113:42432`)
— decisão já registrada em `docs/design/catalogo-componentes.md`: só essa
seção vira painel de verdade, "Activities" (admin-only) e "Contacts"
(Orbita não tem conceito de time) ficam fora.

- **Reaproveita `Drawer.vue`** (tamanho `sm`, 320px) em vez de construir
  um painel novo — o `RightBar` do Figma é uma coluna fixa de 280px,
  aproximada pelo tamanho já existente mais próximo.
- **Aberto pelo sino do `AppHeader`** via `useAppShell` — o composable
  ganhou `isNotificationPanelOpen`/`openNotificationPanel`/
  `closeNotificationPanel`/`toggleNotificationPanel`, mesmo padrão
  singleton já usado pro menu mobile, com teste primeiro (TDD) em
  `tests/core/layouts/composables/useAppShell.test.ts` — o sino era só chrome visual
  sem função até aqui (achado já registrado na Tier 2).
- **Montado uma vez em `App.vue`**, mesmo padrão do `<Toaster />` do
  `vue-sonner` — não é uma view roteada, é um overlay global do shell.
- **Dados são placeholder** — não existe endpoint de notificação ainda
  (Fase 5). Quando existir, vira um composable (`useNotifications`)
  buscando de verdade; a lista fixa atual é só pra validação visual, mesmo
  espírito das demais seções da vitrine (`HomeView.vue`).
- Verificado em browser real: sino abre o painel com os 4 itens de
  exemplo renderizados corretamente (tile colorido, título, timestamp),
  fecha com `Esc`.

**Indicador de não lida no sino do `AppHeader`** (`core/layouts/AppHeader.vue`),
mesmo pedido: `useAppShell` ganhou `hasUnreadNotifications` (leitura) +
`setHasUnreadNotifications` (escrita, só o módulo Platform chama — o
`AppHeader`, sendo `core/`, nunca importa de `modules/platform/`
diretamente, mesma regra de fronteira de módulo aplicada aqui pro sentido
inverso). `NotificationPanel.vue` calcula `hasUnread` via `computed` sobre
a lista e reporta pra `useAppShell` via `watchEffect` (não uma chamada
única — quando a lista virar reativa de verdade na Fase 5, continua
correto sem mudar nada). TDD: teste primeiro em
`tests/core/layouts/composables/useAppShell.test.ts`, depois a implementação. Mesmo
ponto vermelho (`{colors.accent-red}`, `{spacing.8}`) do item de lista,
posicionado como overlay absoluto no canto do botão do sino — grounded no
mesmo padrão "Badge-Dot" do Figma, mas usado aqui como o Figma realmente
mostra (sobreposto a ícone de botão). Verificado em browser real: ponto
aparece quando há notificação não lida na lista placeholder.

### StatCard (`shared/components/blocks/StatCard.vue`)

Grounded no `COMPONENT_SET "Status"` do frame "Widget" do Figma
(`#4113:41876`, `Type=A`/`Type=B`) — label `14 Semibold` em `{colors.ink}`,
valor `24 Semibold` (`{typography.title}`) em `{colors.ink}`, fundo
tintado (`Primary/Blue`/`Primary/Purple`, mesma aproximação
`{colors.tint-1}`/`{colors.tint-2}` já usada no `NotificationItem` —
primeiro uso como fundo de CARD inteiro, não só tile de ícone),
`{radius.16}`, padding `{spacing.24}`.

- Casca pronta pra Fase 4 (dashboard de precificação) — conteúdo real
  (preço sugerido, margem) segue bloqueado pelo mesmo gap de backend já
  registrado (`PricingCalculator` nunca exposto em rota,
  `docs/planejamento/plano-implementacao.md`). Não decide nada de
  negócio: só recebe `label`/`value`/`trend` já calculados.
- Prop `trend?: { direction: 'up' | 'down'; value: string }` — ícone
  "ArrowRise" do Figma não existe no export gerado (mesma classe de gap
  já registrada pro `CaretUpDown`/`ArrowLineUpDown` do Select); `TrendUp`/
  `TrendDown` são os ícones mais próximos disponíveis, com o par completo
  (Figma só mostrou o caso positivo).
- **Achado real, descoberto simulando `data-theme="dark"`, RESOLVIDO em
  2026-08-28**: `{colors.tint-1}`/`{colors.tint-2}` não têm variante pro
  tema escuro no export de origem — o fundo do card continua claro (é o
  único valor que o token tem), mas `{colors.ink}` no texto vira branco
  no tema escuro, resultando em texto branco sobre fundo claro. Ficou
  hipotético até o toggle de tema real do `AppHeader` existir (mesmo dia)
  — aí virou um bug real, reportado pelo usuário (junto com o mesmo
  problema no `Checkbox` e no toast). Corrigido: ver bullet "Fix de
  contraste em tema escuro" logo abaixo.

**Revisão pixel-perfect em 2026-08-28, pedida direto pelo usuário com
captura real do frame** — a primeira versão foi construída sem essa
captura, só com a régua geral "label + valor grande + badge de
tendência" do catálogo. 3 achados reais, corrigidos:

- **`Type=B` nunca tinha sido implementado de verdade** — o comentário
  antigo do componente dizia "Type=A/Type=B" cobertos, mas só existia o
  card com tendência (`Type=A`). A captura mostra `Type=B`: ícone no
  canto superior direito (ao lado do label, mesma linha), sem tendência
  nenhuma. Corrigido com uma prop nova, `icon?: Component` — renderiza
  num header `justify-content: space-between` junto do label; sem
  `icon`, o header só mostra o label sozinho (mesmo visual de antes,
  compatível com as instâncias já existentes na vitrine).
- **Ordem do ícone de tendência estava invertida** — a primeira versão
  reaproveitava `Badge.vue` com `icon-before` (ícone antes do texto:
  "↗ +11.01%"); a captura real mostra o ícone **depois** do texto
  ("+11.01% ↗"). Motivo real de ter saído de `Badge.vue`: a segunda
  diferença encontrada — a captura mostra o texto+ícone da tendência
  **coloridos** (verde pra alta), e `Badge.vue` não tem prop de cor
  própria pra oferecer (sempre `{colors.ink}`). Reescrito como markup
  próprio do `StatCard` (`span` com `TrendUp`/`TrendDown` depois do
  texto), com `color: {colors.accent-green}` pra alta e
  `{colors.accent-red}` pra baixa (par completo — Figma só mostrou o
  caso positivo).
- **Peso do label e espaçamento estavam errados** — label usava
  `{font-weight.semibold}` igual ao valor; a captura mostra "Views"
  visivelmente mais fino que "753" — corrigido pra
  `{font-weight.regular}`. Gap entre valor e tendência aumentado de
  `{spacing.8}` pra `{spacing.16}` — a primeira versão ficava com o
  indicador colado no número, a captura mostra bem mais respiro.
- Reverificado em browser real contra a captura: os dois cards (`Views`
  com tendência verde `+11.01%`/ícone depois do texto, `Views` com ícone
  `Eye` no canto sem tendência) batem com o layout e agrupamento visual
  da referência.
- **Fix de contraste em tema escuro, 2026-08-28** — `.stat-card__header`/
  `__label`/`__value` usavam `$color-ink`, que vira branco no tema
  escuro — mas o fundo (`{colors.tint-1}`/`{colors.tint-2}`) não tem
  variante escura, continua o mesmo pastel claro nos dois temas, então o
  texto sumia (branco sobre claro). Trocado por `$color-ink-fixed`, token
  novo em `_tokens.scss` (`--color-ink-fixed`/`--color-paper-fixed`,
  nunca redefinidos no bloco `[data-theme='dark']`, sempre os valores de
  SnowUI-Light) — feito pra exatamente esse padrão, superfície que não
  acompanha o tema. Mesmo fix aplicado em `IconTile.vue` (ícone sobre o
  mesmo tipo de fundo) e no toast do `vue-sonner` (`main.scss`, que
  também é deliberadamente sempre escuro — ver seção Notifiers/Toast).
- **Variante `neutral`, pedida direto pelo usuário em 2026-08-28 com
  captura real do dashboard de referência em tema escuro**: dos 4
  `StatCard` da captura, só 2 mantêm o acento tint (fixo, não acompanha
  o tema — os outros 2 viram superfície neutra que escurece junto com o
  resto da página. Até então `tint` só aceitava `blue`/`purple` (default
  `blue`), então TODO `StatCard` sem `tint` explícito saía tintado — não
  existia uma opção "sem destaque". Prop `tint` ganhou o terceiro valor
  `neutral` (agora o default, no lugar de `blue`) — fundo
  `{colors.bg-2}` (não `{colors.bg-1}`, que seria igual ao fundo da
  página atrás e o card sumiria por trás dele), acompanha claro/escuro
  normalmente. **Cor de texto teve que virar condicional por variante**:
  `$color-ink` (tema-adaptativo) é a base agora em
  `.stat-card__header`/`__label`/`__value` — correto pro `neutral`, cujo
  fundo também é tema-adaptativo — com um override só pra
  `.stat-card--blue`/`.stat-card--purple` forçando `$color-ink-fixed` de
  volta (fundo fixo continua precisando de texto fixo, mesmo achado do
  bullet acima). `HomeView.vue`: "Produtos cadastrados"/"Marketplaces
  conectados" mantêm o tint (blue/purple, cards em destaque), "Vínculos
  ativos"/"Fora da margem" viraram `neutral`. Confirmado via
  `getComputedStyle` no tema escuro: os 2 tintados resolvem pro mesmo
  `rgb(230, 241, 253)`/`rgb(237, 238, 252)` do claro (fixos), os 2
  neutros resolvem pra `rgba(255, 255, 255, 0.04)` (a mesma composição
  translúcida de `{colors.bg-2}` escuro já usada em outras superfícies
  não-portal, corretamente escurecendo).

### ProgressBar (`shared/components/ui/ProgressBar.vue`)

**Decisão de "fora de escopo" revertida em 2026-08-28** — `Widget → Info`
(`Status-1`/`Status-2`) tinha sido descartado junto com `Card`/instâncias
soltas do mesmo frame, categorizado como "conteúdo de dashboard genérico
sem caso de uso no domínio do Orbita" (mesmo critério do `BlockTab`/"More
Items" do `DropdownMenu`). O usuário pediu implementação direta com
captura real do frame ("Total Tasks: 15/48", barra "Status" com "In
Progress"/"51%", barra "Profile Completion" com "51%" centralizado) — a
régua de escopo original não se sustentou contra um pedido concreto com
grounding real, revertida.

- Construído sobre `ProgressRoot`/`ProgressIndicator` da Reka UI — o
  primitivo não aplica nenhum estilo de preenchimento sozinho (só expõe
  `data-state`/`data-value`/`data-max`), a largura do preenchimento
  (`value / max`) é calculada no componente e aplicada via `:style`,
  técnica padrão pra esse primitivo em qualquer biblioteca baseada nele.
- **Duas variantes cobertas pela mesma prop `label`/`show-percentage`,
  vistas na captura**: com `label` ("In Progress"), o texto fica dentro
  do preenchimento colorido, alinhado à esquerda — a porcentagem "51%" ao
  lado da barra (Status) é markup do consumidor, fora do átomo, porque é
  assim que a captura mostra (texto+barra numa linha, porcentagem depois,
  cor apagada `{colors.ink-40}` — diferente do "51%" da segunda barra).
  Com `show-percentage`, a porcentagem fica centralizada na barra inteira
  via `position: absolute` (independente da largura do preenchimento) —
  padrão da barra "Profile Completion", onde a porcentagem é o único
  conteúdo, então fica em destaque (`{colors.ink}`, semibold) dentro da
  própria barra.
- **Cor do preenchimento é `{colors.accent-indigo}`** — aproximação
  visual da captura (tom lavanda claro), mesmo tom já usado pro status
  "In Progress" do `StatusDot` nesta mesma sessão, reforçando a mesma
  associação semântica em vez de escolher uma cor nova sem motivo.
- **Sem componente de card próprio** — o card "Info" inteiro da captura
  (Total Tasks + as 2 barras) é composição local da vitrine
  (`.showcase__info-card` em `HomeView.vue`), não um bloco novo: o pedido
  foi pelos componentes de progresso, não por um card dedicado, e nada
  indica reuso real desse agrupamento específico ainda (mesma régua de
  "sobe pra shared/ só com um segundo consumidor real").
- Verificado em browser real contra a captura, incluindo a largura real
  do preenchimento calculada (`51% de 198px` e `51% de 230px`,
  conferidas via `getComputedStyle`, não só inspeção visual): layout,
  cores e posicionamento de texto batem com a referência.

### ChartCard (`shared/components/blocks/ChartCard.vue`)

Wrapper de gráfico (seção 3.2 de `docs/infra/convencoes-frontend-infra.md`)
— **sem grounding pixel-a-pixel no Figma de propósito**: o frame "Chart"
da página "Components" (`Histogram`/`ChartDot`/`ChartScale`) são
elementos SVG desenhados à mão pra ilustrar um gráfico, não a saída real
do `chart.js` (que renderiza em `<canvas>`, com sua própria API de estilo
via JS, não CSS/SVG). A decisão de stack já fixou `chart.js`/`vue-chartjs`
(seção 15.3) — o trabalho aqui é aplicar os tokens do design system nas
opções do `chart.js`, não replicar o desenho estático do Figma.

**Revisão em 2026-08-27, mesmo dia**: a primeira versão (série única,
`type: 'line' | 'bar'`) foi feita sem examinar telas de exemplo reais do
mesmo arquivo Figma — o usuário enviou 3 screenshots de telas fora da
página "Components" já em cache ("Traffic by Device", "Traffic by
Location", "Total Users") mostrando um vocabulário bem mais rico: barra
colorida por categoria, donut com legenda, linha dupla (atual + tracejada
de comparação) com seletor de métrica no cabeçalho. Reescrito pra cobrir
os 3 padrões. Medidas abaixo são aproximação visual a partir dos
screenshots (não foi possível confirmar valores exatos via API — rate
limit em curso), documentado como tal, não pixel exato.

- Props: `title`, `type: 'bar' | 'line' | 'doughnut'`, `labels: string[]`,
  `series: ChartSeriesConfig[]` (`{ label, values, dashed? }` — `dashed`
  só faz sentido em `type="line"`, renderiza uma segunda linha de
  comparação sem preenchimento), `metrics?: ChartMetricOption[]`
  (`{ key, label }`, opcional).
- **Fundo do card revisado**: `{colors.bg-2}` sem borda (não
  `{colors.bg-1}` + borda como na primeira versão) — os 3 screenshots de
  referência mostram um cinza bem sutil contra a página branca, sem
  borda visível.
- **Barra com cor por categoria**: paleta categórica fixa (6 tons —
  `{colors.accent-indigo}`, `{colors.accent-mint}`, `{colors.ink}`,
  `{colors.accent-blue}`, `{colors.accent-purple}`,
  `{colors.accent-green}`, repete em ciclo se houver mais categorias),
  atribuída por índice da barra via `backgroundColor: string[]` do
  `chart.js` (um array em vez de uma cor só, funciona porque é sempre 1
  dataset com N categorias, não N datasets). Cantos com arredondamento
  suave nos 4 lados (`borderRadius: 12`, `borderSkipped: false`) —
  **revisado na 2ª rodada pixel-perfect** abaixo: a v1 usava só topo em
  pill total (`999`), que o usuário comparou lado a lado contra o Figma
  real e apontou como errado — a referência arredonda topo E base com um
  raio moderado, não uma cápsula.
- **Donut com legenda própria em HTML**, não o plugin `legend` nativo do
  `chart.js` — lista renderizada com nossos tokens (bullet colorido +
  label + porcentagem), mesma paleta categórica da barra. Porcentagem
  calculada aqui (`valor / soma total`, arredondado a 1 casa) — é
  formatação de apresentação, não decisão de negócio, aceitável num
  block. **Simplificação documentada**: o maior segmento do Figma usa um
  gradiente preto→cinza; aqui é cor sólida (`{colors.ink}`) — implementar
  um gradiente real de canvas (`ctx.createLinearGradient`) é possível mas
  não valia o esforço pra um detalhe decorativo sem grounding exato.
- **Linha dupla (atual + comparação tracejada)**: primeira série sempre
  sólida em `{colors.ink}` com preenchimento (`fill: true`,
  `backgroundColor: {colors.ink-10}`); séries seguintes tracejadas
  (`borderDash: [6, 6]`) sem preenchimento, cor da paleta categórica.
  Legenda inline no cabeçalho (bullet + label por série, cor do bullet
  acompanha a cor da linha) só aparece quando há mais de 1 série.
- **Seletor de métrica no cabeçalho** (`metrics`) — o mesmo padrão
  "BlockTab" que a Tier 8 descartou como "não é navegação de verdade"
  (`TabBar.vue`) tem aqui um uso real: alternar qual métrica alimenta o
  MESMO gráfico (ex.: "Preço sugerido" vs "Margem"), não navegação de
  página/rota. Por isso não reaproveita `TabBar.vue`/`TabsRoot` da Reka
  UI — sem painel de conteúdo trocando via `role=tab`. **Extraído pra
  `BlockTab.vue` em 2026-08-28** (seção própria acima) — o markup/CSS
  vivia solto aqui até o usuário notar o reuso e pedir a extração; hoje é
  `<BlockTab v-model="activeMetric" :options="metrics" />`. **Nunca
  decide o que fazer com a troca** — quem decide que dado alimenta
  `series` depois do clique é o composable do módulo consumidor (mesma
  régua de bloco sem regra de negócio).
- **Achado real, técnico, plugin `Filler` esquecido na primeira reescrita**:
  a primeira versão do preenchimento de área (`fill: true`) foi escrita
  sem registrar o plugin `Filler` do `chart.js` — resultado: warning no
  console (`"Tried to use the 'fill' option without the 'Filler'
  plugin enabled"`) e a área simplesmente não desenhava, sem erro fatal
  (silencioso o bastante pra passar despercebido se não fosse verificado
  em browser real). Corrigido adicionando `Filler` ao `ChartJS.register(...)`.
- **Achado real, técnico**: `<canvas>` não resolve `var()` em cadeia
  sozinho — ler `getPropertyValue('--color-primary')` direto devolveria o
  texto literal `"var(--color-accent-indigo)"` no tema escuro (onde
  `--color-primary` é definido como referência a outro token, não um hex
  direto), não o valor final resolvido. **Corrigido** lendo a cor de
  `<span>` escondidos (criados dinamicamente, um por token, removidos
  logo em seguida — não `display:none`, que os tiraria da árvore de
  render antes da leitura) com a variável aplicada como `color` (uma
  propriedade CSS de verdade força a resolução completa da cadeia) —
  `getComputedStyle(probe).color` sempre devolve o valor final resolvido
  (`rgb(...)`), nunca o texto da variável. Reconfirmado simulando
  `data-theme="dark"`: a sonda resolveu `{colors.primary}` pra
  `rgb(173, 173, 251)` (o hex real de `{colors.accent-indigo}`), não a
  string da variável.
- **Cores só são lidas uma vez, no `onMounted`** — decisão tomada quando
  não existia toggle de tema em runtime. **Atualização 2026-08-28**: o
  `AppHeader` ganhou um toggle real (`shared/composables/useTheme.ts`,
  seção Components → AppHeader) — esta leitura única passou a ser uma
  pendência concreta (um gráfico já renderizado não atualiza as cores se
  o usuário trocar de tema depois, precisaria de um `watch` sobre
  `useTheme().theme`), não corrigida nesta rodada (fora do escopo do
  pedido de header).
- Verificado em browser real contra os 3 screenshots de referência:
  barra com 6 cores + topo arredondado, donut com legenda e porcentagens
  corretas, linha dupla com preenchimento + tracejado + seletor de
  métrica trocando a classe `--active` corretamente ao clicar.

**2ª rodada pixel-perfect, mesmo dia (2026-08-27)** — o usuário comparou a
implementação lado a lado com um mockup completo do dashboard no Figma
(4 cards de gráfico juntos) e apontou que o resultado "não está pixel
perfect, nem parecido", pedindo rigor pixel a pixel daqui pra frente, não
só aproximação visual. Achados reais desta rodada:

- **Barras finas/espaçadas demais**: a v1 tinha vão grande entre
  categorias. Corrigido com `barPercentage: 0.9` + `categoryPercentage: 0.7`
  (barras ocupam quase toda a largura da categoria) e removido o
  `maxBarThickness` que limitava a largura mesmo em telas largas.
- **Rótulo do eixo X rotacionando sozinho**: o `chart.js` rotaciona rótulo
  automaticamente quando não cabe na horizontal — a referência mantém
  sempre horizontal. Corrigido com `maxRotation: 0, minRotation: 0` nos
  ticks do eixo X.
- **Regressão real causada pela correção acima**: sem rotação disponível,
  o `autoSkip: true` (default do `chart.js`) escondeu 3 das 6 categorias
  silenciosamente pra evitar overlap — sem aviso nenhum, só sumiram do
  eixo. Categoria sem rótulo visível é pior que rótulo apertado. Corrigido
  com `autoSkip: false` nos mesmos ticks.
- **Arredondamento da barra corrigido de novo**: `borderRadius: 12` nos 4
  cantos (não só topo, não pill/`999`) — ver bullet específico acima.
- **Linhas de grade atrás das barras removidas**: a referência
  ("Traffic by Device") não tem nenhuma grade horizontal atrás das barras,
  só os labels do eixo Y. Corrigido com `grid: { display: props.type !== 'bar' }`
  no eixo Y — só o gráfico de linha mantém a grade horizontal sutil (papel
  de guia de leitura ao longo do tempo, diferente de um gráfico de
  categoria).
- **Preenchimento sob a linha era cor chapada, não gradiente**: a
  referência ("Total Users") desvanece de escuro no topo pra transparente
  perto do eixo. Corrigido com uma função scriptable
  (`backgroundColor: (context: ScriptableContext<'line'>) => ...`) que usa
  `context.chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)`
  com `{colors.ink-10}` (já um token com alfa) como stop inicial e a
  palavra-chave `'transparent'` como stop final — evita qualquer parsing
  de string de cor já resolvida, só 2 valores seguros.
- **Traço da linha mais fino + feedback de hover**: `borderWidth: 2` (era
  o default de 3px do `chart.js`, mais grosso que a referência) e
  `pointRadius: 0` em repouso (sem bolinha, igual antes) mas
  `pointHoverRadius: 4`/`pointHitRadius: 8` no hover — sem isso o cursor
  sobre a linha não confirma em qual ponto exato o tooltip está ancorado.
- **Tooltip nunca tinha sido estilizado**: o default do `chart.js` é uma
  caixa preta sem raio, fonte do sistema — destoava de todo o resto do
  card. Estilizado com os tokens do design system
  (`backgroundColor: {colors.ink}`, texto `{colors.paper}`, fonte
  "Inter Variable" 12px, `cornerRadius: 8`, `padding: 8`) e
  `displayColors: false` no gráfico de linha (sem o quadradinho de cor
  antes do valor, que não agrega nada quando já existe legenda no
  cabeçalho).
- Reverificado em browser real depois de cada correção: os 6 rótulos de
  categoria aparecem horizontais sem serem escondidos, as barras têm
  arredondamento suave nos 4 cantos sem grade atrás, e a área sob a linha
  mostra o gradiente esmaecendo até transparente.

**3ª rodada pixel-perfect, mesmo dia (2026-08-27)** — usuário enviou um
crop isolado do card "Traffic by Location" (mesmo arquivo Figma) e pediu
ajuste específico do donut. Achados reais desta rodada:

- **Segmentos colados, sem vão nem ponta arredondada**: a referência tem
  cada fatia visivelmente separada das vizinhas, com as duas pontas
  arredondadas. Corrigido com `spacing: 4` (vão em px entre arcos) +
  `borderRadius: 8` (arredondamento das pontas) no dataset — as duas
  opções nativas do `chart.js` pra `doughnut`/`pie`, nenhuma precisa de
  desenho manual.
- **Maior fatia é um gradiente escuro, não preto chapado**: a referência
  destaca a categoria de maior valor (52,1% no exemplo do Figma) com um
  gradiente diagonal de preto pra cinza — mesmo padrão de "maior valor
  ganha destaque em preto" já usado em outros lugares do design system,
  aqui como gradiente em vez de cor sólida. Implementado com
  `doughnutMaxIndex` (computed que acha o índice do maior valor de
  `series[0].values` — não hardcoded, funciona com qualquer dataset) +
  `doughnutSegmentColor`, uma função scriptable de `backgroundColor` que
  devolve `createDarkArcGradient(context)` só pro índice do maior valor e
  `categoricalColor(index)` (cor pastel chapada) pros demais. O gradiente
  reaproveita a mesma técnica já usada na área da linha
  (`createAreaGradient`): `ctx.createLinearGradient` nos limites do
  `chartArea`, stops `{colors.ink}` → `{colors.ink-40}` — o segundo stop é
  parcialmente transparente de propósito, deixando o fundo `{colors.bg-2}`
  do card "vazar" através da fatia e produzir o esmaecimento pra cinza
  claro visto na referência, sem precisar resolver um segundo tom de cinza
  sólido.
- **Anel fino demais**: `cutout: '65%'` deixava o buraco grande e o anel
  proporcionalmente fino; a referência tem um anel bem mais grosso.
  Ajustado pra `cutout: '50%'` — aproximação visual medida no screenshot,
  não um valor exato via API (mesmo critério já usado nas demais medidas
  desta seção).
- Reverificado em browser real: os 4 segmentos aparecem com vão visível
  entre si, pontas arredondadas nas duas extremidades de cada fatia, o
  segmento de maior valor (Shopee, 52%) com gradiente preto→cinza
  diagonal, e o anel visivelmente mais grosso que a versão anterior.

**4ª rodada pixel-perfect, mesmo dia (2026-08-27)** — usuário enviou um
crop isolado do card "Total Users" (linha dupla) pedindo ajuste
específico. Achados reais desta rodada:

- **Cor da linha tracejada errada**: a v1 usava `categoricalColor(0)`
  (cíclico, caía no indigo/roxo) pra série de comparação; a referência
  sempre usa azul claro. Corrigido com `dashedSeriesColor`, um computed
  fixo em `{colors.accent-blue}` (não cíclico) — só existe 1 papel de
  "série de comparação" no padrão visto, não faz sentido ciclar cor aqui.
- **Tracejado grosso demais**: `borderDash: [6, 6]` produzia um traço-e-
  espaço largo; a referência tem um pontilhado fino e delicado. Ajustado
  pra `[3, 4]` + `borderWidth: 1.5` (contra `2` da linha sólida) — a linha
  de comparação é visivelmente mais fina que a linha principal no Figma.
- **Bullet da legenda colorido por série, deveria ser neutro**: a v1
  pintava o bullet da série tracejada com a cor categórica (indigo);a
  referência usa o mesmo bullet preto pequeno pras duas séries — a
  distinção entre "This year"/"Last year" é feita pela própria linha
  (cor + tracejado), não pelo marcador da legenda. Removida a variante
  `--dashed` do bullet; tamanho também reduzido de `{spacing.8}` pra
  `{spacing.4}` (a referência tem um bullet bem pequeno, quase um ponto).
- **Grade horizontal atrás da linha, que não deveria existir**: a
  suposição da 2ª rodada ("só o gráfico de linha mantém grade, como guia
  de leitura ao longo do tempo") era especulação sem grounding — o
  screenshot real de "Total Users" não tem nenhuma linha de grade, só os
  labels do eixo Y. Corrigido trocando `grid: { display: props.type !==
  'bar' }` por `grid: { display: false }` fixo — nenhum tipo de gráfico
  cartesiano (`bar`/`line`) tem grade no design system, só os labels.
- Reverificado em browser real: linha de comparação agora nasce azul
  clara com pontilhado fino e mais fina que a sólida, os dois bullets da
  legenda aparecem pretos e pequenos, e não há mais nenhuma linha de
  grade atrás do gráfico de linha.

**5ª rodada pixel-perfect, mesmo dia (2026-08-27)** — usuário pediu
explicitamente pra remover "as linhas do eixo x e y". Achado real: a 4ª
rodada já tinha zerado `grid` (as linhas de referência internas), mas o
`chart.js` desenha a **linha do próprio eixo** (em y=0/x=0) através de uma
opção **separada**, `scales.<eixo>.border`, não coberta por `grid` — essa
linha continuava visível mesmo com `grid: { display: false }`. Corrigido
com `border: { display: false }` nos dois eixos (`x` e `y`), mantendo só
os `ticks` (labels). Reverificado em browser real: nenhuma linha aparece
mais em nenhuma borda do gráfico, só os números/labels dos eixos.

### DatePicker (`shared/components/ui/DatePicker.vue`)

Tier 11 do catálogo. **Sem grounding pixel-a-pixel no Figma** — a API do
Figma estava sob rate limit (retry-after de dias, achado registrado na
Tier 0) e nenhuma tela do plano atual exige filtro de data ainda, então
não valia esperar o limite liberar. Mesmo caminho já usado pro
`Modal`/`Drawer` (sem frame de origem): primitivo Reka UI + tokens do
design system, sem referência visual do Figma.

- **Primitivo escolhido: `Popover` + `Calendar` standalone, não a família
  composta `DatePicker*` da Reka UI** — a Reka UI também exporta um grupo
  `DatePickerRoot`/`DatePickerField`/`DatePickerCalendar`/... que embute
  um campo de texto **segmentado** (dia/mês/ano editáveis separadamente,
  como o input de data do macOS). Decisão: não usar essa família — o
  Orbita não tem nenhuma tela que peça digitação direta de data, e o
  trigger deste componente segue o mesmo padrão visual/interativo do
  `Select.vue` (clica, abre popover, escolhe, fecha), não um campo de
  texto. Usar as peças soltas (`PopoverRoot`/`PopoverTrigger`/
  `PopoverContent` + `CalendarRoot`/`CalendarHeader`/`CalendarHeading`/
  `CalendarPrev`/`CalendarNext`/`CalendarGrid`/`CalendarGridHead`/
  `CalendarHeadCell`/`CalendarGridBody`/`CalendarGridRow`/`CalendarCell`/
  `CalendarCellTrigger`) evita carregar a complexidade do campo segmentado
  pra um caso de uso que não existe hoje — revisitável se uma tela
  realmente pedir digitação direta.
- **Model público é uma data ISO (`YYYY-MM-DD`), nunca o `DateValue` do
  `@internationalized/date`** que a Reka UI usa por baixo — mesmo
  raciocínio já usado em `Select.vue` (expõe `string`, não o tipo interno
  da lib): o consumidor nunca precisa importar `@internationalized/date`
  pra usar o componente, só serializa a string direto num payload de API
  ou schema Zod. `@internationalized/date` entrou como dependência direta
  do `package.json` (antes só transitiva via `reka-ui`) porque o
  componente importa `parseDate`/`DateValue` dele explicitamente, não só
  através da Reka UI. Conversão de volta pro model usa
  `CalendarDate.toString()`, que já devolve ISO 8601 puro — sem
  formatação manual.
- **Exibição formatada com `dayjs`** (`DD/MM/YYYY`, convenção pt-BR do
  produto) — primeiro uso real de `dayjs` no código do projeto (a
  dependência já estava no `package.json` desde a Fase 0, seção 15.2 de
  `docs/infra/convencoes-frontend-infra.md`, mas nenhum componente tinha
  usado ainda).
- **Sem botão de limpar dedicado no trigger** — limpar a data é feito
  reabrindo o popover e clicando de novo no dia já selecionado, que
  desmarca (`CalendarRoot.preventDeselect` é `false` por padrão na Reka
  UI, nativo, sem código nosso). Ver "Correção" abaixo — a primeira
  versão tinha um ícone de limpar (`XCircles`) substituindo o ícone do
  trigger, reaproveitando o padrão do `Search.vue`; removido por não ter
  grounding nenhum no Figma real depois que o usuário mandou a captura de
  referência.
- **Locale fixo em `'pt-BR'`** no `CalendarRoot` — mesmo critério de
  "produto é pt-BR only no MVP" já usado no `vue-i18n` (seção 6.3 de
  `docs/infra/convencoes-frontend-infra.md`). `weekStartsOn` não foi
  sobrescrito — o padrão que a `@internationalized/date` resolve pra
  `pt-BR` (domingo) já é o esperado, sem necessidade de forçar.
- Estilização via atributos de dado que os próprios primitivos já expõem
  (`data-selected`, `data-today`, `data-outside-view`, `data-disabled` em
  `CalendarCellTrigger`; `data-state` em `PopoverTrigger` pro anel de
  foco, mesmo padrão do `Select.vue`) — nenhum estado calculado à mão no
  componente.
- **Mesmo achado de portal já documentado pro Select/Tooltip/DropdownMenu/
  Modal**: `PopoverPortal` teletransporta `PopoverContent` pro fim do
  `<body>`, então todas as classes usam `:global(...)` com seletor
  "plano" — incluindo `[data-selected]`/`[data-today]`/`[data-outside-view]`/
  `[data-disabled]` do dia selecionado, escritos direto como
  `:global(.ui-date-picker-calendar-cell-trigger[data-selected])` desde a
  primeira versão (não `&[data-selected]` aninhado dentro do bloco
  `:global()`) — aplicando de propósito a lição do bug real já corrigido
  no `Select.vue` em vez de descobrir de novo por tentativa e erro.
- Verificado em browser real: abre no clique, mês/ano em português
  ("agosto de 2026"), seleção de um dia atualiza o trigger e fecha
  ("28/08/2026"), reabrir mantém o dia destacado, navegação de mês
  (anterior/próximo) funciona e não carrega nenhum destaque de dia
  selecionado de outro mês, reclicar no dia já selecionado desmarca e
  volta ao placeholder, trigger `disabled` bloqueia o clique.

**Correção, reportada pelo usuário em 2026-08-28, com captura de
referência real do Figma** (frame de "Date" isolado, não visto antes por
causa do rate limit já registrado) — a primeira versão do trigger tinha
uma estrutura diferente do componente real: texto + botão de
limpar/ícone `CalendarBlank` alternados à direita, nada à esquerda. A
referência mostra um padrão bem mais parecido com `Select.vue`: **ícone
`CalendarBlank` fixo à esquerda** (marcador semântico, sempre apagado em
`{colors.ink-40}`, nunca troca de conteúdo) **+ texto** (placeholder ou
data formatada) **+ ícone `CaretUpDown` fixo à direita** (mesmo ícone de
"abre/fecha" já usado no trigger do `Select`, cor `{colors.ink}`, sem
override próprio). Corrigido:

- Layout do trigger reescrito pra 3 elementos fixos (`Icon` leading +
  `span` de valor + `Icon` trailing), removendo a lógica condicional que
  trocava o ícone da direita por um botão de limpar.
- CSS: `.ui-date-picker-value` ganhou `flex: 1` (empurra o ícone final
  pro fim do trigger, mesmo efeito de um `justify-content: space-between`
  sem separar o ícone inicial do texto — que precisam ficar colados, só
  um `gap` pequeno, como na referência) e `min-width: 0` (necessário pra
  `text-overflow: ellipsis` funcionar dentro de um item flex que também
  tem `flex: 1`). `.ui-date-picker-leading-icon` fixa `color: $color-ink-40`
  — diferente do ícone final, que não tem cor própria e por isso herda
  `$color-ink` do trigger (igual ao `CaretUpDown` do `Select.vue`).
- Função de limpar removida — sem grounding no Figma pra um botão
  dedicado, e a Reka UI já resolve o caso via deseleção nativa (reclicar
  no dia marcado), então não era um recurso perdido, só uma UI inventada
  sem necessidade.
- Reverificado em browser real contra a captura do usuário: os três
  estados do trigger (vazio, preenchido com label, desabilitado) batem
  com a mesma composição ícone-texto-ícone da referência.

**Revisão pixel-perfect do CALENDÁRIO, 2026-08-28, com captura real
cobrindo 4 variantes** ("Date Picker", "Date Picker with time", e as 2 de
intervalo — estas viraram `DateRangePicker.vue`, seção própria abaixo). A
captura mostra um painel bem mais rico que a v1 (só grid + header de
mês): **preview** de data/hora no topo, **atalhos** ("Today"/"Last
selection") e **cabeçalho de mês abreviado**, sem ano ("Feb", não
"February 2026"). Grid de dias não mudou — já batia com a captura desde a
v1 (`CalendarCellTrigger`, estados via `data-*`).

- **Preview** (`10 / 02 / 2025`, `+ 04 : 08 AM` quando `show-time`) —
  formatado com `dayjs`, sempre com um valor concreto (hoje/hora atual
  quando nada foi escolhido ainda, mesmo espírito do "sempre mostra
  algo" já usado no trigger). A parte de DATA é só leitura (preview ao
  vivo do que está selecionado na grade); a de HORA é editável (2 inputs
  numéricos sem borda + botão de AM/PM) — a captura não mostra nenhuma
  affordance visível de edição (sem borda/hover state capturado), então a
  editabilidade em si é uma decisão nossa pra cumprir "com funcionalidade"
  do pedido, não algo visto pixel a pixel.
- **Atalhos traduzidos pra pt-BR** ("Hoje"/"Última seleção", não "Today"/
  "Last selection" literal da captura) — mesmo critério já usado no resto
  da vitrine (`docs/negocio/...`: produto é pt-BR). "Hoje" seleciona o
  dia atual (`today(getLocalTimeZone())` do `@internationalized/date`).
  "Última seleção" **não é "o último valor confirmado historicamente"**
  (não haveria como saber isso sem um botão de Apply, que a captura não
  tem) — é um snapshot tirado toda vez que o popover abre
  (`watch(open, ...)`), então "desfaz o que mudei nesta sessão do
  popover", não "volta pro que eu tinha há 3 aberturas atrás".
- **Cabeçalho de mês abreviado, não `CalendarHeading` padrão** — a
  captura mostra só "Feb" (sem ano, sem dia da semana por extenso); o
  `headingValue` que `CalendarHeading` expõe por padrão via Reka UI é o
  formato completo ("fevereiro de 2026"). Substituído por um label
  calculado na mão com `dayjs(date.toString()).format('MMM')`
  (capitalizado manualmente) — exigiu registrar o locale `pt-br` do
  `dayjs` globalmente (`main.ts`, `dayjs.locale('pt-br')`), primeiro
  ponto do projeto que precisava de nomes de mês/dia por extenso (a
  formatação `DD/MM/YYYY` já usada não depende de locale nenhum).
- **Cor do dia selecionado corrigida**: a v1 usava `{colors.primary}`
  (preto puro no tema claro); a captura mostra claramente um quadrado
  arredondado **lavanda/indigo**, não preto — trocado pra
  `{colors.accent-indigo}`, mesma cor já usada pro status "In Progress"
  no `StatusDot` (mesma sessão), reforçando a mesma associação em vez de
  inventar um tom novo.
- **Fecha ao selecionar só quando não tem hora pra ajustar**
  (`!showTime`) — com `show-time`, o popover fica aberto depois de
  escolher o dia (ainda pode faltar ajustar o relógio); sem hora, mantém
  o comportamento já testado da v1 (fecha ao escolher, mesmo padrão do
  `Select.vue`). Sem botão de "Aplicar" — fecha via clique fora/Esc
  (`PopoverContent` nativo), não visto na captura.
- Verificado em browser real, incluindo interações que só apareceriam
  num teste funcional (não só visual): popover permanece aberto depois
  de clicar um dia quando `show-time`; alternar AM/PM funciona; "Hoje"
  seleciona a data atual; "Última seleção" reverte pro valor de quando o
  popover abriu, não pro valor confirmado antes disso.

### DateRangePicker (`shared/components/ui/DateRangePicker.vue`)

Variantes "Date Picker with date range" (com e sem hora) da mesma captura
de 2026-08-28 do `DatePicker.vue` — mesmo painel (preview + atalhos +
grid), mas sobre `RangeCalendarRoot`/`RangeCalendarCellTrigger` da Reka
UI (intervalo de verdade — início E fim, com estado "no meio" — não 2
`DatePicker`s soltos fingindo um intervalo).

- **Trigger com 2 datas numa caixa só** (`10/08/2026 — 10/08/2026`),
  separador é uma linha de 1px (`{colors.ink-20}`), não um traço de
  texto — mesma caixa/borda/label do `DatePicker.vue` (Input-A/B).
- **Modelos**: `start`/`end` (ISO `YYYY-MM-DD`, mesmo raciocínio do
  `DatePicker.vue`) + `time` opcional compartilhado pelos dois lados — a
  captura só mostra **um** campo de hora pro intervalo inteiro, não
  hora de início e hora de fim separadas, então não inventamos um
  segundo campo sem grounding.
- **"Hoje" marca início E fim no mesmo dia** (intervalo de 1 dia) — única
  interpretação coerente pra um atalho de data única aplicado a um
  seletor de intervalo. "Última seleção" funciona igual ao
  `DatePicker.vue` (snapshot de abertura do popover), agora com 3 campos
  (`start`/`end`/`time`).
- **Fecha só com o intervalo completo** (`start` E `end` definidos, e
  `!showTime`) — clicar uma vez só marca o início; fechar aí devolveria
  um intervalo pela metade. Confirmado que clicar um único dia mantém o
  popover aberto (`data-selection-end` ainda vazio nesse ponto).
- **Achado real: `data-highlighted` da Reka UI não persiste o intervalo
  reaberto** — esse atributo (usado pra pintar a "barra conectada" entre
  início e fim) só é verdadeiro durante o hover **em andamento**, entre
  escolher o início e passar o mouse antes do 2º clique; o próprio
  `useRangeCalendar.js` do pacote zera `highlightedRange` assim que
  início E fim já estão definidos (`if (start && end) return null`).
  Sem tratamento, reabrir o popover com um intervalo já completo mostra
  só os 2 dias extremos destacados, sem nenhuma barra no meio — conferido
  em browser real antes da correção (dias 4–11 sem nenhum tom, só 3 e 12
  destacados). **Corrigido** com uma função própria (`isInRange`, calcula
  se um dia está estritamente entre `start`/`end` via comparação de
  string ISO — `YYYY-MM-DD` ordena igual à data real, sem precisar de
  helper de comparação de datas) e uma classe extra
  (`--in-range`) aplicada em cima do `data-highlighted` já existente, não
  no lugar dele — os dois cobrem momentos diferentes (hover em andamento
  vs. intervalo já persistido).
- **Tom do meio do intervalo via `color-mix()`**, mesma técnica já usada
  no `StatusDot` variante `pill` (`color-mix(in srgb, {colors.accent-indigo}
  20%, transparent)`) — sem token de "indigo claro" pronto na escala,
  reaproveita a cor sólida do início/fim numa opacidade menor em vez de
  inventar um tom novo.
- **Sem grounding pixel-a-pixel pra um intervalo de verdade** (dias
  diferentes) — a captura mostra os 2 exemplos com início=fim
  (`10/02/2025` pros dois lados), não um intervalo de múltiplos dias de
  verdade. O visual da "barra conectada" (arredondado nas pontas, reto
  no meio) é extrapolação nossa a partir do padrão comum desse tipo de
  componente, revisável se uma captura futura mostrar o padrão real.
- **Estilos não compartilhados com `DatePicker.vue`** — mesmo `:global()`
  usado nos dois, mas com classes prefixadas diferentes
  (`ui-date-range-picker-*`), porque são unidades de compilação Sass
  separadas (`@use`/`:global()` não atravessam arquivo). Duplicação de
  ~200 linhas de CSS entre os dois componentes é aceita conscientemente
  — é estilo coeso (não lógica de decisão), mesma régua de "2-3 linhas
  parecidas" do doc de convenções aplicada a um bloco maior.
- Verificado em browser real: seleção de intervalo completo (dias
  diferentes) fecha o popover automaticamente; preview mostra "–– / –– /
  ––––" pro lado ainda não escolhido (não "hoje", que pareceria um valor
  real já definido); barra conectada aparece ao reabrir um intervalo já
  completo; variante com hora mantém o popover aberto e os mesmos
  controles de hora do `DatePicker.vue`.

**Correção, reportada pelo usuário em 2026-08-28 (mesmo dia)**: o ícone
`CaretUpDown` do trigger ficava colado nas datas (`10/08/2026 —
28/08/2026 ⌄`) em vez de alinhado à direita — nenhum elemento da linha
tinha `flex: 1` pra empurrá-lo, diferente do `DatePicker.vue` (onde
`.ui-date-picker-value` já tem `flex: 1` desde a correção anterior do
trigger). Corrigido aplicando `flex: 1; min-width: 0;` só no span de
**fim** (`.ui-date-range-picker-value--end`, classe nova) — não nos dois
spans de data, que empurraria também o separador/início pra longe do
texto inicial; início-separador-fim precisam continuar colados, só o
ícone final vai pro fim do trigger. Reverificado em browser real.

### TagsInput (`shared/components/ui/TagsInput.vue`)

**Pedido direto pelo usuário em 2026-08-28, com captura real do frame
"Form → Type=Tags" do Figma** — gap real do catálogo original: "Select,
Date, Switch, Tags" já eram citados como irmãos do mesmo frame "Form"
desde a Tier 1 (`docs/infra/convencoes-frontend-infra.md` e este
documento, seção Input), mas "Tags" nunca ganhou uma linha própria em
`docs/design/catalogo-componentes.md` nem foi implementado — passou
despercebido até a captura chegar.

- Construído sobre a família `TagsInput*` da Reka UI (`TagsInputRoot`/
  `TagsInputItem`/`TagsInputItemText`/`TagsInputItemDelete`/
  `TagsInputInput`) — mesmo caminho de "não reinventar primitivo
  acessível do zero" já usado em todo o resto do design system
  (navegação por teclado entre chips, Backspace apaga o último chip com
  input vazio, Enter/vírgula adiciona um novo, tudo resolvido pelo
  primitivo).
- **Mesma variante A/B do resto da família "Form"** (`label` prop):
  sem `label`, é a caixa "solta" (padding `{spacing.8} {spacing.16}`,
  mesmo padrão do Input-A); com `label`, vira a caixa "boxed" da captura
  do usuário (legenda `{colors.ink-40}`/`{typography.label}` em cima,
  padding `{spacing.16} {spacing.20}`).
- **Chip reaproveita os tokens do `Badge.vue` variante `gray`**
  (`{colors.ink-4}` de fundo, `{radius.4}`, padding `1px {spacing.4}`) —
  mesmo visual já validado nessa combinação em outro componente, não um
  valor novo inventado. `TagsInputItemDelete` (o "×" do chip) não tem
  fallback de conteúdo no primitivo — precisa do ícone `X` (12px, mesmo
  tamanho fixo do `icon-before`/`icon-after` do `Badge`) passado
  manualmente no slot default.
- **Ícone `CaretUpDown` à direita é só decorativo** — mantém a mesma
  linguagem visual dos outros campos "boxed" da família Form
  (Select/DatePicker), mas este componente não abre popover nenhum,
  digitação e chip acontecem direto na própria caixa. Documentado assim
  de propósito no comentário do template, pra não alguém achar que é
  affordance de abrir algo e tentar conectar comportamento que não existe.
- Model público é `string[]` (`defineModel<string[]>({ default: () =>
  [] })`) — tipo primitivo direto, sem VO/objeto intermediário, já que
  tag aqui é sempre texto livre.
- Verificado em browser real: digitar um texto e apertar Enter adiciona
  um chip novo, clicar no "×" de um chip remove só aquele, estado
  `disabled` bloqueia toda interação — os três estados (solta vazia,
  boxed com 2 chips pré-carregados batendo com a captura do usuário,
  desabilitada) conferidos lado a lado com a referência.

### AppSidebar (`core/layouts/{AppSidebar,AppSidebarContent,AppSidebarNavItem}.vue`)

Infraestrutura desde a Fase 0 (grupos com título, itens expansíveis
recursivos) — **populada com exemplo real em 2026-08-28**, pedido direto
pelo usuário com captura de uma sidebar completa (grupos "Dashboards"/
"Pages", item "User Profile" expandido revelando filhos, seção
"Favorites/Recently" no topo).

- **`navigation.ts` ganhou os grupos de exemplo da captura** — só
  `Default` (era `Dashboard`) mantém `to: { name: 'home' }` de verdade, o
  resto (`eCommerce`/`Projects`/`Online Courses`/`Account`/`Corporate`/
  `Blog`/`Social`, e os 5 filhos de `User Profile`) fica **sem `to`**, de
  propósito: um botão sem `to` e sem `children` não navega a lugar
  nenhum quando clicado — não é a mesma coisa que um link apontando pra
  uma rota que não existe (isso sim seria o "link morto" que o CLAUDE.md
  raiz proíbe). Trocar por rotas reais é trabalho de cada fase de
  `docs/planejamento/plano-implementacao.md` conforme a tela existir.
- **Só `User Profile` ganhou filhos de verdade** (Overview/Projects/
  Campaigns/Documents/Followers) — os outros itens de grupo
  (`eCommerce`/`Projects`/`Online Courses`/`Account`/`Corporate`/`Blog`/
  `Social`) **não têm seta/chevron**, diferente da captura (que mostra
  `>` em quase todo item, a maioria provavelmente decorativa no mockup
  original). Decisão: um chevron que não expande nada ao clicar é uma
  affordance quebrada — pior que não ter chevron nenhum. Só `User
  Profile` tem o comportamento de verdade (dropdown), que era o pedido
  explícito ("exemplo de dropdown").
- **`NavItem.defaultExpanded`** (prop nova) + **`useAppShell().expandItem`**
  (função nova, TDD em `tests/core/layouts/composables/useAppShell.test.ts`) — "User
  Profile" começa expandido, mas `expandItem` é **idempotente** (nunca
  fecha), diferente de `toggleItem`: como `expandedItemIds` é singleton
  em nível de módulo (sobrevive à remontagem do componente), um
  `toggleItem` no `onMounted` fecharia de novo um item que o usuário já
  tinha aberto manualmente e depois o componente remontou (ex.: abrir/
  fechar o drawer mobile) — `expandItem` evita esse bug por construção.
- **Barra indicadora do item ativo** — `{colors.accent-indigo}`, 3px.
  **Correção, reportada pelo usuário em 2026-08-28**: a primeira versão
  sangrava até a borda real da sidebar via `left: -{spacing.16}` (offset
  negativo cancelando o padding do ancestral `.app-sidebar-content`) —
  na prática a barra ficava flutuando solta no espaço vazio à esquerda,
  sem tocar a pill ativa, em vez de parecer um acento grudado nela.
  Corrigido pra `left: 0`, grudada na borda do próprio item — sempre
  visualmente conectada à pill ativa, sem depender do padding exato de
  um ancestral pra calcular um offset que quebra se esse padding mudar.
- **Achado real: chevron usava `CaretDown` girando 180°** — em repouso já
  apontava pra baixo (errado, deveria apontar pra direita quando
  fechado, indicando "expande pra baixo"), e ao "expandir" girava mais
  180° ficando de cabeça pra cima. Corrigido pra `CaretRight` girando
  90° (fechado: aponta direita; expandido: aponta baixo) — convenção
  padrão de "seta de disclosure", confirmada contra a captura.
- **Seção "Favorites/Recently" nova** (`AppSidebarContent.vue`) — 2 abas
  de texto simples (sem pill/sublinhado, só peso/cor), lista de
  favoritos com marcador de ponto (`background-color: currentColor`,
  mesmo truque do `StatusDot`) em vez de ícone. "Recently" **não tem
  nenhum dado real por trás** — o Orbita não rastreia histórico de
  navegação ainda — em vez de inventar itens falsos, mostra um estado
  vazio honesto ("Nenhum item visitado recentemente ainda").
- **Rodapé com a marca Orbita, pedido em seguida (mesmo dia)** — a
  captura mostrava um rodapé próprio (o "❄ snow" do kit Figma, atribuição
  do template, não replicado como está — só a posição/papel de "marca no
  rodapé" foi aproveitada). `AppSidebarContent.vue` virou uma coluna
  (`display: flex; flex-direction: column; height: 100%`) com 2 partes:
  `__scroll` (`flex: 1; min-height: 0; overflow-y: auto` — favoritos +
  grupos de nav, tudo que pode crescer) e `__footer` (`flex-shrink: 0`,
  fora do scroll, sempre visível). **Só funciona com um teto de altura
  real no `<aside>`** — ver achado abaixo.
- **Achado real: `.app-sidebar-desktop` não tinha teto de altura** — só
  herdava a altura esticada da linha flex de `.app-layout`
  (`min-height: 100vh`, não um teto). Se o conteúdo da sidebar crescesse
  mais que a viewport, o `<aside>` crescia junto (sem limite), o
  `overflow-y: auto` do `__scroll` nunca entrava em ação, e o rodapé com
  a marca saía da tela rolando junto com o resto da página — exatamente
  o problema que motivou o pedido ("a sidebar deve ter o máximo de
  100vh... daí o logo fica sempre visível"). Corrigido com
  `height: 100vh` + `position: sticky; top: 0;` em `.app-sidebar-desktop`
  (`AppSidebar.vue`) — a sidebar inteira passa a ter sempre o tamanho
  exato da viewport (rolando só internamente se precisar), o rodapé
  nunca sai da tela. Confirmado num viewport de 500px de altura (bem
  menor que o conteúdo real da sidebar): `sidebarHeight` trava em 500px
  (nunca cresce), rolar a lista de navegação não move o rodapé, rolar a
  página inteira não move a sidebar. Drawer mobile não precisou de
  ajuste — já era `position: fixed; top: 0; bottom: 0;`, efetivamente já
  travado na altura da viewport.
- **Usuário logado no topo, pedido em seguida (mesma sessão, nova
  captura)** — `Avatar.vue` (`{size.32}`, fallback de iniciais — `USER`
  não tem campo de foto) + nome, dado real de `useAuthStore` (seção 5 de
  `docs/infra/convencoes-frontend-infra.md`), primeiro consumidor da
  store fora de `main.ts`. `v-if="authStore.user"` — sem usuário
  logado (`user: null`), o bloco inteiro some, sem placeholder inventado
  (confirmado em browser real: bloco ausente do DOM, sem erro). Fica
  dentro de `__scroll` (rola com o resto do conteúdo, só o rodapé com a
  marca é que fica fixo) — mesma posição da captura, que mostra o
  usuário no topo da lista rolável, não fixo como o rodapé.
- Verificado em browser real, claro e escuro (`data-theme="dark"`
  simulado): grupos/dropdown renderizam batendo com a captura, barra
  ativa visível em `Default`, expandir/colapsar `User Profile` funciona,
  trocar pra aba "Recentes" mostra o estado vazio, tema escuro resolve
  sozinho via os tokens já cabeados (nenhum código condicional novo),
  usuário logado (nome real de um `AuthUser` mockado só pra
  verificação, revertido depois) renderiza avatar + nome no topo, marca
  Orbita sempre visível no rodapé mesmo com a lista de navegação maior
  que a viewport.
- **Achado real, reportado pelo usuário testando no mobile de verdade,
  2026-08-28**: fundo do drawer mobile aparecia transparente (conteúdo da
  página vazando através dele). Causa: `.app-sidebar-drawer` usava
  `$color-bg-2`, cujo valor no tema escuro é branco a 4% de opacidade
  (`rgb(255 255 255 / 4%)` — valor real do token de origem Figma, correto
  como está: pensado pra ser composto POR CIMA de uma superfície `bg-1`
  opaca dentro da mesma pilha de camadas, não um fundo sólido isolado). O
  drawer é `position: fixed` num portal (`vaul-vue`/`DrawerPortal`), sem
  `bg-1` garantido logo atrás dele na pilha de pintura — só o overlay
  semitransparente e o que estiver por trás — então a composição ficava
  translúcida em vez de um cinza escuro sólido. A coluna estática do
  desktop (`.app-sidebar-desktop`) usa o mesmo `$color-bg-2` e continua
  correta — ali tem `$color-bg-1` sólido do `body` imediatamente atrás na
  mesma pilha, a composição resulta opaca por coincidência de contexto,
  não por acaso do token estar "errado". Corrigido trocando só o drawer
  pra `$color-bg-1` (opaco nos dois temas) — mesmo token que `Modal.vue`/
  `Drawer.vue` (os outros dois componentes de superfície isolada em
  portal) já usavam desde sempre; `AppSidebar.vue` era o único que tinha
  copiado `$color-bg-2` da coluna estática sem considerar que o contexto
  de pintura é diferente. Confirmado via `getComputedStyle`: fundo do
  drawer resolve pra `rgb(255, 255, 255)` sólido no claro (era
  translúcido antes), visualmente opaco no escuro também.
- **Achado real, reportado pelo usuário no mobile de verdade, mesmo dia
  — "conteúdo puxado pra direita" ao abrir o menu**: não era o
  `AppSidebar` nem o `DataTable` (o próprio usuário desconfiou dos
  gráficos/tabelas, mas o wrapper do `DataTable` já continha o overflow
  corretamente, `overflow-x: auto` funcionando). Causa raiz: o
  `<ol data-sonner-toaster>` do `vue-sonner` (`App.vue`, sempre montado,
  mesmo sem nenhum toast visível) — a media query própria do pacote pra
  mobile (`@media (max-width: 600px)`, `node_modules/vue-sonner/lib/index.css`)
  seta `left`/`right` (16px cada) E `width: 100%` no MESMO elemento
  `position: fixed`, sobre-restringido; por spec CSS, `right` é ignorado
  quando `left`+`width` já fecham a conta sozinhos, deixando o elemento
  16px mais largo que a viewport. Um `position: fixed` que estoura a
  viewport conta pro `scrollWidth` da PÁGINA INTEIRA mesmo sem nenhum
  toast visível — isso dava scroll horizontal em toda a página. Ao rolar
  1px que fosse pra direita e depois abrir o drawer (que trava
  `body { overflow: hidden }` mas não reseta `scrollLeft`), o `AppHeader`
  `sticky` (fixo só no eixo vertical) ficava desalinhado do
  drawer/overlay (`position: fixed`, sempre relativos à viewport, nunca
  afetados por scroll horizontal), expondo a fresta que o usuário viu.
  **Corrigido na raiz, não com remendo local**: `overflow-x: hidden` em
  `html, body` (`core/styles/_reset.scss`) — nenhum elemento (nosso ou de
  terceiro) deveria conseguir esticar a PÁGINA horizontalmente; containers
  com `overflow-x: auto` próprio (`DataTable`) continuam funcionando
  normalmente, só o scroll do documento é bloqueado. Confirmado via
  Playwright: `window.scrollTo(50, 0)` não move mais `window.scrollX`
  (fica em `0`), e `.ui-data-table-wrapper` continua aceitando
  `scrollLeft` normalmente (`clientWidth: 294`, `scrollWidth: 627`, sem
  regressão).
- **Regressão real causada pela correção acima, pega implementando a
  primeira página com conteúdo mais alto que a viewport (2026-08-28)**: a
  correção original pôs `overflow-x: hidden` em `html` **E** `body` — por
  spec CSS, `overflow-x` diferente de `visible` força o `overflow-y` do
  MESMO elemento a virar `auto` (não fica `visible` num eixo com o outro
  travado). Como `html, body, #app` já forçam `height: 100%` (viewport
  inteira) nos três, o `body` também ganhar `overflow-x: hidden` o
  transformava num container de scroll independente
  (`overflow-y: auto` forçado + altura travada) — o conteúdo que
  overflowava passava a rolar dentro do `scrollTop` do `<body>`, nunca do
  `<html>`/viewport. `window.scrollTo()`/`window.scrollY` só enxergam
  `document.scrollingElement` (`<html>` em modo standards) — com o scroll
  real preso dentro do `<body>`, a página parecia simplesmente não rolar
  (`scrollY` sempre `0`, mouse wheel sem efeito nenhum no nível do
  documento). **Achado colateral, sério**: o teste que "confirmou" o
  header sticky logo depois da correção original (`getBoundingClientRect().top`
  igual a `0` depois de "rolar") era um falso positivo — com a página
  travada em `scrollY: 0`, o header nunca precisava ficar sticky de
  verdade pra esse valor bater. Corrigido pondo `overflow-x: hidden`
  **só em `html`** — `body` mantém `overflow-y: visible` de verdade, o
  overflow de `#app` propaga pra `<html>` normalmente (que vira o
  elemento de scroll real), sem perder a proteção horizontal. Confirmado
  depois da correção: `window.scrollTo(0, 900)` → `window.scrollY` vira
  `900` de verdade (antes: `0`), `getBoundingClientRect().top` do header
  continua `0` com scroll real acontecendo (não mais vacuamente
  verdadeiro), e o teste original do bug do `vue-sonner` (`scrollX`
  travado em `0`, `.ui-data-table-wrapper` com scroll próprio) continua
  passando sem regressão.

**Menu real + Favoritos/Recentes de verdade, 2026-08-31** — pedido direto
do usuário ("organização do menu, hoje tá cheio de dado mockado"):

- **`core/layouts/config/navigation.ts` reescrito do zero.** Os grupos de
  exemplo do Figma (eCommerce/Online Courses/User Profile com filhos/
  Corporate/Blog/Social) saíram — substituídos pelos Bounded Contexts
  reais do Orbita (`CLAUDE.md` raiz): **Catálogo** (Produtos, único item
  com `to` real hoje), **Marketplaces** (Canais disponíveis/Minhas
  conexões — Pricing, backend 100% pronto em `pricing.php`, telas da
  Fase 4 ainda não construídas), **Assinatura** (Meu plano/Faturas —
  Billing, pendência real da Fase 2) e **Administração** (só
  `admin_master` — Usuários/Planos/Marketplaces/Assinaturas/Transações/
  Notificações/Configurações/Auditoria, namespace `/v1/admin/*` inteiro
  já existe no backend, Fase 6 não construída no front). A maioria dos
  itens continua sem `to` de propósito (mesma regra de "nunca link
  quebrado, mas item inerte é diferente" já documentada) — "planejar a
  rota" aqui significa a ESTRUTURA/agrupamento já refletir o app final,
  trocando `to` conforme cada fase entrega a view real.
- **`NavGroup.roles?: UserRole[]`** (novo campo) — filtra a VISIBILIDADE
  do grupo inteiro. `AppSidebarContent.vue` computa `visibleNavGroups`
  (`navGroups.filter(...)`) comparando contra `authStore.user.role` —
  mesma régua de controle de acesso do resto do projeto (só `USER.role`,
  sem granularidade extra).
- **`label`/`title` de `navigation.ts` resolvidos via `i18n.global.t()`
  no MÓDULO** (não `useI18n()`, que exige contexto de componente) — mesmo
  padrão já usado em `core/router/guards.ts` pro `document.title`. Achado
  real: os labels desse arquivo (e as strings "Favoritos"/"Recentes"/
  estado vazio do `AppSidebarContent.vue`) estavam soltos em português
  direto no código, violando a regra não-negociável de i18n desde que o
  arquivo foi criado — corrigido junto.
- **"Recentes" agora rastreia navegação de verdade** —
  `useAppShell().recordVisit()`, chamado de `router.afterEach`
  (`core/router/guards.ts`) em toda navegação com `meta.title` que não
  seja rota de guest nem de onboarding (`skipOnboardingChecks` —
  verify-email/choose-plan/billing-result são passos de um fluxo, não
  páginas que alguém "revisita"). Lista de até 5 páginas, mais recente
  primeiro, revisitar uma página existente move ela pro topo em vez de
  duplicar. Persistido em `localStorage` (`orbita-recent-pages`) —
  conveniência por DISPOSITIVO, não dado de conta, não precisa de
  round-trip com o backend. Test-first
  (`tests/core/layouts/composables/useAppShell.test.ts`).
- **"Favoritos" agora lê `authStore.user.favorites`** (dado de CONTA,
  precisa vir do backend) — endpoint ainda não existe, mensagem enviada
  pra sessão `backend-c5` em 2026-08-31 pedindo `POST`/`DELETE` de
  favoritos e inclusão da lista em `GET /auth/me` (mesmo endpoint que já
  devolve `requires_subscription`, evita uma consulta extra só pra isso).
  `modules/identity/types/user.type.ts` já lê o campo via um cast
  estreito (`UserResourceWithFavorites`, nunca `any` solto) — até o
  schema gerado trazer `favorites` de verdade, a lista fica sempre vazia
  (estado honesto). **Sem affordance de "adicionar favorito" ainda** —
  um botão sem endpoint por trás seria botão morto (regra já aplicada no
  `ListToolbar` do CRUD de Produtos); entra quando o backend responder.
- Verificado em browser real: `user` comum não vê o grupo "Administração",
  `admin_master` vê; navegar pra `/products` faz "Produtos" aparecer na
  aba "Recentes" imediatamente.

**Grupo "Dashboards" + bug real de item ativo, mesmo dia** — o rewrite
acima esqueceu o dashboard (só sobrava acessível pelo logo/breadcrumb,
sem entrada própria na sidebar), reportado pelo usuário na sequência.
Adicionado `dashboardGroup` (`navigation.ts`, primeiro grupo da lista) com
um item só, "Padrão" (`to: { name: 'home' }`) — nome no plural
("Dashboards") porque antecipa outros dashboards nomeados entrando no
mesmo grupo depois, sem forçar isso agora.

- **Achado real, no mesmo teste**: com o item "Padrão" adicionado, ele
  aparecia marcado como ativo em QUALQUER rota (ex.: navegando pra
  `/products`, "Padrão" continuava destacado junto com "Produtos").
  Causa: `AppSidebarNavItem.vue` estilizava `.router-link-active` (classe
  NÃO-exata que o `RouterLink` do Vue Router aplica), e o item "Padrão"
  aponta pra `home` — path `/`, ancestral de toda rota do app (tudo
  debaixo de `AppLayout` mora sob `/`). `router-link-active` marca
  positivo pra "rota atual OU qualquer descendente dela", então
  `/products` sempre "contava" como ativo pro link da raiz — pegadinha
  clássica do Vue Router com link pra rota `/`, só ficou visível agora
  porque antes não existia nenhum link apontando pra uma rota cujo path
  fosse exatamente `/`. **Corrigido** trocando pra
  `.router-link-exact-active` (classe que só marca quando a rota atual é
  EXATAMENTE aquela, nunca um descendente) — é o seletor certo pra
  destacar item de menu, deveria ter sido a escolha desde o início.
  Verificado em Playwright: em `/`, "Padrão" fica ativo; em `/products`,
  só "Produtos" fica ativo, "Padrão" não mais.

**Grupo "Administração" segmentado em 3, 2026-09-01, pedido direto do
usuário** ("reordenar o menu, tem muita coisa num grupo chamado
administração, da pra segmentar por plataforma, financeiro, usuarios")
— o único `adminGroup` (8 itens: Usuários/Planos/Marketplaces/
Assinaturas/Transações/Notificações/Configurações/Auditoria, todos sob
`roles: ['admin_master']`) virou 3 `NavGroup` independentes na mesma
posição da lista (`navGroups`), todos ainda `roles: ['admin_master']`,
agrupados por ÁREA de produto (o pedido foi por área, não por Bounded
Context técnico 1:1):

- **`adminUsersGroup`** ("Usuários") — só `admin-users` (Identity).
- **`adminFinanceGroup`** ("Financeiro") — `admin-plans`/
  `admin-subscriptions`/`admin-transactions` (Billing).
- **`adminPlatformGroup`** ("Plataforma") — `admin-marketplaces`
  (Pricing) + `admin-notifications`/`admin-settings`/`admin-audit-logs`
  (Platform) — agrupados juntos porque são todos "operação da
  plataforma em si", não dinheiro nem conta de usuário.

Nenhum item mudou de `to`/ícone — só reagrupados, mesmos 8 itens de
antes. **Achado de polish, corrigido no mesmo PR**: com o item único de
`adminUsersGroup` reaproveitando a mesma chave i18n do título do grupo
(`sidebar.nav.adminUsers` = "Usuários"), o breadcrumb ficava "Usuários /
Usuários" (grupo e página atual com o mesmo texto) — mesmo padrão que
`dashboardGroup`/`marketplacesGroup` evitam de propósito (título do
grupo genérico/plural, label do item mais específico: "Dashboards" →
"Padrão", "Marketplaces" → "Canais de venda"). Corrigido trocando o
valor de `sidebar.nav.adminUsers` pra "Contas de usuário" — chave nova
`sidebar.nav.adminUsersGroup` ("Usuários") cobre só o título do grupo,
sem tocar `identity.admin.users.title` (h1 da página, continua
"Usuários", inalterado). Verificado em browser real: sidebar mostra os
3 grupos separados com os itens corretos, breadcrumb em `/admin/users`
mostra "Usuários / Contas de usuário", sem duplicação.

**Reorganização "1 item = não é grupo", 2026-09-01, pedido direto do
usuário** ("ficou um item por grupo... veja uma organização q fique
pelo menos 2 itens por grupo, menos a dashboard isso vamos mexer
depois") — no fim da sessão de Support (Fase 8), a sidebar tinha
acumulado 4 grupos com 1 item só: `catalogGroup` (Produtos),
`marketplacesGroup` (Canais de venda), `supportGroup` (Meus chamados,
recém-criado) e `adminUsersGroup` (Contas de usuário, da segmentação
acima). `Dashboards` (1 item, "Padrão") ficou explicitamente EXEMPTO —
"isso vamos mexer depois", não uma omissão.

- **`operationGroup`** (novo) — funde os 3 grupos sem `roles` (visíveis
  pra `user` E `admin_master`, mesma visibilidade preservada 1:1, união
  óbvia): Produtos, Canais de venda, Meus chamados. Sem forçar um
  Bounded Context único no título (Catalog/Pricing/Support são 3
  contextos técnicos distintos) — "Operação" é o nome de ÁREA (mesmo
  critério dos 3 grupos admin acima) que cobre o dia a dia do vendedor
  fora de cobrança/administração.
- **`adminUsersGroup` desfeito** — seu único item ("Contas de usuário")
  virou o PRIMEIRO item de `adminPlatformGroup` (agora 6 itens:
  Contas de usuário/Marketplaces/Notificações/Configurações/Auditoria/
  Chamados). **Contradição registrada, não escondida**: a segmentação
  original (parágrafo acima) justificava `adminPlatformGroup` como "não
  dinheiro nem conta de usuário" — exatamente o oposto do que essa
  fusão faz. Motivo: não sobrava nenhum OUTRO grupo `roles:
  ['admin_master']` com 1 item só pra parear (`adminFinanceGroup` já
  tinha 3, `Financeiro` e `Usuários` combinariam pior temáticamente que
  `Plataforma`, que já era um "resto de administração" heterogêneo antes
  disso). A exceção é sobre densidade mínima de itens por grupo, não
  uma reversão da lógica de categorização original.
- Nenhum item mudou de `to`/ícone/rota — só reagrupados, mesma técnica
  da segmentação anterior. Chaves i18n mortas removidas do catálogo
  (`sidebar.nav.catalog`/`marketplaces`/`support`/`adminUsersGroup` —
  eram só título de grupo, sem mais nenhum consumidor).
- Verificado em browser real, 2 contas (`user`/`admin_master`): sidebar
  do usuário comum mostra "Operação" (3 itens) + "Assinatura" (2 itens)
  — nenhum grupo de 1 item, exceto "Dashboards"; sidebar do admin mostra
  os mesmos + "Financeiro" (3) + "Plataforma" (6, com "Contas de
  usuário" primeiro).

### AppHeader (`core/layouts/AppHeader.vue`)

**Reconstruído em 2026-08-28, pedido direto do usuário com captura real**
(header claro e escuro lado a lado) — o header antigo (título de página +
sino + botão de conta placeholder) vira: botão de ocultar sidebar,
favorito, breadcrumb, tema, histórico de navegação, notificações. Sem
busca (`search não precisa`, dito explicitamente) e sem o botão de conta
(`UserCircle`) que existia antes — o usuário logado já mora no topo da
sidebar (`AppSidebarContent.vue`, seção `AppSidebar` acima), duplicar
aqui seria redundante.

- **Botão de ocultar/exibir sidebar** (`SidebarSimple`) — um botão só,
  comportamento por viewport via `useMediaQuery('(max-width: 1023px)')`
  (mesmo breakpoint já usado pelo `Drawer.vue`): no mobile chama
  `toggleMobileNav` (abre/fecha o drawer já existente), no desktop chama
  `toggleDesktopSidebar` (novo). `useAppShell.ts` ganhou
  `isDesktopSidebarCollapsed`/`toggleDesktopSidebar` (TDD, mesmo padrão
  de `toggleMobileNav`) — `AppSidebar.vue` aplica
  `.app-sidebar-desktop--collapsed { display: none !important; }`
  (`!important` necessário pra vencer o `display: flex` da media query,
  mesma especificidade, mesmo seletor).
- **Favorito** (`Star`) — **casca pronta, sem dado real por trás** (mesmo
  critério do `AppFooter`/`DatePicker`/`TagsInput` antes de uma tela
  real existir): não há conceito de "favoritar página" no domínio do
  Orbita hoje, então o botão não persiste nem alterna estado — só existe
  visualmente, pronto pra ganhar lógica quando o caso de uso aparecer.
- **Breadcrumb** — troca o antigo `<h1>{{ route.meta.title }}</h1>` por
  `Breadcrumb.vue` (já existente, Tier 9), alimentado por um composable
  novo, `core/layouts/composables/useBreadcrumb.ts`. A trilha é calculada em cima da
  MESMA árvore `navGroups` que já alimenta a sidebar (`navigation.ts`) —
  não é um `meta` novo duplicando essa informação nem uma trilha digitada
  à mão: acha a rota ativa por `to.name` dentro dos grupos (e dos
  `children`, um nível), breadcrumb vira `[grupo, item]`. O grupo entra
  como link (aponta pro primeiro item navegável dele — grupos não têm
  rota própria) porque é isso que o `Breadcrumb.vue` já usa pra decidir
  "ancestral apagado" (`{colors.ink-40}`, tem `to`) vs. "página atual"
  (`{colors.ink}`, sem `to`, sempre o último) — sem essa regra, o
  breadcrumb ficaria com os dois itens na mesma cor. Rota sem
  correspondência em `navGroups` (vai acontecer bastante, a árvore de
  exemplo só cobre "Default" com rota real) cai pro `route.meta.title`
  sozinho, mesmo texto que o header mostrava antes desta mudança — nunca
  quebra por falta de entrada na árvore. **Test-first**: a lógica de
  achar a trilha (`resolveBreadcrumbItems`) foi extraída como função pura
  (sem `useRoute()`) especificamente pra ser testável sem montar um
  router de verdade — nenhum outro teste do projeto monta
  `createRouter`/`createMemoryHistory` ainda, e não valia introduzir essa
  infra só pra este caso; `useBreadcrumb()` em si é só o wrapper fino que
  chama `useRoute()` por cima, mesmo critério de "wrapper fino não
  precisa de teste próprio" já usado no `useToast.ts`.
- **Tema** (`Sun`, ícone fixo — não alterna pra `Moon` no escuro, a
  captura do usuário mostra o mesmo ícone nos dois exemplos) — primeira
  implementação real de toggle de tema do projeto, resolvendo o gap
  "Modo escuro sem toggle" registrado desde a Fase 0 (ver "Known Gaps").
  Novo composable `shared/composables/useTheme.ts`: singleton em nível de
  módulo (mesmo padrão de `useAppShell.ts`), persiste em
  `localStorage` (`orbita-theme`) e aplica `data-theme` em
  `document.documentElement` — sem preferência salva, o tema NÃO é
  forçado (`_tokens.scss` já resolve sozinho via `prefers-color-scheme`);
  só depois de um toggle a preferência explícita passa a sobrepor o SO.
  Test-first: toggle + persistência + aplicação do atributo, mesmo rigor
  do `useAppShell.test.ts`.
- **Histórico de navegação** (`ClockCounterClockwise`) — literal: chama
  `router.back()`. Não existe (nem existirá neste MVP) um "histórico de
  navegação" com dado próprio — a aba "Recentes" da sidebar já documenta
  isso como estado vazio honesto (seção `AppSidebar` acima) — então a
  interpretação mais direta e correta do pedido é o histórico real do
  navegador/router, não uma feature nova de tracking.
  **Achado real, reportado pelo usuário logo em seguida**: `router.back()`
  chama `window.history.go(-1)` por baixo, que opera sobre o histórico de
  browser INTEIRO, não só sobre a navegação da SPA — numa aba sem
  navegação interna ainda (aba nova, ou depois de um reload), "voltar"
  saía do próprio app pra qualquer entrada anterior do histórico real do
  browser, inclusive uma origem/porta completamente diferente (caiu em
  `localhost:5175`, sobra de uma aba que já tinha passado por outra
  porta do Vite antes). Corrigido com uma guarda: `goBack()` só chama
  `router.back()` quando `window.history.state?.back` existe — esse
  campo é escrito pelo próprio Vue Router (`createWebHistory` grava
  `{ back, current, forward, ... }` a cada navegação DA SPA), então é
  `null` quando não há navegação interna real pra voltar, e o botão vira
  um no-op nesse caso em vez de escapar pra fora do app. Confirmado com
  Playwright numa aba nova (sem navegação prévia): clicar "Voltar"
  mantém a mesma URL, não navega pra lugar nenhum.
- **Notificações** (`Bell`) — mantido tal como já existia
  (`toggleNotificationPanel`, ponto de não-lida).
- **4º ícone da captura não implementado** — a referência do usuário
  tinha um ícone a mais à direita (tipo livro/painel dividido) não citado
  no pedido em texto. Sem função definida no Orbita hoje (nenhuma feature
  de "painel direito"/layout alternativo existe) — mesmo critério de não
  inventar affordance sem propósito já usado no resto do design system;
  revisitável se um pedido futuro esclarecer o que deveria fazer.
- Verificado em browser real (Playwright, viewport 1280×800 e depois
  390×844), luz e escuro: breadcrumb mostra "Dashboards / Default" pra
  rota `home`; exatamente 5 botões no header, sem input de busca; toggle
  de sidebar esconde/reexibe `.app-sidebar-desktop` no desktop e abre o
  drawer mobile (`.app-sidebar-drawer`) no viewport pequeno, nunca os
  dois ao mesmo tempo; toggle de tema aplica `data-theme` no
  `documentElement`, muda o fundo do header pra `rgb(51, 51, 51)`
  (`{colors.bg-2}` escuro) e persiste em `localStorage`; botão de
  histórico navega de volta via `router.back()`; sino continua abrindo o
  painel de notificações.
- **2 achados reais, reportados pelo usuário testando no mobile de
  verdade, mesmo dia**:
  1. **Header "encavalado" no mobile** — ícone de ocultar sidebar,
     favorito, breadcrumb e os 3 ícones de ação disputavam a mesma linha
     estreita. Corrigido com uma "sub-bar": abaixo de `$breakpoint-md`, o
     `Breadcrumb` (movido pra ser filho direto de `.app-header`, não mais
     aninhado em `.app-header__left`) quebra pra própria linha via
     `order: 2; flex-basis: 100%;` num `.app-header` com
     `flex-wrap: wrap` — linha 1 fica só com os ícones
     (`.app-header__left` + `.app-header__actions`, este com
     `order: 1; margin-left: auto;` pra ficar no fim da linha 1), linha 2
     é o breadcrumb sozinho, mesmo header (mesmo fundo/padding, não é
     componente separado). No desktop (`min-width: $breakpoint-md`), os 3
     resets (`order: 0` nos dois, `flex-basis: auto` no breadcrumb,
     `flex-wrap: nowrap`) devolvem a ordem natural do DOM — visualmente
     idêntico à versão de antes (esquerda+breadcrumb agrupados, ações no
     fim da única linha).
  2. **Header precisa ficar fixo no topo sempre** — não tinha
     `position: sticky` nenhum, rolava junto com `.app-layout__content`
     feito qualquer elemento normal do fluxo. Corrigido com
     `position: sticky; top: 0; z-index: 20;` — o `z-index` fica acima do
     conteúdo normal da página mas abaixo do overlay/drawer mobile
     (40/50) e do `Modal` (100), pra sticky nunca competir com eles
     quando abertos. Confirmado via Playwright: `getBoundingClientRect().top`
     do header continua `0` depois de rolar a página 600px (mobile) e
     1200px (desktop) — sem o fix, o valor ficaria negativo (header
     rolado pra fora da viewport).

**Botão de favoritar ligado, 2026-08-31** — endpoint implementado pela
sessão `backend-c5` (`POST /favorites`, `DELETE /favorites/{id}`,
`favorites` incluído em `GET /auth/me`/`POST /auth/login`), completando o
que ficara como casca inerte desde a reconstrução de 2026-08-28 ("não
existe favoritar página no domínio do Orbita hoje"). Fechou também um bug
real na leitura: a implementação temporária (cast estreito em
`user.type.ts`, enquanto o endpoint não existia) lia `resource.favorites`
de DENTRO de `UserResource` — mas o campo real chega como IRMÃO de `user`
em `LoginResultResource` (`{ user, requires_subscription, favorites }`),
nunca aninhado. Ou seja, mesmo que o backend já tivesse implementado
antes, a lista sempre resolveria vazia com o mapper antigo — corrigido
passando `favorites` como parâmetro explícito de `toAuthUser()`, extraído
do campo certo em cada call site (`useLoginForm.ts`/`guards.ts`/
`useVerifyEmail.ts`); `useUpdateProfileForm.ts` preserva
`authStore.user.favorites` (resposta de `PATCH /auth/me` não inclui o
campo), mesmo padrão já usado ali pra `requiresSubscription`.

- **`useFavorites.ts` vive em `core/layouts/composables/`, não em
  `modules/platform/`** — apesar de `USER_FAVORITE` morar no contexto
  `Platform` no backend, favoritar aqui é conveniência de navegação da
  sidebar, não feature de negócio, e um módulo nunca importa de outro
  módulo diretamente (`docs/infra/convencoes-frontend-infra.md` seção 2).
  `toFavoriteItem()` (mapper `UserFavoriteResource → FavoriteItem`) subiu
  de `modules/identity/types/user.type.ts` pra `core/store/types/auth.type.ts`
  pelo mesmo motivo — os dois módulos (`identity`, ao ler `/auth/me`/
  `/auth/login`; e o próprio `core/layouts`, ao ler a resposta de
  `POST /favorites`) precisam dele, e `core/` é o único lugar que os dois
  já podem importar sem cruzar módulos.
- **Favorita/desfavorita a PÁGINA ATUAL** (`route.name`/`route.meta.title`,
  resolvido via `i18n.global.t()` — mesmo padrão de `recordVisit()`) — só
  aparece (`v-if`) quando a rota é "favoritável", mesmo critério já usado
  por "Recentes": precisa de `name`+`title`, nunca rota de guest
  (`requiresGuest`) nem passo de onboarding (`skipOnboardingChecks`).
  Antes disso o botão era sempre visível (mesmo em `/login`) só que
  inerte; agora ele nem renderiza fora de uma página de conteúdo real.
- **Cor comunica estado, sem trocar de ícone** (`{colors.accent-yellow}`
  quando a página atual já é favorito) — mesmo critério de
  `StatusDot`/`Badge`; o conjunto de ícones gerado não tem uma variante
  "preenchida" do `Star`, então não dava pra sinalizar trocando o ícone.
- **Remover também é possível direto na lista da sidebar**
  (`AppSidebarContent.vue`, botão `X` por item, só visível no hover/foco)
  — útil pra desfavoritar uma página em que não se está navegando no
  momento; sincroniza com o botão do header porque os dois leem/escrevem
  o mesmo `authStore.user.favorites`.
- **`addFavorite` espera a resposta da API antes de mutar a store**
  (precisa do `id` real gerado pelo backend, sem ele não dá pra remover
  depois); `removeFavorite` já atualiza otimisticamente (tem o `id` de
  antemão) e reverte se a chamada falhar.
- **4 aria-label do `AppHeader` que estavam soltas em português direto no
  template corrigidas no mesmo PR** (achado colateral, não pedido
  explicitamente) — violavam a regra não-negociável de i18n desde a
  reconstrução de 2026-08-28, nunca pegas antes. Novo namespace `header`
  em `pt-BR.ts` (`toggleSidebar`/`toggleTheme`/`goBack`/`notifications`/
  `unreadNotifications`); favoritar/desfavoritar usa `common.actions`
  (`favorite`/`unfavorite`), reaproveitável por qualquer outro botão de
  favorito que apareça no futuro.
- Verificado em browser real contra o backend local de verdade (não
  mockado): favoritar "Produtos" no header muda a cor pra amarelo E o
  aria-label pra "Remover dos favoritos"; item aparece na aba "Favoritos"
  da sidebar; **sobrevive a um reload da página** (prova de que o bug de
  leitura foi corrigido — antes disso a lista sempre voltaria vazia,
  mesmo com o registro salvo no backend); desfavoritar pelo header e
  desfavoritar pela lista da sidebar chegam ao mesmo estado (lista vazia,
  botão do header volta a cinza); `/login` não renderiza o botão.

**Botão de voltar reposicionado, 2026-09-01, pedido direto do usuário**
("adicione o botão de volta da navbar ao lado do botão de sumir com a
sidebar antes do breadcrumb e coloque uma seta de ir pra trás como
ícone") — morava em `.app-header__actions` (fim do header, depois do
toggle de tema), com o ícone `ClockCounterClockwise` (relógio/histórico).
Movido pra `.app-header__left`, como o 2º botão (depois do toggle de
sidebar, antes do botão de favoritar e do breadcrumb) — mesmo agrupamento
visual de "controles de navegação do shell" que o toggle de sidebar já
ocupava, separado das ações de página (tema/notificações) que
permaneceram à direita. Ícone trocado pra `ArrowLeft` (seta simples) — o
ícone de relógio, apesar de correto quanto à MECÂNICA (é literalmente
`router.back()`, não um histórico com dado próprio — ver bullet acima),
lia mal como "voltar" à primeira vista; uma seta é a leitura padrão desse
tipo de ação em qualquer produto. `goBack()` em si não mudou — mesma
função, mesma guarda `window.history.state?.back` (evita escapar do app
numa aba sem navegação interna, achado real já documentado acima), só a
posição/ícone do botão.

- Verificado em browser real (Playwright, viewport 1280×800 e depois
  390×844, luz): `.app-header__left` renderiza na ordem
  `SidebarSimple`/"Ocultar/exibir menu" → `ArrowLeft`/"Voltar" →
  `Star`/"Favoritar", com o breadcrumb logo em seguida — a mesma ordem
  no mobile (linha 1 de ícones, breadcrumb quebrando pra linha 2, mesmo
  layout de sub-bar já documentado acima, sem regressão). Clique no botão
  com `window.history.state.back` ausente (aba sem navegação interna, o
  mesmo cenário do achado real documentado acima) confirma que a guarda
  continua ativa — o botão não navega pra fora do app.

### AppFooter (`core/layouts/AppFooter.vue`)

**Pedido direto pelo usuário em 2026-08-28, com captura real do Figma**
— frame "Footer" nunca tinha sido examinado até então (só o frame
"Brand", já descartado como rodapé de marketing com logo/redes sociais,
fora de escopo — `docs/design/catalogo-componentes.md`, seção 4). O
frame real é bem mais simples: copyright à esquerda, links de navegação
à direita, numa barra horizontal.

- **Mesma barra de `AppHeader.vue`, invertida** — mesmo padding
  (`{spacing.16} {spacing.24}`), mas `border-top` em vez de
  `border-bottom` (a barra fica embaixo, não em cima) e fundo
  `{colors.bg-2}` em vez de `{colors.bg-1}` (leve diferenciação do fundo
  da página, mesmo tom "quase branco" já usado em outras seções).
- **Link reaproveita o tratamento exato do `Breadcrumb.vue`**
  (`{colors.ink-40}` apagado, hover `{colors.ink}` + fundo
  `{colors.ink-4}`, `{radius.8}`) — mesmo componente de navegação
  secundária, mesma linguagem visual, sem inventar um estilo de link novo.
- **A captura do usuário mostrava fundo claro e fundo quase preto lado a
  lado — não viraram um prop `variant`.** Interpretado (e confirmado
  visualmente) como o mesmo componente renderizado sob tema claro e tema
  escuro, não dois estilos fixos independentes: `{colors.bg-2}` já
  resolve sozinho pro cinza escuro (`#333333`, o único valor de
  "Background 1" que existe no token de origem pro modo escuro) sob
  `[data-theme='dark']`, sem nenhum código condicional novo (mesmo
  princípio já em toda a seção Iteration Guide). Cogitado e descartado
  usar `{colors.ink}`/`{colors.paper}` pra imitar o preto quase puro da
  captura — a seção "Don't" deste documento já proíbe exatamente esse uso
  (tratar `ink`/`paper` como fixos, quando eles trocam de valor no modo
  escuro) porque um fundo de rodapé "escuro" viraria branco sob o tema
  escuro do próprio app, o oposto da intenção. Sem token de fundo mais
  escuro que `#333333` na escala de origem — a aproximação fica
  documentada aqui, não inventada por cima.
- Props: `copyright?` (default `"© {ano atual} Orbita"`, via
  `dayjs().year()` — nunca hardcoded feito o "© 2025 Snow" da captura,
  que é o placeholder de marca do próprio kit SnowUI) e `links?:
  FooterLink[]` (`{ label, to: RouteLocationRaw }`, mesma forma de
  `BreadcrumbItem`) — default `[]`, sem link fixo pra rota que não existe
  (mesma disciplina de "nunca link morto" já usada no `AppSidebar`).
- **Não montado em `AppLayout.vue`** — nenhuma tela do plano atual define
  o conteúdo real de "Support"/"Contact Us" (nem se essas rotas existem),
  mesmo critério de "casca pronta" do `DatePicker`/`TagsInput` (Tier
  11/12). Consumidor real decide o `links` de verdade quando a rota
  existir.
- Verificado em browser real: copyright + 3 links renderizam como na
  captura no tema claro, hover de link muda cor/fundo corretamente,
  `data-theme="dark"` simulado (sem toggle de UI ainda) confirma o fundo
  virando `#333333` sem nenhuma mudança de código.

### StatusDot (`shared/components/ui/StatusDot.vue`)

**Resolve o gap "Label" do catálogo** (`docs/design/catalogo-componentes.md`,
seção 2) — em aberto desde a Tier 1 como "avaliar se é prop de `Badge`
(`variant=\"status\"`) ou componente próprio `StatusBadge.vue`, decidir na
hora de implementar". Pedido direto pelo usuário em 2026-08-28 com
captura real do frame — a captura resolveu a dúvida sozinha: **não é pill
com fundo**, então não é variante de `Badge.vue`; é ponto colorido + texto
na mesma cor, sem fundo nenhum. Nome final `StatusDot`, não `StatusBadge`
(que sugeriria pill inexistente).

- **Ponto e texto compartilham a mesma cor** — detalhe fácil de perder
  numa primeira olhada (a maioria dos padrões de "status dot" por aí usa
  texto neutro + só o ponto colorido), mas a captura do usuário mostra os
  dois tingidos igual ("In Progress" em texto arroxeado, não preto).
  Implementado com uma prop CSS só: o marcador usa `background-color:
  currentColor`, herdando a cor do texto do elemento pai — uma declaração
  de cor por variante cobre ponto+texto ao mesmo tempo, sem duplicar.
- **`color` é uma paleta genérica de 10 opções** (os 9 acentos de
  `{colors.accent-*}` + `gray`, mapeado pra `{colors.ink-40}` já que não
  existe acento neutro na escala) — **o componente não sabe o que
  "In Progress"/"Approved"/"Rejected" significam**, só recebe a cor já
  escolhida via prop e o texto via slot. Mapeamento status→cor é decisão
  do consumidor (mesma régua de "componente nunca tem regra de negócio",
  seção 3 de `docs/infra/convencoes-frontend-infra.md`) — não existe um
  enum interno tipo `variant="in-progress"` fixando semântica que pode
  variar por contexto de uso (status de assinatura, de transação, de
  margem...).
- **"Rejected" é cinza, não vermelho, na captura real** — resistida a
  tentação de "corrigir" pra `{colors.accent-red}` por semântica
  assumida (rejeitado = erro = vermelho); a captura manda, não a
  convenção mais comum de outros produtos. O consumidor real que quiser
  vermelho pra um estado de rejeição específico pode escolher
  `color="red"` — a paleta cobre esse caso, só não é o default do exemplo.
- Marcador: `{spacing.8}` de diâmetro, `{radius.80}` (círculo) — mesmo
  token de tamanho já usado no ponto de "não lida" do
  `NotificationItem`/sino do `AppHeader`.
- Verificado em browser real contra a captura: as 5 cores do exemplo
  (`indigo`/`green`/`cyan`/`yellow`/`gray`) renderizam com ponto e texto
  na mesma cor, lista vertical compacta batendo com o layout da captura.

**Pulsante, pedido direto pelo usuário em 2026-08-28** — o marcador
ganhou um efeito "ping" (indicador ao vivo): o ponto sólido fica parado,
um `::before` absoluto do mesmo tamanho herdando `currentColor` expande
(`scale(1)` → `scale(2.5)`) e desaparece (`opacity: 0.6` → `0`) em loop
infinito de 1.8s por baixo dele — resolvido com pseudo-elemento, sem
precisar de um segundo `<span>` no template. **Sempre ligado, sem prop
pra desativar** — o pedido foi incondicional ("deixe as bolinhas
pulsantes"), sem menção a precisar de uma variante estática; adicionar
esse controle sem necessidade real seria abstração antecipada (mesmo
critério de "não abstraia pra caso um dia precise" já citado no doc de
convenções). **Sem tratamento de `prefers-reduced-motion`** — mesmo
padrão já usado no `Spinner.vue` (única outra animação em loop infinito
do design system), que também não tem esse guard; não introduzido aqui
de propósito pra não divergir do precedente já estabelecido sem pedido
explícito. Verificado via `getComputedStyle(marker, '::before')`:
`animationName`/`animationDuration: 1.8s`/`animationIterationCount:
infinite` presentes nos 5 exemplos da vitrine.

**Variante `pill`, pedida direto pelo usuário em 2026-08-28 com 2ª
captura** — o Figma tinha as duas variantes lado a lado (a que já estava
implementada, ponto pulsante sem fundo, E uma cápsula com fundo tingido),
não vistas na primeira captura. Prop nova `variant: 'dot' | 'pill'`
(default `'dot'`, pedido explícito de não mexer na pulsante):

- **Fundo derivado da própria `currentColor` via `color-mix()`**
  (`color-mix(in srgb, currentColor 16%, transparent)`), não um segundo
  token de "acento claro" por cor — a escala de origem não tem 10 tons
  pastel prontos (só `{colors.tint-1}`/`{colors.tint-2}`, já usados pra
  outra coisa), e criar 10 tokens novos só pra isso seria inventar fora
  da escala. Reaproveita a mesma declaração `color` que já pinta o texto
  em cada variante `--purple`/`--indigo`/etc., então funciona pra
  qualquer cor da paleta sem precisar de uma segunda regra CSS por cor.
- Sem ponto/pulso na variante `pill` — todo o "indicador ao vivo" fica
  só na variante `dot`, mesma decisão da captura (a cápsula é estática).
- `color-mix()` é CSS moderno (Chrome 111+/Firefox 113+/Safari 16.2+) —
  aceitável aqui pelo mesmo critério que já vale pro `:has()` usado em
  todo o design system (Input/Select/DatePicker/TagsInput), sem guard de
  fallback pra navegador antigo.
- Verificado em browser real: `getComputedStyle` confirma o
  `background-color` resolvido (`color(srgb ... / 0.16)` pro indigo,
  proporcional a cada cor da paleta), as 5 cápsulas da vitrine
  (indigo/green/cyan/yellow/gray) renderizam lado a lado com a lista de
  pontos pulsantes já existente, sem nenhuma mudança na variante `dot`.

### PlanCard (`modules/billing/components/blocks/PlanCard.vue`)

Inspirado numa referência visual mandada pelo usuário (2026-08-30,
mockup de outro produto) pra Fase 2 (Billing) — card de plano com preço,
checklist e CTA. **Sem os pedaços que não se aplicam ao domínio do
Orbita** (pedido explícito): nenhum seletor de marketplace nem plano
"combo" limitado a canal específico — `PLAN` não tem esse conceito
(`docs/negocio/contexto-plataforma-precificacao.md` seção 2.2).

- **Checklist é só os 2 limites REAIS do plano**
  (`max_products`/`max_marketplaces`) — nunca uma lista de features
  inventada sem campo nenhum por trás (a referência tinha ~13 itens
  genéricos de marketing, sem equivalente nos dados reais).
- **Preço/economia calculados fora do componente**
  (`modules/billing/composables/usePlanPricing.ts`, testado —
  `tests/modules/billing/composables/usePlanPricing.test.ts`): plano
  anual mostra `getMonthlyEquivalent` (preço do próprio plano ÷ 12,
  `PLAN.price` é o valor cobrado POR CICLO, não um valor mensal
  separado) como número grande, com nota "*Valor equivalente pra
  comparação" e o valor cobrado à vista; `getYearlySavings` compara
  contra o plano mensal mais barato da mesma lista e só aparece
  (`Economize R$X/ano`) quando a conta dá economia real — nunca um valor
  negativo/zero.
- **Badge "Mais econômico"** (`findMostEconomicalPlan`) é sempre o de
  menor equivalente mensal entre os planos listados, nunca um plano fixo
  por nome/id — sem pill/badge pronto no design system que bata com o
  visual (fundo sólido `{colors.accent-blue}` + texto branco fixo,
  `$color-paper-fixed` — nem `Badge.vue`, só ghost/gray, nem `StatusDot`
  pill, tingido claro), então é markup local do próprio card.
- Bloco puramente de apresentação — nunca chama API, só recebe os
  números já calculados e emite `select`.
- Vive em `modules/billing/components/blocks/`, não em `shared/` —
  primeiro (e único, por ora) consumidor é `ChoosePlanView.vue`. Sobe pra
  `shared/components/blocks/` só quando um segundo consumidor real
  aparecer (ex.: oferta de upgrade no dashboard ao bater limite de plano,
  nó "Upgrade" de `docs/negocio/jornada-usuario.mmd`) — critério de
  promoção já estabelecido na seção 2 de `docs/infra/convencoes-frontend-infra.md`,
  não antecipado agora.
- Verificado em browser real com o payload de verdade do backend
  (`GET /plans`, 2 planos mensais reais — nenhum anual seedado ainda —
  mais um anual mockado pra exercitar a variante) e com o fluxo completo
  de assinatura (ver `DocumentPromptModal` abaixo).

**2 props novas, 2026-08-31 — segundo consumidor real (`MySubscriptionView.vue`,
troca de plano) sem promover o componente pra `shared/` ainda** (continua
só os 2 consumidores dentro de `modules/billing/`, critério de promoção
não cruzado):

- **`isCurrent`**: card representa o plano que o usuário JÁ tem hoje —
  troca o `Button` de CTA por um badge "Plano atual" (fundo `{colors.ink-4}`,
  texto `{colors.ink-40}`, mesma linguagem de "estado neutro" já usada em
  outros badges do design system) — nunca oferece selecionar o próprio
  plano de novo, o backend recusaria com `errorMessageSamePlan`
  (`ChangeSubscriptionPlanAction`). `MySubscriptionView.vue` não passa
  `isCurrent` pra nenhum card na prática — filtra o plano atual da lista
  ANTES de renderizar a grade (`otherPlans`, via `canChangeToPlan`), então
  a prop existe pronta pro caso um consumidor futuro preferir mostrar
  todos os planos com o atual desabilitado em vez de escondido.
- **`ctaLabelOverride`**: sobrescreve o texto do botão — sem isso, "Começar
  agora"/"Assinar com desconto" (cópia de assinatura NOVA) apareciam até
  no contexto de TROCA de plano, achado real ao inspecionar o screenshot
  da primeira versão (`MySubscriptionView.vue` chamando `PlanCard` sem
  essa prop). Corrigido passando `$t('billing.mySubscription.changePlan.cta')`
  ("Trocar de plano") — `null` por padrão preserva o comportamento
  original em `ChoosePlanView.vue`, que não passa a prop.

**Botão de logout em `ChoosePlanView.vue`, 2026-09-01, pedido direto pelo
usuário** — esta view fica fora do `AppLayout` (sem `AppSidebar`/
`AppHeader`; é o passo de onboarding entre cadastro e pagamento,
`skipOnboardingChecks`), então não herdava o botão de logout que já mora
no topo da sidebar (`AppSidebarContent.vue`) — sem saída visível, quem
chegasse aqui numa conta errada (ou só quisesse desistir do onboarding)
ficava preso. Adicionado um `.choose-plan-view__topbar` (`display: flex;
justify-content: space-between`) envolvendo a marca "Orbita" (já
existente) e um `Button` `variant="ghost"` com `icon-before="SignOut"` no
canto superior direito, texto visível (`$t('common.actions.logout')`,
"Sair") — mesmo `useLogout()` (`modules/identity/composables`), mesmo
ícone e mesma chave de tradução já usados no botão da sidebar, mas com o
texto ao lado do ícone (não ícone-só como na sidebar) porque aqui não há
nenhum outro indício visual de "isso é sair" (sem avatar/nome ao lado).
Verificado em browser real: botão aparece no canto superior direito da
tela de planos, clique chama `POST /auth/logout` e redireciona pra
`/login`.

**Feature de trial integrada no front, 2026-09-01** — backend concluiu a
tarefa 54 (`docs/negocio/contexto-plataforma-precificacao.md` seção 6,
`PLAN.is_trial`/`trial_days`) e avisou via mensagem cross-session; usuário
confirmou implementar na hora ("já faça"). 4 pontos de integração:

1. **Tipos regenerados** (`npm run generate:api-types`) — `PlanResource`
   ganhou `is_trial`/`trial_days`, `BillingCycle` ganhou o terceiro valor
   `'trial'`, `SubscriptionCheckoutResource.checkout_url` virou nullable.
   `Plan` (`modules/billing/types/plan.type.ts`) ganhou os 2 campos em
   cima do schema gerado, mesmo padrão de sempre — nunca redigitado à
   mão.
2. **`checkout_url: null` → redirect direto, sem Mercado Pago** —
   assinar/trocar pra um plano trial pula Payment/Transaction/checkout
   inteiro no backend; a resposta chega com `checkout_url: null` em vez
   do link de sempre. `isCheckoutSkipped(checkoutUrl): checkoutUrl is null`
   (type guard, testado em `tests/modules/billing/composables/useSubscribeToPlan.test.ts`)
   isola essa única ramificação de decisão nova — `useSubscribeToPlan.subscribe()`
   e `useSubscription.changePlan()` checam essa guarda antes do
   `window.location.href = checkout.checkoutUrl` de sempre; quando
   `true`, `router.push({ name: 'billing-success' })` no lugar do
   redirect de página inteira. `changePlan()` ganhou a mesma guarda por
   defesa de tipo (o `SubscriptionCheckout` é o mesmo shape das duas
   ações), mesmo trial nunca sendo uma TROCA de plano válida na prática
   (só oferecido a quem não tem nenhum histórico de assinatura — quem já
   está trocando de plano já tem histórico, por definição).
3. **`PlanCard.vue` — texto próprio pro trial, não o genérico
   mensal/anual** (`plan.isTrial`, checado ANTES dos ramos
   `isYearly`/senão): sufixo de preço "por N dias" em vez de "/mês"
   (`billing.choosePlan.card.trialSuffix`), descrição "Acesso completo
   por N dias, sem cobrança no cartão" em vez de "Tenha acesso... pagando
   mensalmente" (`trialDescription`), CTA "Testar grátis" em vez de
   "Começar agora"/"Assinar com desconto" (`ctaTrial`) — sem isso, o
   card mostrava "R$0,00/mês" com o texto de assinatura paga normal, o
   tipo de detalhe que faz um usuário desconfiar que é golpe/bug antes
   de clicar. **`findMostEconomicalPlan` (`usePlanPricing.ts`) passou a
   excluir plano trial do comparativo** (`plans.filter(p => !p.isTrial)`,
   testado) — R$0 sempre venceria trivialmente qualquer plano pago,
   fazendo o badge "Mais econômico" pousar no trial sempre que ele
   aparecesse na lista (aparece pra todo usuário sem histórico) em vez de
   destacar o melhor plano PAGO, que é o propósito real do badge.
4. **`errorMessageTrialNotEligible`** — chave nova no catálogo flat de
   `errorMessage*` (`core/i18n/messages/pt-BR.ts`, mesmo padrão de
   `errorMessageSamePlan`/`errorMessageDocumentRequired` etc.), string
   conferida 1:1 contra `ApiMessageKey::ErrorTrialNotEligible` do backend
   (`app/Domain/Shared/Enums/ApiMessageKey.php`). Nenhuma lógica nova de
   composable precisou — o catch genérico de `useSubscribeToPlan.subscribe()`
   (`toast.error(resolveMessage(apiError.messageKey))`) já cobria
   qualquer chave desconhecida/nova só de existir no catálogo.

Verificado em browser real contra o backend local (seed real, plano
trial `trial_days: 10`): card do Trial renderiza "R$ 0,00 / por 10 dias",
descrição e CTA "Testar grátis" corretos; badge "Mais econômico" pousa no
Starter (plano pago mais barato), não mais no Trial; clicar "Testar
grátis" dispara `POST /subscriptions` (`201`) e redireciona DIRETO pra
`/billing/success` sem passar pelo Mercado Pago; usuário com histórico de
assinatura (simulado via assinatura `expired`) não vê mais o card do
Trial na listagem (comportamento do backend, já correto sem mudança
nenhuma no front) e uma chamada direta pro endpoint com o `plan_id` do
trial devolve `422 errorMessageTrialNotEligible` — a chave nova bate
exatamente com o que o backend manda.

**Bug real, reportado pelo usuário em 2026-09-01 testando o fluxo
completo**: assinou o trial, caiu em "Pagamento aprovado" normalmente,
mas clicar "Ir para o dashboard" travava de volta em `/choose-plan` —
mesmo o usuário confirmando, direto na aba de rede, que `/v1/auth/me` já
respondia `requires_subscription: false`. Causa raiz:
`authStore.requiresSubscription` (`core/router/guards.ts`) só é
hidratado UMA VEZ por carregamento de página (`bootstrapSession()`,
flag `sessionBootstrapped`) — o redirect pro trial é 100% client-side
(`router.push`, nunca sai da SPA), então a store continuava com o valor
de ANTES da assinatura existir, e o guard de rota (que lê a store, não
o backend de novo) mandava de volta pra `/choose-plan` em toda navegação
seguinte. **Mesma classe de bug também adormecida** (não causada por
esta feature, só nunca tinha sido exercitada) em
`BillingCheckoutResultView.handleCta()`: se o poll de confirmação do
Mercado Pago (`useSubscriptionConfirmationPoll.ts`) resolve a assinatura
DEPOIS do primeiro carregamento da tela — cenário realista, é
exatamente pra isso que o poll existe —, a store também nunca era
re-sincronizada antes do clique em "Ir para o dashboard".

Corrigido extraindo `refreshCurrentUser()` (exportado,
`core/router/guards.ts`) de dentro de `bootstrapSession()` — mesma
lógica de sempre (refaz `GET /auth/me`, atualiza `user`/`favorites`/
`planLimits`/`requiresSubscription` na store), só que agora reaproveitável
sem a guarda de "uma vez só". Chamado em 3 pontos, todos ANTES de
navegar: `useSubscribeToPlan.subscribe()` (ramo `isCheckoutSkipped`, antes
do `router.push` pro `/billing/success`), `useSubscription.changePlan()`
(mesmo ramo, defesa de tipo — trial nunca é troca de plano válida na
prática) e `BillingCheckoutResultView.handleCta()` (antes de navegar pro
`home`, cobre tanto o caso do trial quanto o caso do poll). Módulo
`billing` importando de `core/router/guards.ts` é permitido pela regra
de fronteira (`docs/infra/convencoes-frontend-infra.md` seção 2: módulo
pode importar de `core/`, nunca de outro módulo) — mesmo precedente já
registrado em `useLogout.ts` (Identity → `core/store`).

Reverificado em browser real reproduzindo o relato exato do usuário: login
→ assinar trial → `/billing/success` → clicar "Ir para o dashboard" →
`GET /auth/me` disparado de novo → aterrissa em `/` (dashboard renderiza
de verdade, sidebar/header com o usuário certo) → reload confirma que não
é só rota client-side desatualizada (sessão persistida corretamente no
backend).

**2º bug real do mesmo dia, reportado pelo usuário**: na tela "Meu plano"
(`MySubscriptionView.vue`), o campo "Plano atual" mostrava "—" pra quem
está no trial. Causa raiz: `currentPlan` era resolvido cruzando
`subscription.planId` com `plans.plans` (a lista de `GET /plans`,
`useChoosePlan.ts`) — mas `ListActivePlansAction::hidesTrialFor()`
esconde o plano trial de `GET /plans` pra qualquer usuário que já tenha
**qualquer** histórico de assinatura, e a própria assinatura trial ATIVA
do usuário conta como esse histórico. Resultado: assim que alguém assina
o trial, ele some da lista de planos pra ele mesmo, e o front nunca mais
consegue achar o nome pra exibir. Confirmado via `curl` autenticado antes
de pedir a correção — não é bug exclusivo do trial, é sistêmico (qualquer
plano que um dia vire `active: false` teria o mesmo problema).

Não dava pra corrigir só no front — não existe `GET /plans/{id}` nem o
plano embutido em `GET /subscriptions`. Pedido pro backend
(`SubscriptionResource`/`AdminSubscriptionResource` ganharem `plan`
embutido, mesmo shape do `PlanResource`), resolvido no mesmo dia.
`Subscription` (`subscription.type.ts`) ganhou o campo `plan: Plan`
(mapeado via `toPlan(resource.plan)`, reaproveitando o mapper que já
existia) — `MySubscriptionView.currentPlan` virou simplesmente
`subscription.value?.plan`, sem cruzar mais com `plans.plans` (que
continua usada só pro que realmente precisa dela: grade de troca de
plano e `pendingPlan`, este último ainda resolvido por cruzamento porque
o backend não embutiu um `pendingPlan` — trial nunca é alvo de troca de
plano válida, então esse caso específico não recai no mesmo bug).
Reverificado em browser real contra o backend local: "Plano atual" mostra
"Trial" corretamente pra um usuário na assinatura trial.

### DocumentPromptModal (`modules/billing/components/blocks/DocumentPromptModal.vue`)

Aberto quando `useSubscribeToPlan.subscribe()` recebe
`errorMessageDocumentRequired` do backend (`SubscribeToPlanAction`) —
usuário ainda sem CPF/CNPJ cadastrado. "O próprio checkout de assinatura
é o ponto de coleta" no MVP (comentário real do backend, sem tela de
perfil dedicada ainda) — em vez de falhar pro usuário, o card de plano
segue clicável e esse modal pede o documento, revalidando e reenviando a
MESMA assinatura sem precisar clicar de novo no plano.

- Composição de `Modal.vue` + `FormGroup` + `Input` + 2 `Button`, mesmo
  padrão de bloco de `ConfirmDialog.vue` — nunca decide o que fazer com o
  documento validado, só emite `confirm` (quem decide reenviar é
  `useSubscribeToPlan.confirmDocument`).
- Validação (`documentFormSchema.ts`, testado) só confere a CONTAGEM de
  dígitos (11 = CPF, 14 = CNPJ, aceitando formatado ou não) — espelha
  `Document::fromString` (backend) só na parte barata; o dígito
  verificador real (checksum) fica só pro 422 de volta, reimplementar
  esse algoritmo no cliente não valia o custo pra este modal.
- Verificado em browser real: fluxo completo (clicar plano → 422 sem
  documento → modal abre → preenche CPF → confirma → segunda chamada com
  `document` → sucesso → redirect de página inteira pra `checkout_url`).

### BillingCheckoutResultView (`modules/billing/views/BillingCheckoutResultView.vue`)

Uma view só pras 3 `back_urls` reais do Checkout Pro do Mercado Pago
(`MercadoPagoGateway::createCheckout`, backend —
`${FRONTEND_URL}/billing/success`/`/pending`/`/failure`) — sem ela, quem
completasse o pagamento hospedado caía num 404 real ao voltar.
`route.meta.checkoutResult` (`'success' | 'pending' | 'failure'`) decide
a variante ORIGINAL (ícone/cor/texto/CTA); as 3 rotas
(`modules/billing/routes.ts`) só variam esse meta, mesmo componente —
nada de 3 views quase idênticas duplicadas. Reaproveita `AuthLayout.vue`
(mesmo shell de Login/Register/ResetPassword).

**Refresh em tempo real ligado em 2026-08-31** — pedido direto do
usuário ("vamos seguir com o gap 1"), fechando a última pendência real
da Fase 2; só ficou barato de fazer depois do Gap 2 (`pending_plan_id`
em `SubscriptionResource`, ver seção `MySubscriptionView` abaixo) já ter
sido resolvido antes.

- **`useSubscriptionConfirmationPoll.ts`** (`modules/billing/composables/`,
  `isSubscriptionConfirmed` testado como função pura) — `start()`, no
  `onMounted`, captura um SNAPSHOT da assinatura e só liga o poll
  (`useIntervalFn` do `@vueuse/core`, 3s, até 20 tentativas — ~1min,
  desiste em silêncio depois) se houver algo pendente pra confirmar:
  `status: pending` (assinatura NOVA, `SubscribeToPlanAction` já cria a
  linha assim antes do redirect) ou `pending_plan_id` setado (TROCA de
  plano, `ChangeSubscriptionPlanAction` idem). As duas rotas de retorno
  (`/success`/`/pending`) servem os dois fluxos sem diferenciar na
  URL — comparar contra o snapshot inicial (não um valor fixo) é o que
  permite saber qual das duas transições é a que importa aqui.
  "Confirmado" = `status` virou `active` OU `pending_plan_id` voltou a
  `null` — as 2 transições reais de `ConfirmSubscriptionPaymentAction`
  (backend, chamado pelo webhook).
- **`displayVariant` (não `variant`) é o que o template usa** — assim que
  `isConfirmed`, a tela troca SOZINHA pra `success` (ícone/cor/texto/CTA,
  reaproveitando os MESMOS textos/tokens já usados pra assinatura
  aprovada de verdade, zero cópia nova) sem precisar de F5. `failure`
  nunca é alvo de poll (resultado definitivo, sem nada a esperar).
- **Indicador "Verificando confirmação automaticamente..."** (`Spinner`
  14px + texto, `billing.checkoutResult.pending.checking`) — só aparece
  na variante ORIGINAL `pending` enquanto `isPolling`; some sozinho
  quando confirma (a tela já virou `success` nesse ponto) ou quando o
  timeout de tentativas esgota.
- Verificado em browser real contra o backend local, simulando o webhook
  via tinker ENQUANTO a página estava aberta (o cenário real que a
  feature existe pra cobrir, não só a leitura estática): assinatura
  `pending`→`active` no meio do poll fez a tela virar de "Pagamento em
  análise" pra "Pagamento aprovado" sozinha (ícone, cor, título,
  descrição, indicador de verificação sumindo) sem nenhum reload; troca
  de plano pendente resolvida (`pending_plan_id`→`null`) também
  detectada da mesma forma, confirmada depois navegando pra "Meu plano"
  (aviso de troca pendente já tinha sumido, plano atual já mostrando o
  novo).

### MySubscriptionView (`modules/billing/views/MySubscriptionView.vue`)

Fecha as pendências reais que restavam da Fase 2, pedido direto do
usuário ("implemente tudo q falta pra fase 02"): cancelamento
(`DELETE /subscriptions/{id}`) e troca de plano
(`PATCH /subscriptions/{id}`), os dois endpoints já prontos no backend
desde a rodada original da Fase 2, telas nunca construídas até aqui.

- **Mesma receita de "seção com borda" de `AccountView.vue`**
  (`{colors.bg-1}` + borda `{colors.ink-10}` + `{radius.16}` + padding
  `{spacing.24}`) — resumo da assinatura numa seção, troca de plano em
  outra, sem componente de "card" novo (`AccountView.vue` já resolveu
  esse gap, reaproveitado aqui, não reinventado).
- **Resumo em grade de campos** (plano/status/ciclo/assinante desde/
  válido até) — `StatusDot` pro status (`subscriptionStatusColor`,
  `subscription.type.ts`), `CalendarBlank` 14px antes das datas (mesmo
  padrão de "ícone de apoio pequeno antes de texto" já usado em
  `IconText.vue`/células de tabela, sem reaproveitar `IconText` aqui
  porque não é uma célula de `DataTable`).
- **Sem `ConfirmDialog` antes de trocar de plano** — mesma consistência
  do fluxo de assinatura original (`ChoosePlanView.vue`): clicar no
  `PlanCard` já redireciona pro checkout do Mercado Pago, onde o usuário
  revisa o valor prorata antes de pagar — o checkout hospedado já É a
  confirmação. Cancelamento usa `ConfirmDialog` porque não tem esse passo
  intermediário — o clique cancela direto.
- **Grade de troca de plano reaproveita `PlanCard.vue`** (ver seção
  acima, props `isCurrent`/`ctaLabelOverride` novas) — filtra o plano
  atual da lista (`canChangeToPlan`, `useSubscription.ts`) antes de
  renderizar, então a grade só mostra os planos pra que trocar de
  verdade.
- **`canCancelSubscription`/`canChangeToPlan` são funções puras,
  test-first** (`tests/modules/billing/composables/useSubscription.test.ts`)
  — mesma régua de `usePlanPricing.ts`: `canCancelSubscription` só é
  falso quando já não há assinatura ou o cancelamento já foi agendado
  (evita disparar `DELETE` de novo à toa — o backend é idempotente,
  então isso é só UX, não uma trava de segurança real);
  `canChangeToPlan` só é falso pro próprio plano atual (o backend
  recusaria com `errorMessageSamePlan`).
- **Gap de contrato do backend fechado em 2026-08-31** — pedido direto
  do usuário ("vamos iniciar pelo gap 2"), mensagem pra sessão
  `backend-c5` pedindo `pending_plan_id` em `SubscriptionResource`
  (`GET /subscriptions`), resolvido no mesmo dia. `subscription.type.ts`
  ganhou o campo em `Subscription`/`toSubscription()`. Efeito na tela:
  um `computed` (`pendingPlan`, resolve o `id` pro `Plan` de verdade na
  mesma lista já carregada pra grade de troca) alimenta um aviso
  (`billing.mySubscription.pendingPlanChange`, "Troca para o plano {plano}
  aguardando confirmação de pagamento") e esconde a seção inteira
  "Trocar de plano" enquanto a troca está pendente — evita deixar
  clicar de novo só pra bater no 422 `errorMessagePlanChangeAlreadyPending`.
  **`.my-subscription-view__cancelled-notice` generalizada pra
  `__notice`** — os 2 avisos (cancelamento agendado, troca pendente)
  podem aparecer AO MESMO TEMPO (`cancelAtPeriodEnd`/`pendingPlanId` são
  estados independentes na mesma assinatura), `margin-bottom` em vez de
  depender de `gap` de container, pra empilhar bem nos dois casos (1 ou
  2 avisos).
- Verificado em browser real contra o backend local, com dado de
  verdade (assinatura ativa criada via tinker + segundo plano real
  disponível pra trocar): resumo renderiza plano/status/datas corretos;
  cancelar mostra "Cancelamento agendado — acesso mantido até {data}" e
  sobrevive a um reload da página; clicar "Trocar de plano" dispara o
  `PATCH` real e redireciona de fato pro Checkout Pro do Mercado Pago
  (sandbox, URL com `pref_id` real) — confirmado no banco que
  `pending_plan_id` fica setado pro plano novo enquanto `plan_id`
  continua o antigo, exatamente como `ChangeSubscriptionPlanAction`
  documenta; repetir a troca com uma já pendente mostra o toast de erro
  certo sem navegar pra lugar nenhum; com `pending_plan_id` real setado
  no banco, o aviso mostra o nome do plano de destino resolvido ("Pro")
  e a seção de troca some; com cancelamento E troca pendente ao mesmo
  tempo, os 2 avisos empilham e o botão de cancelar (correto — já
  cancelado) some.

**Filtro de ciclo de cobrança, 2026-08-31, pedido direto do usuário**
("nas telas de planos tanto no choose-plan quanto na meu plano adicione o
filtro por `?filter[billing_cycle]=monthly` como um seletor em cima dos
cards") — a API (`GET /plans`) já suportava o filtro, só não existia
seletor nenhum: as duas telas sempre buscavam TODOS os planos misturados
(mensal + anual na mesma grade). Adicionado um `BlockTab` "Mensal"/"Anual"
acima da grade, tanto aqui quanto em `ChoosePlanView.vue` (que não tem
seção própria neste documento — mesmo padrão de `PlanCard`, ver acima).

- **`useChoosePlan.ts` reescrito pra manter DUAS listas** —
  `plans` (universo completo, sem filtro, buscada 1x) e `visiblePlans`
  (só o ciclo selecionado, refeita via `GET /plans?filter[billing_cycle]=...`
  de verdade a cada troca). Necessário porque `usePlanPricing.ts`
  (`getYearlySavings`/`findMostEconomicalPlan`) precisa do universo
  INTEIRO pra comparar ciclos entre si (ex.: "economize R$X/ano" compara
  o anual contra o mensal mais barato — que só existe fora do filtro
  atual), mas a grade renderizada usa só `visiblePlans`. Mesma dualidade
  replicada aqui (`plans.plans`/`plans.visiblePlans`, mesma composable
  reaproveitada) — o resumo de "Meu plano atual" continua resolvendo
  contra `plans.plans` (universo completo), nunca contra o filtro
  selecionado, senão trocar de aba faria o plano atual "sumir" do resumo
  se ele não fosse do ciclo visível no momento.
- **A seção "Trocar de plano" (com o seletor dentro) fica visível mesmo
  quando o ciclo atual não tem nenhum plano pra trocar** —
  `hasPendingPlanChange` continua sendo o gate real da seção
  (não `otherPlans.length`), com uma mensagem nova
  (`billing.mySubscription.changePlan.emptyForCycle`) no lugar da grade
  vazia; sem isso, o usuário ficaria sem nenhuma forma de descobrir que o
  outro ciclo tem opções.
- Verificado em browser real contra o backend de verdade (2 planos
  mensais + 2 anuais seedados): alternar Mensal/Anual dispara o `GET`
  real com `filter[billing_cycle]` correto nos 2 componentes; badge "Mais
  econômico" recalcula só dentro do ciclo visível; o caso de economia
  ZERO (yearly = 12× o mensal exato nos dados de seed) corretamente não
  mostra nenhum badge de economia (nunca um valor zerado/negativo).

### TransactionsView (`modules/billing/views/TransactionsView.vue`)

"Faturas" — histórico próprio via `GET /transactions`
(`ListOwnTransactionsAction`), read-only. Mesma receita de
`ProductsView.vue` (`useResourceList`/`DataTable`/`PaginationNav`), sem
`ListToolbar`/`useCrudDrawer`/`ConfirmDialog` — não existe criar/editar/
excluir transação (registro financeiro imutável, mesma regra já vale pro
admin: `AdminTransactionController` só tem `index`/`show`).

- **`buildTransactionSortParam` testado** (mesmo padrão de
  `buildProductSortParam`, `useProductList.ts`) — a API real só ordena
  por `value`/`created_at` (`core/api/schema.d.ts`, `transaction.index`),
  qualquer outra coluna não ganha `sortable: true` na tabela.
- **Status via `StatusDot`** (`transactionStatusColor`,
  `transaction.type.ts`) — aprovada/autorizada em verde, pendente/em
  processamento/em mediação em amarelo, recusada/cancelada em vermelho,
  reembolsada/estornada (chargeback) em cinza (sem sinal claro de
  "bom"/"ruim" pro usuário final, tratado como neutro).
- Verificado em browser real contra o backend local, com 2 transações
  reais criadas via tinker (`approved`/`pix`, `pending`/`credit_card`):
  tabela renderiza as 2 linhas com valor formatado (`formatMoney`) e
  `StatusDot` na cor certa (verde/amarelo), paginação aparece mesmo com
  só 1 página (mesmo comportamento já esperado de `PaginationNav`).

### AdminSubscriptionsView / OverrideSubscriptionModal (`modules/billing/`)

**Fase 7, 2026-09-01** — "Assinaturas" (admin): "ver TODAS as assinaturas
de todos os usuários" (`GET /admin/subscriptions`,
`AdminSubscriptionController`), pedido direto do usuário ("crie uma
fase 7 com a parte financeira, assinaturas e transações e implemente").
Mesma forma geral de `AdminMarketplacesView.vue`
(`useResourceList`/`DataTable`/`PaginationNav`+`ListToolbar`), mas **sem
`useCrudDrawer`**: não existe criar/excluir assinatura pelo admin
(`AdminSubscriptionController` só tem `index`/`show`/`update`) — só
`OverrideSubscriptionModal.vue` (`Modal`, 2 campos: `status`/`end_date`)
pra correção manual de suporte via `OverrideSubscriptionAction`, mesma
categoria de `EditUserRoleModal.vue`/`useUpdateUserRoleForm.ts`
(bespoke, fora do `useResourceForm` — não é o par create/update que ele
modela).

- **`user`/`plan` embutidos desde o início** — diferente do achado real
  de `AdminAuditLogResource` (descoberto DEPOIS de construir a tela),
  aqui o gap foi reportado pra sessão de backend ANTES de escrever a UI
  (mesmo padrão já visto no mesmo dia, aplicado proativamente): `GET
  /admin/subscriptions` nunca chegou a expor `user_id` cru pra esta
  tela, resolvido em minutos. `AdminSubscription` (`subscription.type.ts`)
  ganhou `user: AdminUser` — 3º consumidor real de `AdminUser`
  (`core/types/adminUser.type.ts`, depois de Identity e Platform).
- **Filtro de `status`** (`ListToolbar` `#filters`, `Select`, sentinel
  `'all'`) — reaproveita as mesmas chaves i18n de
  `billing.mySubscription.status.*` (tela "Meu plano" do próprio
  usuário), sem duplicar tradução.
- **Filtros de `user_id`/`plan_id`, Fase 9 (2026-09-01)** — fecham o gap
  real reportado na auditoria de integração do OpenAPI (a API já aceitava
  os dois, sem controle de UI correspondente). 2 `Select` novos,
  alimentados por `useAdminUserOptions` (`core/composables/`, novo —
  ponte cross-módulo pra listar usuários pra picker, reutilizada por
  `AdminTransactionsView`/`AdminTicketsView`/`AdminNotificationsView`) e
  `useAdminPlanOptions` (`modules/billing/composables/`, LOCAL — só este
  consumidor existe até aqui, não cruzou o critério de promoção pra
  `core/`). Os dois auto-aplicam ao trocar (mesmo padrão do `Select` de
  status, sem botão "Filtrar" — só os filtros de DATA exigem confirmação
  explícita nesse projeto).
- **`OverrideSubscriptionModal.vue`**: `status` via `Select` (5 valores
  de `SubscriptionStatus`), `end_date` via `DatePicker.vue` (`v-model`
  de string ISO, `''` = sem data) — convertido pra `null` só na hora do
  payload, já que `end_date` é `nullable` de propósito no backend
  (decisão P11: admin pode limpar a data pra reverter a assinatura pra
  indeterminada). Sempre manda os 2 campos explícitos no `PATCH` (nunca
  omite pra "não mudar") — mais simples que replicar a lógica de
  `sometimes` do backend num form que já mostra o valor atual
  pré-preenchido.
- Verificado em browser real contra o backend local: tabela mostra nome
  de usuário/plano reais (não UUID), editar uma assinatura (trocar
  status "Ativa" → "Cancelada" no modal) dispara o `PATCH` real e a
  linha atualiza sem reload, filtro de status funciona.

### AdminTransactionsView (`modules/billing/views/AdminTransactionsView.vue`)

**Fase 7, 2026-09-01** — "Transações" (admin), read-only
(`AdminTransactionController` só tem `index`/`show` — registro
financeiro imutável, mesma regra do `TransactionController` do próprio
usuário). Mesma forma de `TransactionsView.vue` + `ListToolbar` com
filtro de `status` (todos os 9 valores de `TransactionStatus`,
reaproveitando `billing.transactions.status.*` já existente, sem
duplicar tradução).

- **Sem filtro de `gateway`/`subscription_id`, decisão mantida na
  auditoria da Fase 9** — hoje só existe 1 gateway integrado (Mercado
  Pago, `docs/infra/convencoes-frontend-infra.md` seção 15.1); um
  `Select` sem segunda opção real pra escolher não vale a pena, mesma
  régua de "sem dimensão real pra oferecer" já usada noutros lugares do
  design system (ex.: busca de Marketplace/`Product`). `subscription_id`
  é busca por UUID cru, sem UI natural sem já saber o ID de antemão. Os
  2 services já aceitam os params — mapeamento 1:1 com o
  `QueryParameter` real do controller, deliberadamente só sem UI.
- **Filtro de `user_id`, Fase 9 (2026-09-01)** — 1 `Select` novo
  (`useAdminUserOptions`, mesmo composable cross-módulo do
  `AdminSubscriptionsView` acima), fechando o gap real que a auditoria
  de integração encontrou (`filter[user_id]` documentado no controller,
  sem controle de UI).
- **`user` embutido desde o início**, mesmo caso de `AdminSubscription`
  acima — reportado pra sessão de backend antes de construir a tela.
- Verificado em browser real: tabela mostra nome de usuário real, valor
  formatado (`formatMoney`), `StatusDot` na cor certa; filtro de usuário
  produz `filter[user_id]=...` correto na URL da requisição.

### AccountView (`modules/identity/views/AccountView.vue`)

Fecha a última pendência real da Fase 1 — escopo direto de
`mapeamento-cruds-perfil.md` (backend): editar nome/e-mail/senha, ver/
desconectar provedores SSO, excluir a própria conta. **Diferente das
outras telas de Identity, é uma tela do APP PRINCIPAL** — vive dentro de
`AppLayout` (sidebar/header), não do shell split-screen de
`AuthLayout.vue`. Sem componente de "Card" pronto no design system (só
`{rounded.16}` reservado desde a Fase 0) — cada seção (dados da conta,
contas conectadas, zona de risco) é uma `<section>` com borda
`{colors.ink-10}` + `{radius.16}`, mesma receita repetida 3x; zona de
risco usa `{colors.accent-red}` na borda.

Descoberta via clique no bloco de usuário (avatar + nome) no topo do
`AppSidebar` (`core/layouts/AppSidebarContent.vue`) — virou
`RouterLink` pra `account` em vez de `<div>` estático, com
`text-decoration:none; color:inherit` pra não parecer um link azul
sublinhado tradicional, só hover/focus-ring de affordance.

### DeleteAccountModal (`modules/identity/components/DeleteAccountModal.vue`)

Composição de `Modal.vue` + `FormGroup` + `Input` + 2 `Button`, mesmo
padrão de bloco de `DocumentPromptModal.vue` (Billing) — nunca decide o
que fazer com a senha digitada, só emite `confirm`
(`AccountView.vue`/`useDeleteAccount.ts` decidem). Sem variante
destrutiva/vermelha no botão de confirmar — mesma decisão já registrada
em `ConfirmDialog.vue` (Figma não define essa variante pro `Button`).
`password` sempre opcional no campo: `UserResource` não expõe se a conta
tem senha cadastrada (conta só-SSO não tem), então a UI nunca sabe se
deve exigir preenchimento — manda o que foi digitado e deixa o backend
recusar com `errorMessageIncorrectPassword` se for o caso.

### ProductLaunchList (`modules/catalog/components/blocks/ProductLaunchList.vue`)

"Lançamentos" (`PRODUCT_LAUNCH`) — pedido direto do usuário em 2026-08-31
("vamos seguir com o catálogo... implementar produtos e lançamentos de
produtos"), fechando a única pendência funcional real da Fase 3.
`docs/negocio/contexto-plataforma-precificacao.md` (seção 2.3) e
`core/layouts/config/navigation.ts` já documentavam a decisão: nunca uma
listagem própria/item de sidebar, sempre uma ABA dentro do detalhe de UM
produto.

- **Primeiro componente do módulo Catalog a justificar `components/blocks/`**
  — `ProductForm.vue` (form simples) continua solto em `components/`;
  `ProductLaunchList.vue` é composição de verdade (`DataTable`+toolbar+
  `Modal`+`ConfirmDialog`), mesmo critério de promoção de subpasta já
  usado noutros módulos (seção 3.3 de `docs/infra/convencoes-frontend-infra.md`).
  Mesmo motor genérico de `ProductsView.vue`
  (`useResourceList`/`useCrudDrawer`/`useConfirmAction`) — `useCrudDrawer`
  reaproveitado apesar do nome sugerir `Drawer.vue`: a lógica não conhece
  qual componente de UI a consome.
- **`ProductLaunchForm.vue` (`components/ProductLaunchForm.vue`) dentro
  de um `Modal`, não um segundo `Drawer`** — já se está dentro do Drawer
  de edição do produto quando essa tela abre; um painel lateral
  empilhado dentro de outro ficaria estranho, `Modal` sobrepõe em vez de
  deslizar. Mesmo padrão de form único create+edit de `ProductForm.vue`.
- **`TabBar` no `Drawer` de edição de `ProductsView.vue`** ("Dados do
  produto"/"Lançamentos") — só existe em modo `edit` (produto precisa
  existir pra ter lançamentos); `activeProductTab` reseta pra "Dados"
  toda vez que um edit novo abre, porque `useCrudDrawer.close()` não
  reseta `mode`/`editingRecord` de propósito (evita flicker na animação
  de saída) — sem esse reset explícito, reabrir pra um produto DIFERENTE
  poderia herdar a aba "Lançamentos" ainda ativa da edição anterior. O
  `Drawer` cresce de `size="md"` pra `"lg"` só no modo `edit`, pra caber
  a tabela de lançamentos.
- **Achado real, sistêmico — `Select`/`Tooltip`/`DropdownMenu`/`DatePicker`/
  `DateRangePicker` nunca funcionavam de verdade dentro de um
  `Modal`/`Drawer`**: os 5 portais floating do design system usavam
  `z-index: 50`, sempre MENOR que `Modal.vue`/`Drawer.vue` (`100`/`101`)
  — qualquer um deles usado aninhado renderizava atrás do modal/drawer,
  interceptando clique. Só apareceu agora porque `ProductLaunchForm.vue`
  (`DatePicker` dentro de um `Modal`, que por sua vez está dentro do
  `Drawer` de edição do produto) foi o primeiro caso real de componente
  flutuante aninhado num desses dois. Confirmado com Playwright: clicar
  no atalho "Hoje" do `DatePicker` travava com "element intercepts
  pointer events", o elemento por cima sendo o próprio conteúdo do
  `Modal`. Corrigido nos 5 componentes pra `z-index: 200`.
- **Achado real, sistêmico, encontrado no mesmo processo — erro de campo
  do backend nunca aparecia sob o input pra qualquer campo com nome
  composto** (`full_sale_price`, `purchase_price`, `target_margin`,
  `password_confirmation`...): `parseApiError.ts` devolvia `fieldErrors`
  chaveado como o Laravel manda (snake_case, nome do REQUEST), mas todo
  `useXForm.ts` indexa `errors.value` pela chave CAMELCASE de
  `XFormValues` — sem conversão, `errors.value['full_sale_price']` nunca
  é lido por `fieldError('fullSalePrice')`. 3 forms de Identity
  (`useRegisterForm`/`useUpdateProfileForm`/`useResetPasswordForm`) já
  tinham percebido isso pro único campo composto que cada um tem
  (`password_confirmation`) e remendado com um ternário ad-hoc repetido 3
  vezes; `useProductForm.ts` (3 campos compostos) nunca tinha sido
  corrigido — só ficou visível agora ao escrever `useProductLaunchForm.ts`
  (`purchase_price`) e revisar o padrão de perto. Corrigido de forma
  centralizada em `parseApiError.ts` (`toCamelCaseKey`, testado em
  `tests/shared/services/parseApiError.test.ts`) — os 3 ternários ad-hoc
  removidos, todo formulário (existente e futuro) funciona sem precisar
  de nenhum remendo próprio por campo.
- Verificado em browser real contra o backend local: criar produto →
  editar → aba "Lançamentos" com as 2 tabs corretas → estado vazio
  honesto → criar lançamento (incluindo escolher "Hoje" no `DatePicker`
  dentro do `Modal`, confirmando o fix de z-index) → editar → excluir,
  ciclo completo funcionando ponta a ponta contra a API real.

### AdminMarketplacesView (`modules/pricing/views/AdminMarketplacesView.vue`)

Primeira tela ADMIN do projeto (Fase 4, 2026-08-31) — mesma forma visual
exata de `ProductsView.vue` (Catalog), sem nenhum componente novo:
`DataTable`+`PaginationNav`+`Drawer`, `TabBar` dentro do Drawer de edição
pra "Regras de comissão" (`AdminPricingRuleList.vue`, dentro de um
`Modal`, mesmo padrão de "Lançamentos"). Coluna "Status" usa `StatusDot`
(`green`/`gray`) pro `active` do marketplace — não `Badge`, mesmo
critério já registrado na seção StatusDot (ponto colorido, não pill, pra
esse tipo de indicador binário simples).

**Correção de escopo de rota, 2026-08-31, pedida direto pelo usuário**:
"admin deve ver a tela de link do produto e mktplace" — `pricing.routes.ts`
tinha `meta.roles: ['user']` nesta rota E em `product-marketplaces`, e
`navigation.ts` tinha o mesmo `roles: ['user']` no grupo "Marketplaces" da
sidebar — herdado do momento em que a Fase 4 nasceu como feature só do
vendedor comum, sem motivo de negócio real pra bloquear `admin_master`
(que já é isento do guard de assinatura ativa no backend). Removido dos 3
lugares. Coluna "Nome" também ganhou `MarketplaceLogo` (ver seção própria
abaixo) no mesmo dia.

### AdminMarketplaceForm (`modules/pricing/components/AdminMarketplaceForm.vue`)

**Primeiro upload de arquivo do projeto** — mudança de contrato pedida
pelo usuário em 2026-08-31 ("não podemos ficar dependendo de links
externos"): a 1ª rodada dos campos de marketplace tinha `logo_url` como
texto colado; nesta 2ª rodada o backend trocou o campo de ENTRADA pra
`logo_base64` (a resposta continua `logo_url`, agora sempre um link do
próprio storage). Sem componente `FileInput` no design system ainda
(nenhum outro form do projeto precisou de upload até aqui) — resolvido
com um `<input type="file">` NATIVO, visualmente escondido (técnica
padrão de "visually hidden", não `display:none` — teria tirado do fluxo
de tab/foco de teclado) e disparado por um `Button` normal
(`fileInputRef.click()`), convertido pra `data:` URI via `FileReader`
antes de entrar em `values.logoBase64`.

- **Preview de 3 estados**: arquivo recém-escolhido (`values.logoBase64`)
  → `logo_url` já existente, se estiver editando e nenhum arquivo novo
  foi escolhido ainda → `IconTile`/`Storefront` de fallback (mesmo
  fallback visual de `MarketplacesView.vue`, quando não há nenhum dos
  dois). Um `computed` simples resolve a prioridade.
- **`logo_base64` só entra no payload quando o admin escolhe um arquivo
  novo** — omitido (nunca mandado como `null`) em qualquer edição que
  não mexeu nisso, pra não implicitamente "limpar" o logo em todo PATCH
  de rotina. Mesmo padrão já usado pra senha opcional em
  `useUpdateProfileForm.ts` (Identity) — `...(values.logoBase64 ? {...}
  : {})`.
- `accept="image/png,image/jpeg,image/webp,image/svg+xml"` no input —
  restringe o tipo de arquivo antes mesmo de chegar no form; validação
  de verdade (tamanho, se é imagem de fato) é do backend.
- Verificado em browser real com upload de arquivo de verdade
  (`page.setInputFiles`, Playwright): preview aparece imediatamente após
  escolher o arquivo, submit grava no backend, `logo_url` resultante
  aponta pro storage do próprio backend (`/storage/marketplaces/logos/<uuid>.<ext>`),
  card em `MarketplacesView.vue` exibe a imagem real servida.

### MarketplaceLogo (`modules/pricing/components/MarketplaceLogo.vue`)

**Extraído em 2026-08-31**, pedido direto do usuário ("adicione os logos
a todas as listagens de mktplace") — o markup ícone-ou-imagem que já
existia solto dentro de `MarketplacesView.vue` (fallback `IconTile`/
`Storefront` em `@error`) virou componente próprio no momento em que um
2º e 3º consumidor real precisaram do mesmo comportamento
(`AdminMarketplacesView.vue`, `ProductMarketplacesView.vue`) — mesmo
critério de promoção já usado no resto do projeto (só sobe/vira
componente quando um consumidor adicional de verdade aparece).

- Só 2 props (`logoUrl`, `name` pro `alt`) + `size` opcional (default 24,
  usado em 24px nas duas tabelas e 48px no card grid) — sem decisão de
  negócio, só "mostra a imagem ou o fallback".
- Estado de falha (`hasFailed`) é local ao componente (`ref` interno),
  não mais um `Set` de ids mantido pela view como na primeira versão
  dentro de `MarketplacesView.vue` — cada instância cuida do próprio
  estado de erro, sem precisar de uma chave externa.
- Reaproveitado com `IconText.vue` nas duas tabelas (`AdminMarketplacesView`/
  `ProductMarketplacesView`, célula `#cell-name`/`#cell-marketplaceName`)
  — mesmo padrão "ícone/imagem + texto" já documentado na seção IconText.
- **Escopo explicitamente NÃO estendido ao `Select` de "vincular
  marketplace"** (`ProductMarketplacesView.vue`, modal de vínculo) — é
  texto puro do Reka UI sem suporte a conteúdo rico por opção; adaptar um
  átomo compartilhado pra um único consumidor contrariaria a régua de
  promoção ao contrário (desceria complexidade pro genérico por causa de
  1 caso). Revisitável se pedido explicitamente.
- Verificado em browser real contra o backend de verdade: 2 marketplaces
  reais renderizando `<img>` (não fallback) no grid, na tabela admin e na
  tabela de vínculo produto↔marketplace, todas as 3 telas juntas.

### MarketplacesView (`modules/pricing/views/MarketplacesView.vue`)

**Grid de cards, pedido direto do usuário com referência visual real de
outro produto** (captura: ícone + nome + toggle + botão "Connect", tags/
badges e link externo que não existem no domínio da Orbita, descartados).
Primeiro uso de `IconTile.vue` FORA de tile-pequeno-ao-lado-de-texto
(célula de tabela, `NotificationItem`) — aqui como elemento PRINCIPAL do
card (`size=48`, `icon-size=24`, ícone `Storefront` fixo pra todo card,
sem distinção por marketplace — não existe campo de logo/cor em
`MARKETPLACE`, inventar uma distinção visual sem dado real seria
fabricar conteúdo). Cartão: `{colors.bg-1}` + borda `{colors.ink-10}` +
`{radius.16}` — mesma receita de "seção com borda" já usada em
`AccountView.vue`/`MySubscriptionView.vue`, aplicada num grid
(`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`) em vez
de empilhada verticalmente.

`Toggle.vue` (variante solta, não "boxed") — liga/desliga `active` de
uma conexão já existente, `disabled` quando o marketplace ainda não foi
conectado (não existe "meio-termo" pra `active` sem uma conexão criada
primeiro). Estado desabilitado do `Toggle` já herda o tratamento visual
do próprio componente, sem CSS extra aqui.

**Correção pixel-perfect, 2026-08-31, reportada pelo usuário comparando
lado a lado com a captura de referência** — a v1 tinha 2 erros estruturais
reais, não só estéticos: (1) `Toggle` morava no CABEÇALHO do card, ao
lado do `IconTile`; a referência mostra o toggle na mesma LINHA do botão
"Connect", rodapé do card, não no topo. (2) botão de conectar era
`variant="primary"` (preto sólido, sem ícone); a referência mostra
`outline` com um ícone de "trocar/sincronizar" antes do texto. Os dois
corrigidos: `Toggle` movido pro rodapé (`.marketplaces-view__card-footer`,
`justify-content: space-between` — ações à esquerda, toggle à direita,
`margin-top: auto` no footer pra alinhar a base de todos os cards mesmo
quando um tem `card-subtitle` — nome da loja — e outro não), botão
"Conectar"/"Gerenciar" trocado pra `variant="outline"` +
`icon-before="ArrowsDownUp"` (mesmo ícone já usado em `ListToolbar.vue`
pro botão "Ordenar" — par de setas verticais, o mais próximo do "⇅" da
referência no conjunto de ícones gerado). Reconfirmado em browser real
(screenshot lado a lado): estrutura ícone→título→[subtítulo]→rodapé
(botão+toggle) bate com a referência nos dois estados (conectado/não
conectado), rodapé alinhado na mesma altura nos dois cards.

**Gap fechado, mesmo dia, em duas rodadas** — backend implementou os 4
campos pedidos acima (`logo_url`/`description`/`tags`/`website_url`,
nullable, em `MarketplaceResource`/`AdminMarketplaceResource`).
Atualizado aqui: cabeçalho do card ganhou `<img>` de verdade quando
`logoUrl` existe (`IconTile`/`Storefront` continua sendo o fallback
quando não há logo, ou quando a imagem falha ao carregar — `@error` no
`<img>` marca o id como "falhou" e troca pro fallback, defesa contra URL
morta que o cadastro não teria como validar sozinho) + link externo
(`hostnameOf()`, só o domínio via `URL().hostname`, mesmo formato
"webflow.com" da referência — ícone `ArrowSquareOut`), descrição (parágrafo
simples abaixo do título) e tags (`Badge` `variant="gray"`, um por tag).

**Segunda rodada, mesmo dia — `logo_url` deixou de aceitar link
externo.** Pedido direto do usuário depois da 1ª entrega ("não podemos
ficar dependendo de links externos"): o CAMPO DE ENTRADA virou
`logo_base64` (upload real, `AdminMarketplaceForm.vue` — ver seção
própria abaixo), mas o campo de LEITURA continua `logo_url` — agora
sempre um link do próprio storage do backend, nunca mais externo. Zero
mudança nesta view: ela só lê `card.marketplace.logoUrl` pra exibir,
nunca soube ou precisou saber de onde a imagem veio.

### ProductMarketplacesView (`modules/pricing/views/ProductMarketplacesView.vue`)

Rota própria (`/products/:id/marketplaces`), não uma aba — decisão de
arquitetura, não de design visual (fronteira de módulo, ver
`docs/planejamento/plano-implementacao.md` Fase 4). Visualmente é o
mesmo esqueleto de lista simples já usado em `ProductLaunchList.vue`
(header + botão de ação + `DataTable` + `Modal` pro formulário), só que
o "formulário" aqui é um único `Select` (nunca mais de 1 campo, não
precisou de `FormGroup`/`useResourceForm` — não há o que validar além de
"algo foi selecionado"). Link "Voltar para Produtos" no cabeçalho é
`Button` `variant="ghost"` com `icon-before` (`ArrowLineLeft`), não um
`<a>`/`<button>` cru — nunca reinventar estilo de botão fora do design
system, mesmo pra um link de navegação simples.

**2 ajustes pedidos direto pelo usuário em 2026-08-31**: a rota deixou
de exigir `role: 'user'` (mesmo motivo da correção em
`AdminMarketplacesView` acima — admin também pode gerenciar vínculo de
qualquer produto seu) e a coluna "Marketplace" ganhou `MarketplaceLogo`
(ver seção própria acima) via `ProductMarketplaceRow.marketplaceLogoUrl`,
campo novo resolvido em `useProductMarketplaces.ts` cruzando
`UserMarketplace`→`Marketplace`, mesmo caminho que já resolvia o nome.

### NotificationItem/NotificationPanel/NotificationsView (`modules/platform/`)

**Fase 5, 2026-09-01** — o painel do sino do `AppHeader` (`NotificationPanel.vue`)
saiu do estado placeholder (lista fixa desde a Fase 0) pra dado real,
`useNotificationFeed.ts`. `NotificationItem.vue` deixou de receber o
`NotificationItemData` já resolvido (ícone/tint/timestamp por fora) e
passou a receber a `Notification` de domínio direto — resolve
ícone/tint via `notificationIconFor`/`notificationTintFor` (funções
puras, `notification.type.ts`, mapeamento por `NotificationType`:
`CheckCircle`/azul pra `subscription_activated`, `UserSwitch`/roxo pra
`impersonation_started`, `Megaphone`/azul pra `admin_announcement`),
timestamp via `formatRelativeTime` (`shared/services/formatDate.ts`,
novo — primeiro uso de `dayjs/plugin/relativeTime` no projeto,
auto-contido: registra o plugin E a locale `pt-br` no próprio módulo,
não depende só do `dayjs.locale('pt-br')` de `main.ts`, que não roda no
ambiente de teste), e `title`/`message` via
`useApiMessage().resolveMessage()` (chave `NotificationMessageKey`
catalogada ou texto livre, mesma disciplina de sempre).

- **Elemento raiz virou `<button>`, não mais `<div>`** — precisa ser
  clicável (marcar como lida, `@select`), reset de estilo de botão já
  vem do global `_reset.scss` (`cursor: pointer; background: none;
  border: none; font: inherit`), só `:focus-visible` com `focus-ring`
  adicionado.
- **Painel busca a lista só quando ABRE** (`watch(isNotificationPanelOpen)`),
  não no mount do componente — `NotificationPanel.vue` é montado uma vez
  em `App.vue`, buscar 10 notificações em todo carregamento de página
  seria desperdício pra um painel que pode nunca ser aberto na sessão. O
  CONTADOR de não lidas (`refreshUnreadCount`, `countUnreadNotifications`
  — `GET /notifications?filter[read]=false&per_page=1`, lê só `meta.total`
  sem transferir a lista) já busca no mount, é barato e alimenta o ponto
  vermelho do sino independente do painel abrir ou não.
- **`/notifications` (`NotificationsView.vue`)** — lista completa
  paginada, mesmo `useNotificationFeed()` do painel (2 instâncias
  independentes, cada uma com seu próprio fetch) — `<ul>` de
  `NotificationItem` + `PaginationNav`, não `DataTable` (notificação não
  é dado tabular). Sem item de sidebar — alcançada só pelo sino, mesmo
  padrão de `product-marketplaces`.
- Verificado em browser real contra o backend (2 notificações seedadas
  via tinker, já que `subscription_activated` nunca é disparada pelo
  fluxo de trial real — achado registrado em
  `docs/planejamento/plano-implementacao.md`, Fase 5): ponto vermelho no
  sino, painel com os 2 itens (ícone/cor/timestamp relativo corretos),
  clique marca como lida e o ponto some da notificação e do sino.

### useNotificationStore (`core/store/useNotificationStore.ts`)

**Fase 5, 2026-09-01** — só o CONTADOR de não lidas (`unreadCount`/
`hasUnread`), migrado de dentro de `useAppShell.ts`
(`hasUnreadNotifications`/`setHasUnreadNotifications`, existia desde a
Fase 0 como estado de UI do shell). Achado real ao planejar a fase:
aquilo já era estado de DOMÍNIO (quantas notificações reais existem),
não estado de UI (painel aberto/fechado) — `useAppShell` (core/layouts)
não deveria saber nada sobre notificação de verdade, só orquestrar o
shell. Migrado pra `core/store/` (mesmo nível de `useAuthStore`,
"Pinia root (auth, notifications)" já previsto na estrutura de pastas
desde a Fase 0, seção 2 de `docs/infra/convencoes-frontend-infra.md`) —
`AppHeader.vue` passou a ler `notificationStore.hasUnread` (nunca
destructura `state`/`getters` de uma store Pinia sem `storeToRefs`,
mesmo critério já valia pra `useAuthStore` — guarda a instância, acessa
por `.`).

### AdminNotificationsView (`modules/platform/views/AdminNotificationsView.vue`)

**Fase 5, 2026-09-01** — gerenciamento/broadcast, admin-only, diferente
do sino do `AppHeader` (caixa de entrada do PRÓPRIO usuário). Mesma
forma de `AdminMarketplacesView.vue` (`useResourceList`/`useConfirmAction`,
`DataTable`+`PaginationNav`) pro CRUD principal (aqui só leitura +
exclusão — não existe editar conteúdo já enviado), mas o botão de
"criar" abre um `Modal` (não um `Drawer`/`useCrudDrawer`) — broadcast é
uma ação fire-and-forget, nunca edita um recurso persistido depois,
não é o par create/update que `useCrudDrawer`/`useResourceForm`
modelam. `useBroadcastNotificationForm.ts` é bespoke por isso, mesma
categoria de `useDeleteAccount.ts`/`useLogout.ts` — sem Zod (`title`/
`message` são opcionais no backend, sem regra client-side que valha a
pena adiantar, `title` só ganha `maxlength="255"` como guarda leve no
próprio `Input`).

- **Sem "enviar pra 1 usuário" nesta rodada** (`POST /admin/notifications`,
  `SendNotificationToUserRequest` — existe no backend, não implementado
  no front) — exigiria um seletor de `user_id`, que depende de uma tela
  de busca/lista de usuários (`/admin/users`, Fase 6, não construída).
  Só o broadcast (pra todos) está implementado, a rota explícita do
  plano de implementação.
- **Sort padrão `-created_at` sem precisar clicar no cabeçalho** —
  achado real verificando em browser: sem isso, o broadcast recém-
  enviado não aparecia no topo da lista (a `DataTable` não tem sort
  nenhum aplicado até o usuário clicar a coluna). Diferente de
  `useTransactionList`/`useAuditLogList` original (sem sort default,
  por escolha) — aqui faz mais sentido por ser uma feed de atividade.
  Mesmo ajuste replicado em `useAuditLogList.ts`.
- `title`/`message` da listagem passam por `resolveMessage()` — nunca
  `$t()` direto num valor vindo da API (mesma disciplina do
  `NotificationItem`).
- Verificado em browser real contra o backend: broadcast dispara `POST
  .../broadcast` (`202`), toast de sucesso, lista atualiza com a nova
  notificação no topo (`status: pending`, confirmado via banco que
  `title`/`message` batem exatamente com o que foi digitado no modal),
  exclusão funciona com `ConfirmDialog`.

### AdminAuditLogsView (`modules/platform/views/AdminAuditLogsView.vue`)

**Fase 5, 2026-09-01** — read-only (`AdminAuditLogController` só tem
`index`/`show`), mesma forma de `TransactionsView.vue`
(`useResourceList`/`DataTable`/`PaginationNav`, sem `ListToolbar`/
`useCrudDrawer`/`ConfirmDialog`). Filtro por `module`/`action` (2
`Input`s + botão "Filtrar", `filter[module]`/`filter[action]` exatos da
API) + `user_id`/`impersonated_by` (2 `Select` novos, Fase 9 — ver
addendum abaixo).

- **Achado real, só descoberto na verificação (Fase 5)**: nenhuma das 3
  ações que disparam log de auditoria hoje (`SubscriptionActivated`/
  `SubscriptionPlanChanged`/`ImpersonationStarted`) é alcançável pelo
  frontend nesta fase — as 2 primeiras exigem confirmação real via
  webhook do Mercado Pago (o trial pula esse caminho inteiro), a
  terceira é impersonation (Fase 6, ainda não construída nesse ponto).
  Testado com um registro seedado via tinker — tabela renderiza
  `action`/`module`/`description`/`userId`/`ipAddress`/data corretos,
  filtro por `action` inexistente mostra corretamente o estado vazio
  (`Nenhum registro de auditoria encontrado.`). Nesse momento
  `userId`/`impersonatedBy` só existiam como UUID cru — a API não
  embutia nome/e-mail (`AdminAuditLogResource`), e não fazia sentido
  inventar cruzamento com uma listagem de usuários que ainda não
  existia (`admin-users` só veio na Fase 6).

**`user`/`impersonator` embutidos, 2026-09-01 (mesmo dia da Fase 6)** —
gap acima fechado depois que `AdminUsersView.vue`/impersonation
entraram no ar: reportado como achado à sessão de backend, que
respondeu no mesmo dia embutindo `user`/`impersonator` completos
(mesmo shape de `AdminUserResource`) em `AdminAuditLogResource` — sem
pedido explícito do usuário, decisão tomada dentro do próprio trabalho
colaborativo entre sessões (mensagem cross-session tratada como pedido
de teammate, não como autorização do usuário). `AuditLog`
(`modules/platform/types/auditLog.type.ts`) ganhou os campos `user:
AdminUser`/`impersonator: AdminUser | null` — `userId`/`impersonatedBy`
(string crua) continuam existindo no tipo por completude 1:1 com o
resource, mas a UI não usa mais nenhum dos dois pra exibição.

- **`AdminUser`/`toAdminUser` promovidos pra `core/types/adminUser.type.ts`**
  (antes viviam em `modules/identity/types/`) — segundo consumidor real
  cruzando módulo (`modules/platform` precisando do mesmo shape que
  `modules/identity` já usava), mesmo critério de promoção já usado pra
  `toFavoriteItem`/`ImpersonatedBy` em `core/store/types/auth.type.ts`:
  sobe quando um SEGUNDO consumidor real aparece, nunca antecipado. Os
  8 pontos de import dentro de `modules/identity/*` (`EditUserRoleModal.vue`,
  `useImpersonation.ts`, `CreateAdminUserForm.vue`, `AdminUsersView.vue`,
  `useCreateAdminUserForm.ts`, `identityApi.ts`, `useUpdateUserRoleForm.ts`,
  `useAdminUserList.ts`) atualizados pra importar de `@/core/types/adminUser.type`.
- **Achado colateral, fechado junto**: a coluna "Via impersonation"
  (`platform.admin.auditLogs.columns.impersonatedBy`) já existia no
  catálogo `pt-BR.ts` desde a criação da tela (Fase 5), mas nunca tinha
  entrado no array `columns` da view — chave viva, nunca usada, gap que
  só apareceu ao revisar a tela pra consumir os campos novos.
- Verificado em browser real contra o backend local (usuário `admin_master`
  + um `AuditLog` seedado via tinker com `impersonated_by` setado, já que
  nenhuma das 3 ações reais de auditoria é alcançável pelo frontend —
  mesmo gap documentado acima): coluna "Usuário" mostra o nome real (não
  mais UUID), coluna "Via impersonation" aparece e mostra o nome do
  admin impersonador quando setado, `—` quando não há impersonation
  (linha de `product.deleted`, sem `impersonated_by`).

**Filtros de `user_id`/`impersonated_by`, Fase 9 (2026-09-01)** — gap
real que a PRÓPRIA auditoria de integração do OpenAPI da Fase 9 deixou
passar na primeira rodada (o levantamento original citou só
`AdminSubscription`/`AdminTransaction`/`AdminTicket`, sem reconferir
`AdminAuditLogController`) — encontrado ao revisar esta seção do
documento durante a atualização de doc pós-Fase-9, cruzando os
`#[QueryParameter]` reais do controller de novo. 2 `Select` novos
(`useAdminUserOptions`, mesmo composable cross-módulo já usado nas
outras 3 telas), auto-aplicam ao trocar — `impersonated_by` reaproveita
a MESMA lista de usuários que `user_id` (ambos são admin/usuário real,
sem endpoint separado de "só admins"). Verificado em browser real:
tabela renderiza normalmente com os `user`/`impersonator` já embutidos
(achado da Fase 6, acima), os 2 `Select` aparecem lado a lado dos
`Input` de texto livre na mesma `ListToolbar`, filtro de usuário produz
`filter[user_id]=...` correto na URL da requisição.

### AdminUsersView / CreateAdminUserForm / EditUserRoleModal (`modules/identity/`)

**Fase 6, 2026-09-01** — CRUD de usuário do lado do admin. Mesma forma
geral de `AdminMarketplacesView.vue` (`useResourceList`/`DataTable`/
`PaginationNav`), mas **sem `useCrudDrawer`**: `CreateUserByAdminRequest`
(nome/e-mail/senha) e `UpdateUserByAdminRequest` (`role`/`status`) não
compartilham NENHUM campo — criar e editar são 2 ações sem nada em
comum, não o par simétrico que `useCrudDrawer`/`useResourceForm`
modelam. `CreateAdminUserForm.vue` (`Drawer`) só cria;
`EditUserRoleModal.vue` (`Modal`, 2 `Select`) só edita `role`/`status` —
2 componentes/composables próprios, cada um com seu próprio estado
aberto/fechado, em vez de forçar um `useCrudDrawer` com metade dos casos
não fazendo sentido.

- Sem exclusão — `AdminUserController` não tem `destroy` (usuário nunca
  é hard-deletado pelo admin, só o próprio dono via
  `DeleteUserAccountAction`).
- Coluna "Ações": "Editar" (`PencilSimpleLine`) só aparece fora da
  própria linha do admin logado (`canEditUser`, testado); "Impersonar"
  (`UserSwitch`) só aparece pra `role: 'user'` E fora da própria linha
  (`canImpersonate`, testado) — confirmado visualmente em browser real:
  a própria linha do admin logado não mostra NENHUM ícone de ação, outra
  conta `admin_master` mostra só "Editar".

**Campo `role` no formulário de criação, 2026-09-01, pedido direto do
usuário** — mudança de contrato: `CreateUserByAdminRequest` ganhou
`role` opcional (default `user` quando omitido). `CreateAdminUserForm.vue`
ganhou um `Select` de role reaproveitando as MESMAS opções/chaves i18n
de `EditUserRoleModal.vue` (`identity.admin.users.roles.*`, nenhuma
chave nova) — `createAdminUserFormSchema.ts` sempre exige o campo
(`z.enum(['admin_master', 'user'])`, sem default silencioso do lado do
Zod), `emptyValues()` do composable inicializa em `'user'`. Antes disso,
criar um `admin_master` exigia 2 passos (criar como `user`, depois abrir
`EditUserRoleModal` pra promover) — agora é 1 passo só. Verificado em
browser real contra o backend local: criar usuário com "Perfil" =
"Administrador" grava `role: admin_master` de verdade, linha aparece na
tabela já com o role correto sem edição posterior.

### ImpersonationBanner (`core/layouts/ImpersonationBanner.vue`)

**Fase 6, 2026-09-01** — aviso visual persistente enquanto uma
impersonation está ativa, pedido explícito do plano de implementação.
Vive em `core/` (não em `modules/identity/`) pelo mesmo motivo de
`AppHeader`/`AppSidebar`: é chrome do shell, montado uma vez em
`AppLayout.vue`.

- `authStore.user.impersonatedBy` é a fonte de verdade — vem de `GET
  /auth/me` (pedido pra sessão de backend no mesmo dia, resolvido em
  minutos: a Session do servidor já sabia disso via `impersonator_id`,
  só não estava exposta). É o que faz o banner sobreviver a um F5 —
  confirmado em browser real (reload com impersonation ativa, banner
  continua lá).
- **Sem `position: sticky`, de propósito** — `AppHeader.vue` já é sticky
  em `top: 0`; empilhar 2 elementos sticky no mesmo `top` exigiria travar
  o header num offset calculado a partir da altura deste banner (frágil,
  muda no wrap mobile). Fica no fluxo normal, sempre visível ao
  carregar/trocar de rota, aceita rolar pra fora com o resto do conteúdo.
- Fundo `{colors.accent-orange}`, texto `{colors.paper-fixed}` — cor de
  atenção que não colide com nenhum outro uso já estabelecido
  (vermelho = erro, amarelo = pendente/aviso leve).
- **Gap conhecido**: só renderiza dentro de `AppLayout.vue` — impersonar
  um usuário sem assinatura ativa manda ele pro guard de `/choose-plan`
  (fora do `AppLayout`), onde não existe banner nem botão de "Voltar a
  ser admin" nenhum. Descoberto testando em browser real, documentado em
  `docs/planejamento/plano-implementacao.md` Fase 6 — não bloqueia o caso
  comum (usuário de suporte real, já assinante).

### AdminPlansView / AdminPlanForm (`modules/billing/`)

**Fase 6, 2026-09-01** — CRUD de `PLAN`, mesma forma exata de
`AdminMarketplacesView.vue` (`useResourceList`/`useCrudDrawer`/
`useConfirmAction`, form único cria+edita em cima de `useResourceForm`).

- **`billingCycle`/`isTrial`/`trialDays` com sincronização automática no
  form** — trocar o `Select` de ciclo pra "Trial" já marca `isTrial:
  true` e mostra o campo "Dias de trial" (`v-if`); qualquer outro ciclo
  esconde o campo e zera `isTrial`/`trialDays`. O schema
  (`adminPlanFormSchema.ts`, testado) ainda valida a regra cruzada por
  segurança, mas a UI evita o admin ver o erro na prática.
  `findMostEconomicalPlan` (Fase de trial) já excluía plano trial do
  comparativo — aqui é o admin CRIANDO esse mesmo tipo de plano.
- **Coluna "Ciclo" mostra só "Trial" pro plano trial** (não "Mensal
  Trial" com um Badge redundante do lado, versão descartada durante a
  verificação em browser real — texto duplo/confuso, corrigido antes de
  documentar).
- Sem `ListToolbar` — mesmo raciocínio de `AdminMarketplacesView.vue`
  (API admin sem filtro de texto por nome).

### AdminSettingsView / AdminSettingForm (`modules/platform/`)

**Fase 6, 2026-09-01** — CRUD de `SETTINGS` (configuração interna
chave-valor), mesma forma exata de `AdminPlansView.vue`.

- **`hash` só é editável em modo `create`** — depois de criado é a PK,
  imutável (`UpdateSettingRequest` nem aceita o campo). Em modo `edit`,
  o `Input` de hash fica `disabled` (confirmado em browser real,
  `isDisabled(): true`) — só visível pra identificar qual configuração
  está sendo editada, nunca editável.
- `type` é um `Select` com as 7 opções reais de `SettingType`
  (int/string/enum/text/json/bool/float) — `value` continua sempre
  `string` (é assim que a API guarda, independente do `type` declarado).

### TicketMessageList / TicketThreadPanel / AdminTicketThreadPanel (`modules/support/`)

**Fase 8, 2026-09-01** — Bounded Context novo (Support), pedido direto
do usuário depois de avisado por mensagem cross-session da sessão de
backend responsável. **Layout alinhado ANTES de codar**, também pedido
direto do usuário ("vamos repassar o layout antes"): examinei 2 seções
(Meetings/Chats) de um Figma de referência (`AiDEA – Smart SaaS
Dashboard UI Kit — Community`, `node-id=17261-105108`), com a instrução
explícita "esse arquivo é só pra estrutura, DS mantemos o nosso" — os 3
componentes abaixo usam só os TOKENS do Orbita (`{colors.bg-2}`/
`{colors.primary}`/`{colors.paper}`/`{radius.16}`), nunca cor/espaçamento
do Figma de origem, só o ESQUELETO (2 painéis: lista + conversa,
mensagens em bolha alinhada por remetente) copiado do frame "Chats".

- **Proposta inicial rejeitada, decisão registrada**: cogitei o frame
  "Meetings" (cards agrupados por seção: Live/Upcoming/Past) como
  listagem principal — usuário perguntou "ou nada a ver?", o que reabriu
  a discussão. Argumento final: Meetings quebraria o padrão
  `DataTable`+`ListToolbar` já usado em 9 outras telas do projeto E não
  modela o conceito de thread/conversa (os cards são ponto de entrada
  pra uma call, não pra um histórico de mensagens) — usaria Meetings só
  como referência secundária pra um widget de resumo no dashboard
  (não implementado nesta rodada). Listagem ficou em `DataTable` normal
  (`TicketsView.vue`/`AdminTicketsView.vue`), só o DETALHE (dentro de um
  `Drawer`) reaproveita a estrutura 2-painéis do Chats.
- **`TicketMessageList.vue`** (bloco puramente de apresentação, sem
  regra de negócio) — bolha alinhada à direita (`{colors.primary}` de
  fundo, texto `{colors.paper}`) quando `message.userId === currentUserId`
  (mensagem própria), à esquerda (`{colors.bg-2}` de fundo, texto
  `{colors.ink}`) quando é de outra pessoa — mesmo padrão visual do
  frame "Chats" (bolha própria escura à direita, bolha da outra pessoa
  clara à esquerda). `Avatar` + nome do autor acima da bolha,
  `formatRelativeTime` (`shared/services/formatDate.ts`, já existia da
  Fase 5/`NotificationItem`) no timestamp — leitura de "há poucos
  segundos"/"há 2 minutos" é o padrão certo pra thread de conversa,
  diferente da data formatada (`DD/MM/YYYY`) usada nas colunas de
  `DataTable`. Reaproveitado pelos 2 painéis (usuário e admin) — 2º
  consumidor real que justificou ficar em `components/blocks/` (mesmo
  critério de promoção do resto do projeto).
- **`TicketThreadPanel.vue`** (usuário) — cabeçalho com assunto +
  `StatusDot` de status + botão "Marcar como resolvido" (só quando
  `open`), corpo = `TicketMessageList`, rodapé = composer (`Input` +
  `Button` `icon-before="PaperPlaneTilt"`). Quando o chamado já está
  `resolved`, um aviso aparece acima do composer ("Enviar uma mensagem
  vai reabrir este chamado") — a UI não tem um botão "Disputar"
  separado, é o MESMO campo de resposta que decide sozinho (ver achado
  de negócio no `plano-implementacao.md`, Fase 8).
- **`AdminTicketThreadPanel.vue`** — mesma estrutura, 2 diferenças reais:
  mostra "Aberto por {nome}" (já que aqui não é sempre o próprio ator) e
  nunca tem o aviso de reabertura (responder um chamado resolvido nunca
  reabre do lado do admin).
- Verificado em browser real, fluxo completo ponta a ponta (usuário abre
  → admin responde e resolve → usuário reabre respondendo, toast
  "Chamado reaberto — sua mensagem foi registrada", status volta pra
  "Aberto" automaticamente): bolhas alinhadas corretamente nos 2 lados
  pros 2 atores, avatar/nome/timestamp corretos, `StatusDot` trocando de
  cor (amarelo↔verde) em tempo real sem reload.

**Correção pixel-perfect, mesmo dia — "cadê o pixel perfect?", pedido
direto do usuário comparando lado a lado com as capturas reais do frame
"Chats"** — a primeira versão só tinha copiado a bolha de mensagem
alinhada por remetente, deixando pra trás 2 diferenças estruturais reais
da referência:

- **Sem separador de data** — a referência tem um divisor "Today" antes
  das mensagens do dia; a v1 não tinha nenhum agrupamento por data.
  Corrigido em `TicketMessageList.vue`: `computed` agrupa as mensagens
  por dia (`dayjs().isSame(..., 'day')`), rótulo "Hoje"/"Ontem"/
  `D de mês` (dayjs, locale pt-BR já registrada em
  `formatDate.ts`), divisor com linha `{colors.ink-10}` dos dois lados
  do texto (`::before`/`::after`, `flex: 1`).
- **Composer era `Input` + `Button` soltos lado a lado, não uma barra
  única** — a referência mostra o campo de digitação e o botão de
  enviar como UMA forma arredondada só, não 2 elementos separados com
  espaço entre eles. Corrigido envolvendo os 2 numa barra própria
  (`.ticket-thread-panel__composer-bar`/`.admin-ticket-thread-panel__composer-bar`,
  `{colors.bg-1}` + borda `{colors.ink-10}` + `{radius.16}`), com o
  `Textarea` (ver seção própria, também pedida na mesma rodada) cedendo
  a própria borda/fundo pra essa barra assumir — mesma técnica de
  `.ui-toolbar__filters :deep(.ui-select-wrapper)` já usada no
  `ListToolbar.vue`. O botão de enviar continua com o próprio
  `{radius.8}` (não pill) dentro da barra maior — padrão comum de barra
  arredondada com controle menor dentro, sem inventar uma 2ª escala de
  raio só pra isso.
- **Trocado `Input` (1 linha) por `Textarea` no composer** (`rows=1`,
  cresce até `maxRows=6`) — resolve os 2 pedidos na mesma rodada: o
  composer de chat de verdade cresce com o texto, e o `Enter` puro
  envia (`@keydown.enter.exact.prevent`) enquanto `Shift+Enter` insere
  quebra de linha, sem precisar de nenhuma prop nova no átomo (decisão
  já registrada na seção `Textarea` acima).
- **O que ficou de propósito diferente da referência**: o painel de
  chamado continua dentro de um `Drawer` sobre a listagem em
  `DataTable` (não os 2 painéis lado a lado, sempre visíveis, como o
  Chats de verdade) — mudança de arquitetura maior, não cosmética;
  registrada como pergunta em aberto pro usuário, não assumida
  silenciosamente.
- Reverificado em browser real: `scrollHeight` do `Textarea` do
  composer cresce de ~40px pra >100px com texto de 3 linhas; `Shift+Enter`
  insere quebra sem enviar, `Enter` puro envia e limpa o campo; divisor
  "Hoje" aparece acima do primeiro grupo de mensagens do dia.

**Achado real, notificação `ticket_opened` sem tradução** — o painel do
sino (`NotificationPanel.vue`, Fase 5) mostrava a chave crua
`notificationTitleTicketOpened` em vez de texto, porque o catálogo
`pt-BR.ts` não tinha essa entrada ainda (mesmo mecanismo de "chave
desconhecida cai pro texto literal" já documentado — `useApiMessage`).
Corrigido adicionando `notificationTitleTicketOpened`/
`notificationMessageTicketOpened` ao catálogo flat, conferidas 1:1
contra `NotificationMessageKey::TicketOpenedTitle`/`TicketOpenedMessage`
do backend — pego durante a própria verificação em browser real (o
roteiro incluiu abrir o sino do admin depois de criar um chamado), não
depois de reportar como pronto.

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
- **Sem componente de card/tabela/badge ainda**: o dashboard de
  precificação (Fase 4 de `docs/planejamento/plano-implementacao.md`) é o
  primeiro lugar que vai exigir isso — os tokens de `rounded`/`spacing`
  reservados (16, 24...) esperam por eles. Categorização micro/macro e
  ordem de construção de todo o catálogo (não só card/tabela/badge) em
  `docs/design/catalogo-componentes.md`.
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
