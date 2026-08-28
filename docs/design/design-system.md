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

> Fonte: `docs/design/tokens/colors/SnowUI-Light.tokens.json` (modo padrão,
> sem toggle de tema ainda) e `SnowUI-Dark.tokens.json` (tokens já
> cabeados em `[data-theme='dark']`, sem UI de troca — ver Known Gaps).

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
- **Fora de escopo, de propósito**: o padrão "BlockTab" do mesmo frame
  (rótulos tipo "Total Users"/"Total Projects" misturados com `Badge-Tag`
  de filtro de data "Current Week"/"Previous Week") não é navegação de
  verdade — é um seletor de estatística combinado com filtro, sem nenhum
  caso de uso no roadmap do Orbita hoje. Só o padrão de navegação por
  abas (`TopTab`) foi implementado; revisitar se um caso de uso real
  pedir o padrão `BlockTab`.
- Verificado em browser real: clique na aba troca o painel visível
  (`data-state="active"` no `TabsContent` correto) e o sublinhado
  acompanha a aba clicada.

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
  `tests/core/layouts/useAppShell.test.ts` — o sino era só chrome visual
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
`tests/core/layouts/useAppShell.test.ts`, depois a implementação. Mesmo
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
- Prop `trend?: { direction: 'up' | 'down'; value: string }` reaproveita
  `Badge.vue` — o Figma só mostra o caso positivo (`+11.01%` com ícone
  "ArrowRise", que não existe no export gerado, mesma classe de gap já
  registrada pro `CaretUpDown`/`ArrowLineUpDown` do Select); `TrendUp`/
  `TrendDown` são os ícones mais próximos disponíveis, com o par completo
  (Figma não mostrou o caso negativo).
- **Achado real, descoberto simulando `data-theme="dark"` (sem toggle de
  UI ainda)**: `{colors.tint-1}`/`{colors.tint-2}` não têm variante pro
  tema escuro no export de origem — o fundo do card continua claro (é o
  único valor que o token tem), mas `{colors.ink}` no texto vira branco
  no tema escuro, resultando em texto branco sobre fundo claro. Sem
  impacto hoje (nenhum toggle liga o tema escuro em produção ainda — ver
  "Known Gaps"), mas documentado pra quem for construir o toggle não ser
  pego de surpresa.

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
  UI — é só texto clicável emitindo `update:activeMetric`, sem painel de
  conteúdo trocando via `role=tab`. **Nunca decide o que fazer com a
  troca** — quem decide que dado alimenta `series` depois do clique é o
  composable do módulo consumidor (mesma régua de bloco sem regra de
  negócio).
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
- **Cores só são lidas uma vez, no `onMounted`** — como não existe toggle
  de tema em runtime ainda (ver "Known Gaps"), o gráfico não precisa
  reagir a mudança de tema; quando o toggle existir, isso precisa virar
  um `watch` no estado do tema, não só uma leitura única.
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

- **Modo escuro sem toggle**: os tokens `SnowUI-Dark` estão 100% cabeados
  em `_tokens.scss` (`[data-theme='dark']`), mas nenhum composable liga
  esse atributo ainda — não existe switch de tema na UI. Ativar isso é uma
  feature nova (provavelmente `core/store`/`shared/composables/useTheme.ts`
  futuramente), não implementá-la a partir só desta doc.
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
