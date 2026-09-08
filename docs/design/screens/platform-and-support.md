# Telas — Platform (admin) e Support

NotificationItem/NotificationPanel/NotificationsView (dado real), useNotificationStore, AdminNotificationsView, AdminAuditLogsView, AdminUsersView/CreateAdminUserForm/EditUserRoleModal, ImpersonationBanner, AdminPlansView/AdminPlanForm, AdminSettingsView/AdminSettingForm, TicketMessageList/TicketThreadPanel/AdminTicketThreadPanel.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## NotificationItem/NotificationPanel/NotificationsView (`modules/platform/`)

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

**Descrição (`message`) exibida, 2026-09-03, pedido direto do usuário**
("as notificações não exibem a descrição, é importante q mostre todo o
conteudo") — a Fase 5 já resolvia `message` via `resolveMessage()`
(`title`/`message` "via `useApiMessage().resolveMessage()`", citado
acima), mas o valor nunca chegava a ser renderizado em lugar nenhum —
`NotificationItem.vue` só mostrava `title`+timestamp, o corpo real da
notificação ficava invisível nas duas superfícies (`NotificationPanel`/
`NotificationsView`, os dois reaproveitam o mesmo item). Corrigido com
um `computed` novo (`message`) + um `<p
class="notification-item__message">` entre o título e o timestamp,
`v-if="message"` (`NOTIFICATION.message` é sempre preenchido no domínio,
mas o guard cobre o caso degenerado de string vazia sem esconder um
parágrafo em branco). **Sem truncamento/`line-clamp` de propósito** — o
pedido foi explicitamente "mostre todo o conteudo": `white-space:
pre-line` preserva quebras de linha reais do texto (backend aceita texto
livre, seção 2.5 de `docs/negocio/contexto-plataforma-precificacao.md`)
em vez de colapsar tudo numa linha só, `overflow-wrap: break-word` evita
overflow horizontal com uma palavra longa sem espaço. Cor
`{colors.ink-80}` (mais escura que o timestamp em `{colors.ink-40}`,
mais clara que o título em `{colors.ink}`) — hierarquia visual de 3
níveis (título > descrição > timestamp) sem inventar um 4º tom fora da
escala de opacidade já existente. Verificado em browser real contra o
backend local (notificação seedada com uma `message` de texto livre
mais longa que o título): parágrafo da descrição aparece completo, sem
corte, nas duas telas (painel do sino e `/notifications`).

**Bug real, reportado pelo usuário em 2026-09-03 — link de `/reset-password`
mandava pro `/login` em vez de mostrar o formulário**, tanto em produção
quanto local. Causa raiz não era o router guard nem `ResetPasswordView.vue`
(os dois continuam corretos — a rota é `requiresGuest`, sem `requiresAuth`,
e o guard não redireciona um convidado nela): `NotificationPanel.vue` é
montado uma única vez em `App.vue`, pra TODA rota, inclusive as de guest
(`/login`, `/register`, `/forgot-password`, `/reset-password`), onde o
sino do `AppHeader` nem existe pra abrir este painel de verdade.
`onMounted(refreshUnreadCount)` disparava `GET /notifications` incondicional
no boot do app — sem sessão, a API devolve `401`, o que dispara o
`UNAUTHORIZED_EVENT` global (`core/api/client.ts`) e força
`router.push({ name: 'login' })` em `main.ts` (`window.addEventListener`),
atropelando o guard e a própria rota que o usuário estava tentando abrir —
exatamente o "abrir o link do e-mail te manda pro login" reportado.
Reproduzido via Playwright contra a URL de produção antes de corrigir
(`GET /v1/notifications?...` 401 → `framenavigated` pra `/login`,
confirmado no log de rede).

**Corrigido** trocando `onMounted(refreshUnreadCount)` por um `watch` em
`authStore.isAuthenticated` (`immediate: true`) — só busca o contador
quando HÁ sessão real, e zera o contador (`notificationStore.setUnreadCount(0)`)
quando ela deixa de existir (cobre também o logout, que antes deixava o
badge do sino com o número antigo até o próximo reload — achado colateral,
não reportado, mas mesma causa raiz). Verificado em browser real contra o
backend local: abrir `/reset-password?token=...&email=...` deslogado
mantém a URL e renderiza o formulário (sem nenhum `framenavigated` extra);
fluxo completo de redefinição de senha (preencher, submeter, ver modal
"Senha atualizada com sucesso") funciona ponta a ponta contra a API real.
327 testes (`vitest run`) continuam passando, sem regressão.

## useNotificationStore (`core/store/useNotificationStore.ts`)

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

## AdminNotificationsView (`modules/platform/views/AdminNotificationsView.vue`)

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

## AdminAuditLogsView (`modules/platform/views/AdminAuditLogsView.vue`)

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

## AdminUsersView / CreateAdminUserForm / EditUserRoleModal (`modules/identity/`)

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

## ImpersonationBanner (`core/layouts/ImpersonationBanner.vue`)

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

## AdminPlansView / AdminPlanForm (`modules/billing/`)

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

## AdminSettingsView / AdminSettingForm (`modules/platform/`)

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

## TicketMessageList / TicketThreadPanel / AdminTicketThreadPanel (`modules/support/`)

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


**Anexo de imagem em mensagem de chamado, 2026-09-08, pedido direto do
usuário** ("vamos precisar implementar uma melhoria nos chamados, a
possibilidade de subir imagens a cada nova mensagem, e lembrando q
estamos no ambiente de prod entao temos q persistir essas imagens") —
aviso cross-session da sessão de backend confirmou o contrato no mesmo
dia: upload em base64 no corpo do request, mesmo padrão já usado pro
logo de marketplace (`AdminMarketplaceForm.vue`), até 5 imagens por
mensagem/2MB cada (png/jpeg/webp/svg), campo `attachments` (array de
`data:image/...;base64,...`) opcional em `POST /tickets` (abrir),
`POST /tickets/{id}/messages` (responder, usuário) e
`POST /admin/tickets/{id}/messages` (responder, admin) — **não** em
`POST /tickets/{id}/dispute` (reabrir contestando), campo de fora
confirmado contra o schema OpenAPI real, não assumido. Resposta de toda
mensagem ganha `attachments: [{ id, url, created_at }]` — `url` já é o
link próprio hospedado pelo backend (nunca externo), persistido no MESMO
volume `storage-public` já configurado pra logo de marketplace
(`docker-compose.prod.yml`) — nenhuma infra nova precisou ser pedida
pra persistir em produção, era exatamente a preocupação que motivou o
pedido.

- **`useTicketAttachments.ts`** (`modules/support/composables/`, novo)
  — 2 funções puras testadas primeiro (`validateAttachmentFile`/
  `canAddAttachment`, TDD, seção 11.2 de
  `docs/infra/convencoes-frontend-infra.md`: regra de negócio real,
  espelha exatamente os limites que o backend valida — mesmo teto de
  5 anexos/2MB, mesma lista de mime type — pra dar feedback ao vendedor
  antes do roundtrip do 422) + um composable fino em volta (conversão
  `File`→base64 via `FileReader`, mesma técnica de
  `AdminMarketplaceForm.vue`, sem teste próprio — é encanamento, não
  decisão). `crypto.randomUUID()` só pro `id` LOCAL de cada rascunho
  (chave de `v-for`/remoção antes de enviar) — nunca confundido com o
  `id` real que o backend gera na resposta.
- **`TicketAttachmentPicker.vue`** (`modules/support/components/blocks/`,
  novo) — botão de anexar (`Paperclip`, `<input type="file" multiple>`
  visualmente escondido, mesma técnica "visually hidden" — não
  `display:none` — já usada no logo de marketplace) + tira de
  miniaturas (`{size.40}`, `{radius.8}`) dos anexos ainda não enviados,
  cada uma com um "×" (`{colors.ink-80}` sólido, `X` 10px) pra remover
  antes de enviar. Puramente de apresentação — só emite `add`(FileList
  cru)/`remove`(id), quem decide validade/conversão é
  `useTicketAttachments.ts`. 3º consumidor real
  (`CreateTicketForm.vue`, `TicketThreadPanel.vue`,
  `AdminTicketThreadPanel.vue`) — mesmo critério de promoção pra
  `components/blocks/` já usado em `TicketMessageList.vue`.
- **Anexo nunca disponível ao reabrir um chamado (`TicketThreadPanel.vue`
  só)** — `DisputeTicketRequest` não aceita `attachments` (confirmado
  acima), então o picker fica ausente (`v-if="!isResolved"`, nunca só
  `disabled` — mesma convenção "nunca link morto" do resto do projeto:
  uma ação que não funcionaria fica FORA do DOM com explicação, não
  visível-mas-quebrada) quando o chamado está `resolved`, substituído
  por uma linha extra no aviso de reabertura já existente
  ("Anexos não estão disponíveis ao reabrir um chamado."). `handleSend()`
  tem uma defesa a mais (nunca manda `attachments` quando
  `isResolved`, mesmo que o picker devesse estar impedindo isso) —
  `AdminTicketThreadPanel.vue` nunca disputa (`useAdminTicketThread.ts`
  sempre manda a mesma chamada de resposta), então o picker do admin
  fica sempre disponível, sem essa condição.
- **`TicketMessageList.vue`** — bolha ganhou uma galeria de miniaturas
  (`{size.64}`, `{radius.8}`, `object-fit: cover`) abaixo do texto
  quando `message.attachments.length > 0`, cada uma um `<button>`
  (reset de botão nativo, mesma técnica de "botão sem cara de botão" já
  usada em `CopyablePrice.vue`) que expande a imagem — não mais um
  `<a target="_blank">`. Corpo de texto (`<p>`) virou condicional
  (`v-if="message.body"`) — defesa contra o caso degenerado de um corpo
  vazio, nunca esperado na prática (schema exige `body` obrigatório),
  mas evita um parágrafo vazio se algum dia acontecer.
- **`TicketAttachmentLightbox.vue` (`modules/support/components/blocks/`,
  novo), correção pedida direto pelo usuário no mesmo dia** — a 1ª
  versão desta feature abria a imagem em nova aba de propósito ("sem
  lightbox no design system ainda, sem inventar componente sem
  pedido"); com o pedido explícito de "clicar pra ver a imagem, expanda
  ela e não abra em nova aba", implementado em cima do MESMO primitivo
  `Dialog*` da Reka UI que `Modal.vue` já usa (overlay/foco/Esc de
  graça) — mas **não reaproveita `Modal.vue`**: ele exige `title`
  visível e trava `max-width: 480px`, os dois errados pra "expandir uma
  imagem" (precisa ocupar o máximo de tela possível, sem título/rodapé).
  Título/descrição continuam existindo pra a11y (`VisuallyHidden`,
  mesma técnica já usada em `Modal.vue`/`Drawer.vue` quando falta
  `description`), só não aparecem visualmente. Model é `string | null`
  (não um `open` boolean separado) — só existe 1 imagem expandida por
  vez, então um único valor nulável já é a fonte de verdade completa.
  `z-index: 100/101`, mesmo valor de `Modal.vue`/`Drawer.vue` — seguro
  mesmo aninhado dentro de um `Drawer` (`TicketMessageList.vue` sempre
  vive dentro de um), mesmo precedente real já provado por
  `ProductLaunchForm.vue` (`Modal` dentro de `Drawer`, z-index igual,
  portal montado depois pinta por cima). Estado de "qual imagem está
  expandida" mora dentro do próprio `TicketMessageList.vue` (`ref`
  local, estado de UI puro) — não sobe pros 2 painéis consumidores
  (`TicketThreadPanel.vue`/`AdminTicketThreadPanel.vue`), já que só
  existe 1 lightbox por lista de mensagens e é este componente quem já
  renderiza as miniaturas.
- `schema.d.ts` patchado à mão (não regenerado por completo — mesmo
  cuidado já registrado antes nesta sessão, `git diff --stat` conferido
  puramente aditivo, 10 inserções/0 deleções) contra o JSON real do
  `/docs/api.json` do backend local: `attachments?: string[]` em
  `CreateTicketRequest`/`ReplyToTicketRequest`, schema novo
  `TicketMessageAttachmentResource` (`{ id, url, created_at }`),
  `attachments?: TicketMessageAttachmentResource[]` em
  `TicketMessageResource` — `DisputeTicketRequest` conferido SEM o
  campo, confirmando a leitura da mensagem cross-session.
- **Verificação**: typecheck (`vue-tsc`), ESLint, suíte completa
  (**390 testes**, incluindo os 7 novos de `useTicketAttachments.test.ts`
  — tipos válidos aceitos, tipo inválido/tamanho acima do limite
  rejeitados, limite de 5 anexos) e build de produção, todos limpos,
  reconfirmados depois da correção do lightbox. Mesma limitação de
  navegador real desta sessão (Playwright sem `libnspr4.so`/
  `libnss3.so`, sem acesso root pra instalar) — o fluxo completo
  (escolher imagens reais, ver a miniatura antes de enviar, enviar e ver
  a galeria na bolha, clicar numa miniatura e ver a imagem expandir em
  tela cheia — não mais nova aba —, fechar com o "×"/clique fora/`Esc`,
  tentar exceder 5 anexos/2MB e ver o toast de erro, reabrir um chamado
  sem anexo disponível) fica pendente de confirmação manual do usuário.

**Status novo `in_progress`, 2026-09-08, aviso cross-session da sessão
de backend** — `TICKET.status` ganhou um 3º valor entre `open` e
`resolved`: `open` → `in_progress` → `resolved` (antes só existiam os
dois extremos). Setado automaticamente pelo backend assim que um
`admin_master` responde pela 1ª vez a um chamado `open` — sem endpoint
novo, é efeito colateral de `POST /admin/tickets/{id}/messages`
(idempotente: responder de novo a um chamado já `in_progress` não faz
nada, e não reabre um `resolved`). Resposta do PRÓPRIO usuário nunca
muda o status. Contestar (`POST /tickets/{id}/dispute`) continua
voltando direto pra `open`, nunca pra `in_progress` — confirmado contra
o schema OpenAPI real, não assumido.

- **`ticketStatusColor()`** (`ticket.type.ts`) ganhou o 3º caso —
  `indigo` pra `in_progress`, mesmo tom já usado noutros lugares do
  design system pra "In Progress" (`ShowcaseView.vue`,
  `StatusDot color="indigo"`/`ProgressBar label="In Progress"`),
  reforçando a mesma associação em vez de escolher uma cor nova. `open`
  continua amarelo (aguardando ação), `resolved` continua verde
  (concluído).
- **Nenhuma regra de UI muda além da cor** — `isResolved` (computed dos
  2 painéis, controla o botão "Marcar como resolvido"/o aviso de
  reabertura) e `shouldDisputeOnReply` continuam comparando só contra
  `'resolved'`: `open` e `in_progress` se comportam identicamente em
  tudo que não é a cor do `StatusDot` — não existe regra nova de negócio
  pedida além do status em si.
- **Achado real, corrigido junto**: nem `useTicketThread.ts` nem
  `useAdminTicketThread.ts` atualizavam `ticket.value` depois de uma
  resposta comum (`createTicketMessage`/`createAdminTicketMessage` só
  devolvem a `TicketMessage`, nunca o `Ticket`) — sem correção, o painel
  continuaria mostrando "Aberto" mesmo depois do backend já ter
  decidido `in_progress`, só atualizando num reload manual. `GET
  /tickets/{id}`/`GET /admin/tickets/{id}` (endpoints "show", já
  existiam no backend, nunca usados pelo front até agora — confirmados
  no OpenAPI real antes de usar) viraram `getTicket()`/`getAdminTicket()`
  em `supportApi.ts`, chamados logo depois de toda resposta comum bem-
  sucedida nos 2 composables, pra sincronizar o status sem esperar
  reload.
- Filtro de status (`TicketsView.vue`/`AdminTicketsView.vue`) ganhou a
  opção "Em andamento" entre "Aberto" e "Resolvido", mesma ordem da
  progressão real do workflow.
- **Bug real, reportado pelo usuário no mesmo dia com print** — os 4
  lugares que exibem o rótulo de status como texto (badge de status nas
  2 tabelas + nos 2 painéis de thread) montavam a chave i18n
  interpolando o valor CRU do backend
  (`` $t(`support.tickets.status.${status}`) ``), que chega em
  snake_case (`in_progress`) — mas o catálogo `pt-BR.ts` segue camelCase
  como todo o resto do arquivo (`inProgress`). `open`/`resolved` nunca
  expuseram esse descompasso (sem underscore, a interpolação crua já
  batia com a chave certa por coincidência) — só `in_progress` expôs,
  renderizando a chave crua "support.tickets.status.in_progress" na
  tela em vez de "Em andamento". **Corrigido centralizado**:
  `ticketStatusLabelKey(status)` (`ticket.type.ts`, mesmo padrão de
  `ticketStatusColor` — tabela de lookup `Record<TicketStatus, string>`,
  nunca template string) substituiu a interpolação crua nos 4 lugares.
  Teste novo (`tests/modules/support/types/ticket.type.test.ts`) trava
  os 2 ângulos do bug: toda chave devolvida existe de verdade no
  catálogo `pt-BR.ts` (percorrendo o objeto pelo caminho da chave, não
  só checando que a função devolve uma string qualquer) e
  `in_progress` nunca é devolvido cru.
- **Verificação**: typecheck, ESLint, suíte completa (**392 testes**,
  sem regressão) e build de produção, todos limpos. Mesma limitação de
  navegador real desta sessão — o fluxo (admin responde um chamado
  `open`, ponto vira indigo/"Em andamento" sem reload pro admin, usuário
  reabre a mesma thread depois e também vê o novo status, filtro por
  "Em andamento" funcionando nas 2 listagens, rótulo correto nos 4
  lugares depois do fix) fica pendente de confirmação manual do
  usuário.
