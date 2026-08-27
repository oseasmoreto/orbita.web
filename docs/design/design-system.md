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
- **Uso de `{colors.tint-1}`/`{colors.tint-2}`/`{colors.logo-1}`/`{colors.logo-2}`
  ainda indefinido**: trazidos pra não se perderem do export original, mas
  nenhum componente os consome hoje.
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
