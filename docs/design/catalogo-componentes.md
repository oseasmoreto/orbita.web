# Catálogo de Componentes de UI — Micro/Macro e Ordem de Implementação

Fonte: página **"🔶 Components"** do arquivo Figma
[Dashboard Design System (Community)](https://www.figma.com/design/yJ24tdCVyBRTAyLvplYoZE/Dashboard-Design-System--Community-?node-id=1246-28355),
lida via MCP em 2026-08-27. Este documento categoriza os 24 frames dessa
página segundo a mesma régua micro/macro já definida em
`docs/infra/convencoes-frontend-infra.md` (seções 3.1/3.2) — não redefine a
régua, só aplica ela a um catálogo real — e propõe uma ordem de construção
amarrada às fases de `docs/planejamento/plano-implementacao.md`.

Regra de bolso (detalhe completo no doc de convenções):
- **Micro** (`shared/components/ui/`): átomo, não sabe de domínio, não faz
  chamada de API. Se tem comportamento complexo (foco, teclado, ARIA), é
  construído em cima de um primitivo Reka UI, nunca do zero.
- **Macro** (`shared/components/blocks/` ou `modules/<contexto>/components/blocks/`):
  composição de 2+ micro, pode ter lógica de apresentação, mas nunca regra
  de negócio (decisão vem de um composable via prop).

---

## 1. Reimplementados contra a spec real (concluído em 2026-08-27)

`Button.vue`/`Input.vue`/`Icon.vue` já existiam no repo desde a Fase 0, mas
tinham sido construídos **antes** de revisar o Figma real — não batiam com
a spec. Reimplementados do zero, verificados em browser real (typecheck +
lint + biome + build + screenshot + hover programático).

| Figma | Componente | O que a versão antiga errava | O que mudou |
|---|---|---|---|
| Button | `Button.vue` | Eixo `size` tinha `sm`/`md`/`lg` (Figma só define `Medium`/`Large`); eixo `variant` tinha `danger` (não existe no Figma) e faltava `Outline`; eixo `icon` inteiro não existia (Figma tem `Icon Before`/`After`/`Only`/`Text Only`/`Icon-Icon`/`Icon-Text-Icon`); hover do `primary` usava `filter: brightness(92%)`, que **não tem efeito nenhum sobre preto puro** (achado real, confirmado via hover programático — o botão antigo nunca mudava de cor no hover). | `size: medium\|large`, `variant: primary\|secondary\|outline\|ghost`, props `icon-before`/`icon-after` (cobrem as 6 combinações do Figma sem precisar de um enum de variante de ícone), hover do primary via token `$color-primary-hover` (`#494949`, medido no componente real). |
| — (Form → `Type=Input-A`/`Input-B`) | `Input.vue` | Não distinguia os dois tipos do Figma; usava `{colors.bg-2}` como fundo (Figma usa `{colors.bg-1}`, branco). | Prop opcional `label`: ausente = Input-A (campo isolado, padding `8px 16px`); presente = Input-B (label 12px dentro da mesma caixa, padding `16px 20px`) — mesmo componente, um wrapper a mais pra acomodar o label sem duplicar o átomo. |
| — | `Icon.vue` | Nada — arquitetura (wrapper fino + prop `icon`) já estava correta. | Nenhuma mudança de código. Confirmado que o ícone dentro de `Button` é 20px (medium)/28px (large) — diferente do ícone de apoio de Select/Date (16px, ainda não implementado). |

**Achado operacional, não sobre o componente**: a API REST do Figma no
plano free tem rate limit curto — bateu no limite (`429`, retry-after de
~4,6 dias) no meio da pesquisa de detalhe do Button. As medidas de
`Input`/`Icon` já tinham sido capturadas antes disso na leitura inicial da
página inteira (ver seção 2 mais abaixo pra tiers seguintes) — não afetou
o resultado deste tier, mas os próximos tiers vão precisar trabalhar só
com o que já foi capturado até aqui (sem chamada nova ao Figma por uns
dias) ou pedir pro usuário validar visualmente contra o arquivo original.

---

## 2. Micro (átomos) — a implementar

| Figma | Componente proposto | Nota |
|---|---|---|
| Badge-Tag | `Badge.vue` ✅ | Concluído em 2026-08-27 — variantes `ghost`/`gray`, tamanhos `sm`/`md`, `icon-before`/`icon-after` fixos em 12px. Padding real do Figma (`1px 4px`) tem um `1px` vertical fora da escala de 4px — documentado como valor legítimo do componente, não arredondado. |
| Label | Avaliar se é prop de `Badge` (`variant="status"`) ou componente próprio `StatusBadge.vue` | Pill de status (In Progress/Approved/Rejected...) com/sem fundo — sobrepõe conceitualmente com Badge, decidir na hora de implementar, não duplicar átomo. |
| Avatar-Name | `Avatar.vue` ✅ | Concluído em 2026-08-27 — `AvatarRoot`/`AvatarImage`/`AvatarFallback` da Reka UI. `USER` não tem campo de foto no modelo de dados, então o fallback de iniciais é o caminho normal, não uma exceção. Variante "com nome ao lado" continua composição fora do átomo. |
| Form → `Type=CheckBox` | `Checkbox.vue` ✅ | Concluído — construído sobre `CheckboxRoot` da Reka UI, usando os próprios ícones `Checkbox`/`Checkbox2`/`Checkbox3`/`Checkbox5`/`Checkbox6`/`Checkbox8` de `docs/icons-snow-ui/` como estado renderizado (não só referência). |
| Form → `Type=Switch` | `Toggle.vue` ✅ | Concluído — `SwitchRoot`/`SwitchThumb` estilizados via CSS (token de espaçamento/raio), não com os ícones planos do Figma (matam a transição de deslizar). Dimensões não verificadas no Figma (rate limit), ver seção "Ordem de implementação". |
| Form → `Type=Select-A/B`, Dropdown | `Select.vue` ✅ | Concluído — família `Select*` da Reka UI. Ícone do trigger é `CaretUpDown` (regular.generated) — "ArrowLineUpDown" do Figma não existe no export. Achado real: `SelectContent` teletransporta pro `<body>` via `SelectPortal`, escapando do escopo do Vue — precisou de `:global()` nas regras (ver design-system.md, seção Components → Select). **2º achado, reportado pelo usuário em 2026-08-27**: toda opção aparecia com cor de disabled mas continuava selecionável — `&[data-disabled]`/`&[data-highlighted]` aninhados dentro de `:global(.ui-select-item)` perdiam o seletor-pai na compilação (viravam `.ui-select-item` sem o atributo, aplicando a regra a toda opção). Corrigido escrevendo seletores planos (`:global(.ui-select-item[data-disabled])`), sem `&` aninhado dentro de `:global()`. |
| Search | `Search.vue` ✅ | **Decisão revista em 2026-08-27**: virou componente próprio, não variante de `Input.vue` — só depois de examinar o frame real do Figma (essa linha original foi escrita sem checar), viu-se que a grafia (caixa compacta, fundo cinza no idle, borda só aparece no hover/foco, botão de limpar, hint de atalho) diverge demais do Input-A/B (sempre branco, sempre com borda) pra caber como props extras. Os 3 `Type=Grey/White/Typing` continuam sendo estado de interação (`:hover`/`:focus-within`), não props escolhidas pelo consumidor. Detalhe completo em design-system.md, seção Components → Search. |
| _Tab Item | `Tab.vue` | Trigger individual (`State=Unselected/Selected`), construído em cima do primitivo Reka UI `Tabs`. |
| OS → ToolTips | `Tooltip.vue` ✅ | Concluído em 2026-08-27 — `TooltipProvider`/`TooltipRoot`/`TooltipContent` via `TooltipPortal`. Fundo `{colors.ink-80}` (match exato com "Black/80%"), prop `shortcut` opcional. Mesmo achado do Select: `TooltipContent` teletransporta pro `<body>`, precisou de `:global()`. |
| OS → Data loading | `Spinner.vue` ✅ | Concluído em 2026-08-27 — wrapper do ícone `Loading` (não `Loading1`, que perde o gradiente cônico) com `@keyframes` de rotação. Achado real sistêmico documentado na linha do Tier 3 acima (`createIcon.ts`/`inheritAttrs`). |
| Featured Icon | `IconTile.vue` (nome a definir) | Ícone grande dentro de um container arredondado — usado como hero de empty-state/card, não domínio. |

---

## 3. Macro (blocos) — a implementar

| Figma | Componente proposto | Nota |
|---|---|---|
| Form (como conjunto) | `FormGroup.vue` ✅ (`shared/components/blocks/`) | Concluído em 2026-08-27. Já citado na seção 3.2 do doc de convenções. Agrupa Label+Input/Select/Checkbox+mensagem de erro — composição, nunca decide regra de validação (isso é do composable `use<Recurso>Form`). Sem frame próprio no Figma (confirmado: o `COMPONENT_SET "Form"` só tem os controles isolados, nenhum com padrão de erro). Label envolve o controle via `<label>` (não `for`/`id`, ver design-system.md) — usar só quando o controle do slot não tiver a própria prop `label` interna, pra não duplicar. |
| Table Components | `DataTable.vue` ✅ (`shared/components/blocks/`) | Concluído em 2026-08-27. Bloco mais rico do catálogo — variantes de célula (`Type=Status/Date/Text-Icon/Users/User/Activity/Operation/Select/Title`...) viraram slot nomeado `#cell-<key>`, não componentes separados. Genérico de verdade (`generic="T extends object"`, Vue 3.3+). **Achado real, sistêmico**: qualquer ícone dentro de célula de `<table>` colapsa a `width:0` por causa do reset global `svg { max-width: 100% }` (`core/styles/_reset.scss`) entrando em ciclo de resolução de largura com `table-layout: auto` — corrigido com `.ui-data-table :deep(svg) { max-width: none }`, cobre tanto ícones do próprio componente (checkbox de seleção, seta de ordenação) quanto os de slots do consumidor. `Table-B` (variante simples do Figma, sem seleção/menu de operação) não exigiu nenhuma mudança de código — já coberta pela mesma API genérica. Detalhe completo em design-system.md, seção Components → DataTable. |
| Breadcrumb | `Breadcrumb.vue` | Composição de `Button`/link + separador. |
| Tabs (a barra, não o item) | `TabBar.vue` ou uso direto do primitivo Reka UI `Tabs` + `Tab.vue` | O frame "Tabs" mistura `BlockTab` (Tab + linha + Badge-Tag) e `TopTab` (grupo de Buttons) — dois padrões de navegação por abas, avaliar qual(is) a Orbita realmente precisa antes de construir os dois. |
| Notification (item) | `NotificationItem.vue` (`modules/platform/components/`) | `State=Failure/Successful`, `Size=Big/Small` — item de uma lista de notificações (Fase 5), não o toast (`vue-sonner` já cobre toast avulso). |
| Layout → `RightBar`, seção "Notifications" | `NotificationPanel.vue` (`modules/platform/components/`) | Decisão 2026-08-27: só a seção "Notifications" do `RightBar` do Figma vira painel de verdade — as seções "Activities" (seria admin-only, `AUDIT_LOG`) e "Contacts" (Orbita não tem conceito de time/contato, é 1 login = 1 assinatura) ficam fora, não mapeiam pra nenhuma regra de negócio do produto. É o painel que o sino do `AppHeader` abre — lista `NotificationItem`s, hoje o sino só é chrome visual sem função. |
| Widget → `Card`/`Status`/`Info` | `Card.vue`, `StatCard.vue` (nomes a definir) | Cascas de card de dashboard — construir a casca não depende do backend, mas o conteúdo real (preço sugerido) segue bloqueado pelo gap já registrado em `plano-implementacao.md` (Fase 4). |
| Chart (Histogram/ChartDot/Ring/ChartScale) | `ChartCard.vue` (wrapper `chart.js`+`vue-chartjs`) | Já é regra o wrapper de gráfico ser sempre um block (seção 3.2). Mesmo bloqueio de backend do item anterior. |
| Date Picker | `DatePicker.vue` | Primitivo Reka UI (Popover + calendário) — o mais complexo do catálogo, variantes com hora/intervalo aumentam o escopo. Baixa prioridade — nenhuma tela do plano atual exige filtro de data ainda. |
| Pagination | `PaginationNav.vue` ✅ (`shared/components/blocks/`) | **Concluído em 2026-08-27, mesmo dia** — o gap identificado ao implementar `DataTable` foi resolvido logo em seguida, quando o usuário mostrou um screenshot mais completo do mesmo arquivo do Figma confirmando `Pagination`/`Function Bar` como parte do mesmo conjunto. Componente próprio no Figma (`#4113:42236`), renomeado pra `PaginationNav` (`vue/multi-word-component-names` exige nome composto pra blocks). Test-first (lógica de janela de páginas), ver `tests/shared/components/blocks/PaginationNav.test.ts`. |
| Function Bar | `ListToolbar.vue` ✅ (`shared/components/blocks/`) | **Concluído em 2026-08-27**, mesmo achado do `Pagination` acima. 3 `Button` ghost ícone-only (Adicionar/Filtrar/Ordenar — o "Button Group" do Figma não é um primitivo próprio, é só 3 botões com `gap:8px`) + `Search` embutido. Nome genérico (não `TableToolbar`) porque o mesmo padrão aparece solto em outras telas do Figma. |
| Layout → `_Sidebar Item` + `Header-A` | `core/layouts/{AppLayout,AppSidebar,AppSidebarContent,AppSidebarNavItem,AppHeader}.vue` ✅ + `useAppShell.ts` ✅ | **Concluído em 2026-08-27** — não é um componente de UI solto, é infraestrutura de layout que faltava desde a Fase 0. `home` virou rota filha de um `AppLayout` pai no router (`meta.requiresAuth` propaga pros filhos automaticamente, sem repetir em cada rota). Sidebar/Header são componentes próprios (não inline no `AppLayout`) pra caber os grupos de nav e itens expansíveis do Sidebar do Figma (`_Sidebar Item` com seta revelando sub-itens) e a versão mobile — `AppSidebarNavItem.vue` é recursivo (`children` no tipo `NavItem`), `AppSidebar.vue` renderiza tanto a coluna estática (desktop) quanto um drawer (`vaul-vue`, mobile) reaproveitando o mesmo `AppSidebarContent.vue`. `core/layouts/useAppShell.ts` é o composable pedido — estado singleton em nível de módulo (menu mobile aberto/fechado, itens expandidos), testado em `tests/core/layouts/useAppShell.test.ts`. **Achado real, sistêmico**: `router/index.ts` foi o primeiro `.ts` do projeto a importar um `.vue` direto — faltava o shim `declare module '*.vue'` em `vite-env.d.ts` (o `vue-tsc` não precisa dele, mas o `tsc`/ESLint type-aware por baixo do `typescript-eslint` precisa), gerando falso-positivo `no-unsafe-assignment`. Corrigido, vale pra qualquer `.vue` importado de um `.ts` daqui pra frente. **2 achados reais adicionais** durante a extração do header/sidebar: (1) o botão hambúrguer ficava visível no desktop porque `.app-header__menu-button` (com o `display:none` do breakpoint) vinha *antes* de `.app-header__icon-button` (com `display:inline-flex` incondicional) no CSS — mesma especificidade, quem vem depois vence, então o `none` nunca tinha efeito; corrigido só reordenando os blocos. (2) o drawer mobile (`vaul-vue`, que usa Reka UI `Dialog` por baixo) avisava em runtime por falta de `DrawerTitle`/`DrawerDescription` (acessibilidade pra leitor de tela) — corrigido adicionando os dois, visualmente escondidos via padrão "sr-only" (não `display:none`, que também os removeria da árvore de acessibilidade). Os dois confirmados via browser real (computed style + console), não só lidos no código. |

**Gap encontrado, não achado no Figma** (resolvido em 2026-08-27):
`Modal`/`Dialog`/`ConfirmDialog` já era exigido pela seção 3.1 do doc de
convenções (primitivo Reka UI `Dialog`), mas não existe frame próprio nessa
página do Figma — construído direto sobre o primitivo Reka UI + tokens do
design system, sem referência visual do Figma. `Modal.vue`
(`shared/components/ui/`) é o primitivo (título obrigatório, descrição
opcional com fallback `VisuallyHidden`, slots default/footer condicionais,
fecha via `X`/overlay/`Esc`); `ConfirmDialog.vue`
(`shared/components/blocks/`) compõe `Modal` + 2 `Button` pra confirmação
de ação, sem variante destrutiva/vermelha de propósito (`Button` não tem
`variant="danger"`, decisão já tomada na Tier 0). Detalhe completo em
design-system.md, seções Components → Modal / ConfirmDialog.

**Pedido direto do usuário, fora do plano original do tier**: `Drawer.vue`
(`shared/components/ui/`) — variação do `Modal` que abre como painel
lateral (`top:0`/`right:0`, `height:100vh`) em 3 tamanhos (`sm` 320px/`md`
480px/`lg` 640px), com o mesmo efeito de slide do drawer mobile da sidebar
(`core/layouts/AppSidebar.vue`) — reaproveita o mesmo `vaul-vue`, só
`direction="right"` em vez de `"left"`. Mesma estrutura do `Modal`
(título/descrição/slots condicionais/`DrawerClose`), tamanhos sem
grounding no Figma (decisão nossa, mesmo caso do `max-width` do `Modal`).
**Correção pedida em seguida (mesmo dia), com referência visual de outro
produto**: abaixo do breakpoint `md` vira bottom sheet (slide de baixo pra
cima, `DrawerHandle` visível, sempre 100% de largura — os 3 tamanhos só
valem no desktop) — `direction` do `vaul-vue` trocado reativamente
(`useMediaQuery` do `@vueuse/core`), não só CSS, porque a mecânica de
arrasto depende do eixo. Detalhe completo em design-system.md, seção
Components → Drawer.

---

## 4. Fora de escopo (não são componentes de UI pra implementar)

| Figma | Motivo |
|---|---|
| Typography | Guia de estilo (já documentado em `design-system.md`), não um componente. |
| Color Guidance | Guia de cor (idem), não um componente. |
| Design Notes (Cursors, Line/arrows) | Anotação interna do próprio Figma (cursor de mouse, seta de anotação) — não é UI de produto. |
| Brand (Logo, Copyright, Social Media) | Rodapé de marketing com redes sociais — Orbita é um dashboard autenticado, sem página pública de marketing nesse formato. |
| AI (RightBar, Chat bubble, Function Bar) | Painel de assistente de IA — nenhuma feature de IA existe no roadmap de nenhum dos docs do projeto. |
| OS → WindowControl | Chrome de janela desktop (minimizar/maximizar/fechar) — não aplicável a app web. |
| Layout (segunda ocorrência, `#4113:43109`) | Duplicata/sobra no arquivo Figma — sem conteúdo além de um ícone de stack, sem variantes reais. |
| Layout → `RightBar`, seções "Activities" e "Contacts" | "Activities" seria admin-only (`AUDIT_LOG`, Fase 6), não um painel de usuário comum; "Contacts" não tem pra onde ir — Orbita não tem conceito de time/contato (1 login = 1 assinatura, sem conta compartilhada). Só a seção "Notifications" do mesmo `RightBar` vira componente de verdade, ver `NotificationPanel.vue` na seção 3. |

---

## 5. Ordem de implementação

Amarrada ao que `docs/planejamento/plano-implementacao.md` já diz que cada
fase precisa — não uma ordem nova e desconectada.

| Tier | Componente(s) | Por quê agora |
|---|---|---|
| 0 | `Button` ✅, `Input` ✅, `Icon` (sem mudança) | **Concluído em 2026-08-27**, reimplementados contra a spec real (seção 1) — variantes/tamanhos/cores medidos direto no Figma, verificado em browser real. `Icon.vue` não precisou de mudança de código, só confirmação de tamanho por contexto de uso. |
| 1 | `Checkbox` ✅, `Toggle` ✅, `Select` ✅ | **Concluído em 2026-08-27.** Fecha os átomos de formulário que a Fase 1 (Identity) já vai consumir em login/registro ("lembrar de mim", preferência, plano). |
| 2 | `AppLayout` ✅ (sidebar + header, componentizados + `useAppShell.ts`) | **Concluído em 2026-08-27.** Nav list só com "Dashboard" por enquanto — mais itens/grupos entram junto com a rota real de cada fase, nunca link morto, mas a estrutura já suporta grupo com título e item com `children` (expansível) desde já. Header **não** replica tema claro/escuro, histórico ou painel lateral direito do Header-A do Figma (decisão explícita: nenhuma dessas features está documentada no roadmap do Orbita) — só título da página, sino de notificação e avatar (placeholder até `Avatar.vue`, Tier 3), mais um botão hambúrguer (só mobile) que abre o drawer da sidebar. |
| 3 | `Badge` ✅, `Avatar` ✅, `Tooltip` ✅, `Spinner` ✅ | **Concluído em 2026-08-27.** Átomos de apoio usados transversalmente (perfil no header, status em qualquer lista, loading de qualquer chamada assíncrona). **Achado real, sistêmico**: `createIcon.ts` tinha `inheritAttrs: false` (bloqueando de propósito o `stroke-width` que `Icon.vue` sempre manda, só relevante pro `@lucide/vue`) — efeito colateral não percebido até `Spinner.vue` precisar de uma classe de animação: `class`/`style` também ficavam bloqueados, sem erro/warning nenhum, então nenhum consumidor de ícone gerado conseguia aplicar classe/estilo via `<Icon class="..." .../>` até agora. Corrigido com `useAttrs()` repassando `class`/`style` manualmente, mantendo o bloqueio do resto. Detalhe completo em `docs/design/design-system.md`, seção Components → Spinner. |
| 4 | `FormGroup` ✅, `Search` ✅ | **Concluído em 2026-08-27.** Fecham a experiência de formulário completa — Fase 1 (`AccountView`) e Fase 3 (`ProductForm`). `Search` virou componente próprio (não variante de `Input.vue`, ver linha da seção 2) depois de examinar o frame real do Figma. |
| 5 | `Modal` ✅/`ConfirmDialog` ✅/`Drawer` ✅ | **Concluído em 2026-08-27.** Necessário a partir da Fase 2 (cancelar assinatura) e reusado em praticamente toda fase depois (excluir produto, desconectar marketplace...). Sem frame no Figma — construído sobre `Dialog*` da Reka UI, ver "Gap encontrado" na seção 3. `Drawer` foi pedido direto pelo usuário (não estava no plano original do tier): painel lateral `top:0`/`right:0`/`height:100vh` em 3 tamanhos (`sm`/`md`/`lg`), reaproveitando a mesma mecânica `vaul-vue` já usada no drawer mobile da sidebar (`direction="right"` em vez de `"left"`). |
| 6 | `DataTable` ✅, `PaginationNav` ✅, `ListToolbar` ✅ | **Concluído em 2026-08-27.** Bloco mais pesado do catálogo, mas é o que a Fase 3 (lista de produtos) e Fase 4 (marketplaces conectados) mais precisam. `PaginationNav`/`ListToolbar` entraram no mesmo tier depois que o usuário mostrou um screenshot mais completo do frame "Table" do Figma (`Function Bar`/`Pagination` ficam ao lado de `Table-A`/`Table-B`, mesmo conjunto). Ver "Table Components" na seção 3 pro achado real do `svg`/`table-layout`. |
| 7 | `Select`/`Dropdown` como menu de ação de linha | Reaproveita o átomo do Tier 1 — só faz sentido depois do `DataTable` existir. |
| 8 | `Breadcrumb`, `Tab`/`TabBar` | Navegação secundária — ganha valor a partir da Fase 4/6, quando existem sub-seções (ex.: admin de marketplace com abas). |
| 9 | `NotificationItem`, `NotificationPanel` | Fase 5 (Platform) — painel conecta no sino do `AppHeader` (Tier 2), que hoje é só chrome visual sem função. |
| 10 | `Card`/`StatCard`, `ChartCard` | Casca pronta pra Fase 4, mas conteúdo real de preço sugerido **continua bloqueado** pelo gap de backend já registrado (`PricingCalculator` nunca exposto em rota). |
| 11 | `DatePicker` | Mais raro — só entra quando alguma tela pedir filtro de data (ex.: auditoria na Fase 6). Menor prioridade do catálogo. |

Cada componente novo entra na seção "Components" de
`docs/design/design-system.md` no mesmo PR que o introduz (regra já
existente, não nova) — este catálogo é o roteiro de *quando*, o
design-system é a fonte de verdade de *como*.
