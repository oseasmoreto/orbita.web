# Componentes — Feedback e visualização de dado

Toast/useToast, NotificationItem/NotificationPanel (primeira versão), StatCard, ProgressBar, ChartCard, DatePicker, DateRangePicker, TagsInput.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## Notifiers / Toast (`shared/composables/useToast.ts`)

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

## NotificationItem (`modules/platform/components/NotificationItem.vue`)

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

## NotificationPanel (`modules/platform/components/NotificationPanel.vue`)

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

## StatCard (`shared/components/blocks/StatCard.vue`)

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

## ProgressBar (`shared/components/ui/ProgressBar.vue`)

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

## ChartCard (`shared/components/blocks/ChartCard.vue`)

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

## DatePicker (`shared/components/ui/DatePicker.vue`)

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

## DateRangePicker (`shared/components/ui/DateRangePicker.vue`)

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

## TagsInput (`shared/components/ui/TagsInput.vue`)

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

