# Componentes — Átomos e formulário

Button, Icon, Input, Textarea, Checkbox, Toggle, Select, Combobox, Badge, Avatar, Tooltip, Spinner, Search — os átomos de `shared/components/ui/` ligados a texto/entrada/feedback pontual.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## Button (`shared/components/ui/Button.vue`)

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

## Icon (`shared/components/ui/Icon.vue`)

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

## Input (`shared/components/ui/Input.vue`)

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

**Prop `autocomplete`, 2026-09-03, pedido direto do usuário com
captura real** — `CreateAdminUserForm.vue` (admin cria a conta de OUTRO
usuário) tinha os campos de e-mail/senha destacados em amarelo pelo
Chrome, autopreenchidos com o e-mail/senha do próprio admin LOGADO — o
browser lê "campo de e-mail + campo de senha" e assume que é um
formulário de login/cadastro da PRÓPRIA conta de quem está digitando,
oferecendo autofill (e depois "salvar senha") com a credencial errada.
`Input.vue` não tinha `autocomplete` nenhum antes disso — sem valor
explícito, o browser decide sozinho, o que já é o comportamento CORRETO
pra login/cadastro real (autofill da própria conta é esperado ali).
Prop nova, opcional (repassada 1:1 pro `<input>` nativo, sem
`autocomplete` nenhum quando omitida — zero mudança nos consumidores
existentes), usada só onde o autofill do browser erra o alvo:
`CreateAdminUserForm.vue` ganhou `autocomplete="off"` em nome/e-mail e
`autocomplete="new-password"` nos dois campos de senha — `new-password`
é o valor padrão da indústria pra "isto não é uma senha existente pra
autopreencher, nem a mesma sessão de quem está logado", mais confiável
que `off` nesse caso específico (Chrome historicamente ignora `off` em
campo de senha). Verificado em browser real (Playwright, sessão de
`admin_master` real): os 4 campos do Drawer "Novo usuário" carregam o
atributo certo no DOM (`text`→`off`, `email`→`off`,
`password`/`password`→`new-password`); nenhum outro consumidor de
`Input.vue` (login, cadastro, reset de senha) foi alterado — só quem
precisava do valor explícito ganhou a prop.

## Textarea (`shared/components/ui/Textarea.vue`)

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

## Checkbox (`shared/components/ui/Checkbox.vue`)

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

## Toggle (`shared/components/ui/Toggle.vue`)

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

## Select (`shared/components/ui/Select.vue`)

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

## Combobox (`shared/components/ui/Combobox.vue`)

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

## Badge (`shared/components/ui/Badge.vue`)

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

## Avatar (`shared/components/ui/Avatar.vue`)

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

## Tooltip (`shared/components/ui/Tooltip.vue`)

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

**3 correções pedidas direto pelo usuário em 2026-09-03, com captura do
ícone/tooltip do `campaignPriceTooltip` (`ProductMarketplacePricingView.vue`)
"quebrado"**:

1. **`max-width: 260px` + `white-space: pre-line`** — achado real: um
   texto explicativo longo (`campaignPriceTooltip`, ~230 caracteres,
   uma frase só) nunca quebrava linha (sem `max-width`/wrap, `<span>`
   crescia até quase a largura da viewport inteira) — o cálculo de
   colisão do Reka UI, tentando reposicionar essa caixa gigante pra não
   estourar a tela, jogava o tooltip pra um canto bem longe do próprio
   ícone que abriu ele (lido pelo usuário como "o tooltip ficou na
   linha errada"). `pre-line` respeita `\n\n` como quebra de parágrafo
   (pedido: "podemos quebrar em blocos") sem impedir o wrap normal
   dentro de cada bloco.
2. **Ícone caindo pra linha própria, órfão embaixo do texto** (2ª
   captura, "o ícone do tooltip segue quebrado") — causa raiz diferente
   da acima, mesma classe de bug já documentada pro `DataTable.vue`
   (`svg { max-width: 100% }` do reset global): aqui é o **`display:
   block`** do MESMO reset (`img, picture, svg { display: block; }`,
   `core/styles/_reset.scss`) que importa — um `<svg>` de bloco dentro
   de um `<span tabindex="0">` no MEIO de uma linha de texto força
   quebra de linha ANTES dele (bloco dentro de inline sempre quebra),
   então o ícone caía sozinho pra linha de baixo. Não era falta de
   espaço (`white-space: nowrap` no texto sozinho não resolvia) —
   corrigido no CONSUMIDOR (`ProductMarketplacePricingView.vue`, célula
   de preço/hint de campanha) com `:deep(svg) { display: inline-block;
   vertical-align: middle; }`, mesma técnica `:deep()` já usada pro
   `DataTable`. Registrado aqui porque é o mesmo padrão "ícone dentro de
   texto corrido" que qualquer tooltip-com-ícone-inline futuro vai
   repetir — a correção mora no consumidor, não no `Tooltip.vue`
   genérico, porque o "bloco quebra linha" só acontece quando o ícone
   está DENTRO de um fluxo de texto (não é o caso comum de ícone sozinho
   num botão/célula).
3. **Cursor `help` em QUALQUER trigger de tooltip**, pedido explícito
   ("faça com q o ponteiro do mouse vire uma interrogação quando passada
   por qualquer tooltip") — `TooltipTrigger as-child` ganhou
   `class="ui-tooltip-trigger"`: como `as-child` MESCLA a classe no
   elemento real que o slot renderiza (mesmo mecanismo que já mescla
   `data-*`/listeners, padrão "as-child" do Reka UI), a classe chega
   tanto num `<span>` solto (ícone decorativo) quanto num `<Button>`
   inteiro usado como trigger (`ShowcaseView.vue`, 3 instâncias) — sem
   precisar de CSS por consumidor. `:global(.ui-tooltip-trigger) {
   cursor: help; }` no próprio `Tooltip.vue`. Verificado em browser
   real, os dois tipos de trigger (`getComputedStyle().cursor === 'help'`
   confirmado no `<span>` e nos 3 `<button class="ui-button ...">` da
   vitrine).
- Reverificado em browser real (bar view e table view, conexão com
  desconto de campanha configurado): ícone e texto do hint de campanha
  ficam na MESMA linha (`height: 15px`, uma linha só, antes `27px`/duas
  linhas com o ícone órfão); tooltip abre ancorado perto do ícone (não
  mais num canto distante), com o texto em 2 blocos visíveis separados
  por uma linha em branco; cursor vira "?" ao passar sobre o ícone nos
  dois views e sobre os 3 `Button`-trigger da vitrine.

## Spinner (`shared/components/ui/Spinner.vue`)

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

## Search (`shared/components/ui/Search.vue`)

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

