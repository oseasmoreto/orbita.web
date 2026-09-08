# Componentes — Shell do app (sidebar/header/footer)

AppSidebar, AppHeader, AppFooter, StatusDot — o chrome fixo do app (`core/layouts/`) montado uma vez em `AppLayout.vue`.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## AppSidebar (`core/layouts/{AppSidebar,AppSidebarContent,AppSidebarNavItem}.vue`)

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

## AppHeader (`core/layouts/AppHeader.vue`)

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

## AppFooter (`core/layouts/AppFooter.vue`)

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

## StatusDot (`shared/components/ui/StatusDot.vue`)

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

