# Plano de Implementação — Frontend

Ordem de implementação do `orbita.frontend`, por fase. Cada fase referencia o
Bounded Context correspondente do backend (já 100% implementado e documentado
em `orbita.api/docs/api/`) e lista rotas, composables/services e telas
esperados, seguindo as convenções de `docs/infra/convencoes-frontend-infra.md`.

Este documento é atualizado conforme cada fase avança — status real, não
aspiracional. Se uma fase divergir do que está aqui (ex.: backend não tem o
endpoint necessário), a divergência fica registrada na própria fase, não
escondida.

---

## Fase 0 — Infra core (concluída)

Base que todo módulo depende: cliente HTTP, tipos, store de sessão,
roteamento + guards, i18n, estilos globais, primeiros átomos de UI.

**Entregue:**
- `core/api/client.ts` — instância axios única, injeção de `X-XSRF-TOKEN`,
  evento `orbita:unauthorized` num 401, `ensureCsrfCookie()` (Sanctum SPA).
- `shared/types/api.ts` (`ApiResponse<T>`, `Paginated<T>`, `ApiError`) +
  `shared/services/parseApiError.ts`.
- `core/store/useAuthStore.ts` (Pinia) — sessão (`user`, `requiresSubscription`).
- `core/router/` (`index.ts` + `guards.ts`) — guard central de
  `requiresAuth`/`roles`, tipagem de `RouteMeta`.
- `core/i18n/` + `shared/composables/useApiMessage.ts` (testado) — resolução
  de `ApiMessageKey`/`NotificationMessageKey` → texto pt-BR ou texto livre.
- `core/styles/` (`_variables`, `_mixins`, `_reset`, `main.scss`).
- `shared/components/ui/{Button,Icon,Input}.vue` — primeiros átomos.
- `src/core/api/schema.d.ts` gerado a partir do OpenAPI real do backend local
  (`npm run generate:api-types`).
- `main.ts` totalmente cabeado (Pinia, router, i18n, estilos globais,
  `app.config.errorHandler`, listener do evento de 401).
- Views placeholder (`modules/identity/views/{Login,Register}View.vue`,
  `shared/views/{Home,Forbidden,NotFound}View.vue`) só para exercitar
  roteamento/guards de ponta a ponta — **substituídas de verdade na Fase 1**.

**Verificado:** `typecheck`, `lint`, `check:ci`, `test:run` e `build`
(incluindo o service worker do PWA) rodando limpos; navegação real
confirmada em browser headless (`/` → redireciona pra `/login` via guard,
`/register` e 404 renderizam, zero erro de console).

**Correções feitas durante a revisão desta fase** (registro, não repetir):
- `App.vue` não tinha `<RouterView />` no template — o router estava
  instalado mas nada era montado (tela preta sem nenhum erro, já que não é
  um erro, é ausência de outlet). Corrigido.
- Rotas `/registrar` e `/proibido` estavam em português — corrigidas pra
  `/register` e `/forbidden` (rota é código, seção "Todo código é em
  inglês" do `CLAUDE.md` raiz).

---

## Fase 0.5 — Design System (concluída)

Inserida entre a Fase 0 e a Fase 1 a pedido explícito: nenhuma tela nova
deveria nascer sem uma fonte de verdade visual — os tokens de
`docs/design/tokens/` (export do Figma) já existiam no repo sem terem sido
usados ainda.

**Decisões tomadas com o usuário** (paleta/fonte/densidade — genuína
decisão de marca, não presumida): paleta **SnowUI** (preto como ação
primária, acentos pastel), fonte **Inter**, densidade **Standard**
(espaçamento/tamanho/raio).

**Entregue:**
- `docs/design/design-system.md` — documento completo (cor, tipografia,
  espaçamento, raio, componentes, do's/don'ts, gaps conhecidos), gerado a
  partir de `docs/design/tokens/`.
- `core/styles/_tokens.scss` — custom properties CSS reais (`:root` claro +
  `[data-theme='dark']`), importado uma única vez por `main.scss`.
- `core/styles/_variables.scss` reescrito — só aliases `$nome: var(--x)`,
  sem nenhuma regra CSS própria (ver "correção" abaixo pro motivo).
- `@fontsource-variable/inter` instalado (fonte auto-hospedada, PWA-safe) e
  importado em `main.ts`.
- `Button.vue`/`Input.vue` e as 5 views placeholder da Fase 0 migradas pro
  tokens novos.
- `docs/infra/convencoes-frontend-infra.md` (as duas cópias) e `CLAUDE.md`
  atualizados declarando o design system obrigatório.

**Correções feitas durante a implementação** (registro, não repetir):
- Primeira versão de `_variables.scss` misturava `:root { --x: ... }` (CSS
  de verdade) com os aliases `$nome: var(--x)` no mesmo arquivo — como
  componente nenhum `@use`va `_variables.scss`, cada `.vue` duplicava o
  bloco `:root` inteiro no seu próprio CSS compilado (cada SFC é uma
  unidade de compilação Sass separada). Sintoma real visto no `build`: CSS
  de uma view placeholder saltou de ~0.2kB pra ~2.4kB. Corrigido separando
  em `_tokens.scss` (CSS real, só em `main.scss`) e `_variables.scss` (só
  aliases, sem CSS próprio, livre pra `@use` em qualquer lugar).
- `@fontsource-variable/inter` registra a família como `"Inter Variable"`,
  não `"Inter"` — `--font-family-base` apontava pro nome errado e a fonte
  nunca carregava de verdade (fallback silencioso pro `system-ui`, sem
  nenhum erro). Só pego verificando `document.fonts` num browser real, não
  visualmente. Corrigido.

**Known gap explícito** (documentado em detalhe em
`docs/design/design-system.md`, seção "Known Gaps"): tokens do modo escuro
(`SnowUI-Dark`) já estão cabeados em `[data-theme='dark']`, mas não existe
nenhum composable/toggle de tema ainda — ativar isso é feature nova, não
implementá-la a partir só da doc.

---

## Fase 0.6 — Ícones (concluída)

Conjunto de ícones do design system, gerado a partir de dois exports do
Figma: `docs/icons-regular/` (1 tom) e `docs/icons-duotone/` (2 tons —
mesma cor em opacidades diferentes, nunca duas cores).

**Entregue:**
- `scripts/generate-icons.mjs` + `npm run generate:icons` — regenera
  `src/shared/components/icons/{regular,duotone}.generated.ts` (1248
  ícones cada) a partir dos SVGs.
- `shared/components/icons/createIcon.ts` — fábrica de componente (mesmo
  padrão usado internamente por `@lucide/vue`), `fill` sempre trocado por
  `currentColor` no render.
- 19 arquivos excluídos da geração: banners de categoria do Figma
  exportados por engano (texto renderizado como path — `Arrows`, `Brands`,
  `Header`, `Time`... — confirmado por diff entre as duas pastas + viewBox
  incompatível tipo "0 0 3224 88").

**Bug real pego durante a implementação** (registro, não repetir): um
primeiro teste de bundle mostrou que importar um ícone por namespace
(`import { IconsRegular } from '.../icons'` + `IconsRegular.Check`) infla
o chunk de ~1kB pra ~2,4MB — o bundler não consegue eliminar os outros
1247 ícones ao acessar propriedade de um objeto namespace, mesmo com
`/* @__PURE__ */` em cada `createIcon(...)`. Corrigido removendo a
reexportação por namespace de `shared/components/icons/index.ts` de
propósito — import tem que ser sempre direto do módulo gerado
(`import { Check } from '.../icons/regular.generated'`). Medido com
`npm run build` antes/depois da correção, não só inferido.

### Extensão — terceiro conjunto `docs/icons-snow-ui/` (concluída)

101 ícones do próprio kit SnowUI, estruturalmente diferentes dos dois
primeiros (misturam ícone de conteúdo genérico com swatch de estado de
controle — `Checkbox-N`/`Toggle-N`/`Radio-N`, cada número é um estado
visual do mesmo controle, não um ícone novo). Gerados como ícones normais
(nenhum é texto — mesma régua de inclusão da Fase 0.6 original), mas
documentados em `docs/design/design-system.md` como referência de estado
de UI, não conteúdo genérico solto.

**3 bugs reais pegos durante esta extensão** (registro, não repetir):
1. `docs/icons-regular/`/`docs/icons-duotone/` **já não existiam mais em
   disco** (geradas e removidas depois, ficou só o `.generated.ts`) — o
   script quebrava com `ENOENT` ao tentar reler pra regenerar os três de
   uma vez. Corrigido: `generateModule` agora checa `existsSync` e pula com
   aviso, mantendo o `.generated.ts` já existente, em vez de travar a
   geração inteira do que ainda está disponível.
2. `Checkbox-N`/`Toggle-N`/`Radio-N` usam `fill="white"` literal (cutout do
   estado marcado) e `Radio-1`/`Radio-4` usam `<circle>` em vez de
   `<path>` — o gerador anterior (i) sempre trocava `fill` por
   `currentColor` incondicionalmente (quebraria o cutout branco) e (ii) só
   extraía `<path>` (perderia o círculo de fundo do radio). Corrigido:
   `createIcon`/o gerador agora trabalham com tuplas `[tag, attrs]`
   genéricas (`path` ou `circle`), e só a cor placeholder `#1C1C1C`
   vira `currentColor` — qualquer outra cor literal do SVG de origem é
   preservada. **Efeito colateral**: isso mudou o formato de dado que
   `regular.generated.ts`/`duotone.generated.ts` guardam — como a fonte
   desses dois já não existia mais (achado 1), migrei o dado já gerado
   pro formato novo com um script pontual (envolver cada entrada existente
   em `["path", {...}]`), sem precisar re-derivar dos SVGs.
3. `Loading-1.svg` tinha um atributo `data-figma-gradient-fill` com um
   JSON gigante (metadado de um gradiente cônico que o Figma não exportou
   como gradiente SVG de verdade) — o extrator de atributo antigo não
   distinguia isso de um atributo válido e vazava o JSON inteiro pro
   arquivo gerado. Corrigido filtrando qualquer atributo `data-figma-*`.
   Achado relacionado: o mesmo ícone tinha o `<path>` visível duplicado
   dentro de um `<defs><clipPath>` (definição de recorte, nunca forma
   visível) — corrigido removendo o conteúdo de `<defs>` antes de
   extrair, pra não desenhar a mesma silhueta duas vezes por engano.

Todos os três achados foram confirmados visualmente (ícone renderizado num
browser real, não só inferido pelo código) antes de considerar a extensão
concluída.

---

## Fase 1 — Identity (concluída)

Cadastro, login, sessão. Bloqueia todas as fases seguintes (tudo exige
usuário autenticado).

**Login/cadastro/recuperação de senha e o guard de auth, implementados em
2026-08-28** — pedido direto do usuário ("vamos iniciar a fase 1"), com
capturas de referência de estrutura (outro produto, "pegue como
referência só a estrutura") + "ative ele" (o guard de rota, que tinha
ficado desligado desde o CRUD de Produtos da Fase 3).

**Entregue:**
- `modules/identity/services/identityApi.ts` — `login`, `register`,
  `requestPasswordReset`, `resetPassword`, `fetchCurrentUser` (`GET
  /auth/me`, usado só pro bootstrap de sessão), `buildSsoRedirectUrl`
  (monta a URL de `GET /auth/sso/{provider}/redirect`, navegação de
  página inteira via `window.location.href`, nunca uma chamada axios).
  `login()` absorve uma particularidade real da API: `login.store` (402)
  devolve o mesmo `LoginResultResource` do 200 — credenciais corretas,
  sessão criada, só sem assinatura ativa — tratado como sucesso, nunca
  propagado como erro pro composable.
- `modules/identity/schemas/{login,register,forgotPassword,resetPassword}FormSchema.ts`
  — fábricas (`t()`), mesma régua não-negociável de i18n do
  `productFormSchema.ts`. "Senha e confirmação precisam bater" via
  `.refine()`.
- `modules/identity/composables/use{Login,Register,ForgotPassword,ResetPassword}Form.ts`
  — mesmo padrão de `useProductForm.ts` (valida antes de chamar a API,
  popula `errors` com 422 também).
- `modules/identity/views/{Login,Register,ForgotPassword,ResetPassword}View.vue`
  + `core/layouts/AuthLayout.vue` (shell split-screen compartilhado pelas
  4 telas — marca + card à esquerda, painel decorativo à direita).
  **3 divergências deliberadas da referência**, com motivo real (contrato
  da API, não gosto pessoal): sem checkbox "Remember me" (`LoginRequest`
  não aceita esse parâmetro — mesma régua de "sem botão sem ação" do
  `ListToolbar`); SSO é Google + Microsoft, não Google + Apple
  (`SSO_ACCOUNT.provider` só aceita os dois primeiros); "Redefinir senha"
  é formulário de nova senha via link de e-mail (`?email=&token=`), não
  um código digitado — `ResetPasswordRequest` usa `token` de link
  (Laravel padrão), igual já documentado em `jornada-usuario.mmd`
  ("define nova senha via link recebido").
- `shared/components/ui/Input.vue` ganhou `iconBefore` (ícone fixo à
  esquerda) e revelar/ocultar senha automático quando `type="password"` —
  primeiro consumidor real desses dois recursos.
- **Guard de auth ativado** (`core/router/index.ts`,
  `meta.requiresAuth: true` no `AppLayout` pai — cobre `home`/`showcase`/
  `products` por herança de `meta`) + **bootstrap de sessão**
  (`core/router/guards.ts`): como a store de auth (Pinia) não persiste
  entre reloads mas o cookie httpOnly do Sanctum sim, o guard chama `GET
  /auth/me` uma única vez por carregamento do app antes da primeira
  decisão de navegação — sem isso, todo F5 derrubaria um usuário real pro
  login. `requiresGuest` novo (nas 4 rotas de Identity) faz o inverso:
  usuário já logado que abre `/login` é redirecionado pro dashboard.
  Login honra `?redirect=` (gerado pelo guard ao bloquear uma rota
  protegida) — devolve o usuário pra rota que ele tentou acessar, não
  sempre pro dashboard; só aceita caminho relativo, nunca uma URL
  absoluta da query string (evita redirect aberto).

**Bug real corrigido em 2026-08-30, reportado pelo usuário**: um usuário
mandado pra `/choose-plan` (sem assinatura ou com e-mail não verificado)
conseguia editar a URL pra `/` e cair direto no dashboard — nada além do
redirect logo após cadastro/login checava isso, o guard só sabia de
`requiresAuth`. Corrigido em `core/router/guards.ts`: além de
`requiresAuth`/`requiresGuest`/`roles`, toda rota `requiresAuth` (exceto
as marcadas `skipOnboardingChecks: true` — `verify-email`, `choose-plan`,
`billing-success`/`pending`/`failure`, `account`, que SÃO esse fluxo ou
não podem ficar presas atrás dele) agora também exige
`authStore.user.emailVerifiedAt` preenchido e `!authStore.requiresSubscription`.
`admin_master` fica de fora dos dois checks (conta de admin não é
assinante). Verificado em Playwright: usuário sem assinatura editando a
URL pra `/` continua preso em `/choose-plan`; usuário com assinatura
ativa acessa `/` normalmente; e-mail não verificado vai pra
`/verify-email`; `admin_master` nunca é barrado.

**Simplificado em 2026-08-31** (histórico, mantido por contexto): a
implementação original desse fix batia em `GET /subscriptions` e
replicava `UserSubscriptionStatus::isActive()` (backend) client-side
(`modules/billing/composables/useSubscriptionStatus.ts`, com cache por
`user.id` pra não repetir a chamada a cada navegação) — não existia
campo pronto tipo `LoginResultResource.requires_subscription` fora do
momento do login. No dia seguinte, `ShowAuthenticatedUserAction`
(backend) passou a devolver esse MESMO cálculo em `GET /auth/me`
(`userProfile.show` retorna `LoginResultResource` agora, não
`UserResource` puro — motivo real, comentário do backend: login via SSO
nunca devolve JSON, só redireciona, então `/me` é o único jeito do front
saber se um usuário logado via SSO precisa assinar). Isso fechou a
reimplementação client-side — `useSubscriptionStatus.ts` foi removido,
`bootstrapSession()` (`guards.ts`) usa `result.requires_subscription`
direto, sem chamada extra nem cache manual. `fetchCurrentUser()`
(`identityApi.ts`) e `useVerifyEmail.checkVerification()` atualizados pro
novo shape. Reverificado em Playwright com o novo formato de resposta —
os 4 cenários (verificado+assinante, requer assinatura, e-mail não
verificado, admin_master) continuam corretos.

**Gap de backend resolvido em 2026-08-30** (histórico, mantido por
contexto): o endpoint de logout não existia em `orbita.api` até
2026-08-27 (reportado à sessão do backend na época). Implementado desde
então (`POST /v1/auth/logout`, `LogoutController`/`LogoutUserAction`,
`auth:sanctum`) — regenerado `schema.d.ts` (`npm run generate:api-types`)
e adicionado `logout()` em `identityApi.ts` + `useLogout()`
(`modules/identity/composables/`, chamado a partir do topo do
`AppSidebar` — `core/layouts/AppSidebarContent.vue`, ao lado do
avatar/nome do usuário logado). `useLogout()` sempre limpa
`useAuthStore()` e redireciona pro login mesmo se a chamada de rede
falhar (sessão já invalidada no servidor não deve travar o usuário
"logado" na tela). `core/layouts` importando de `modules/identity`
segue a mesma exceção já usada em `core/router/guards.ts`
(`fetchCurrentUser`) — sessão/Identity é infraestrutura cross-cutting,
não um módulo de negócio comum.

**`/account` implementado em 2026-08-31** (pedido direto do usuário,
"vamos finalizar a fase 01" — última pendência real da fase) — escopo
direto de `mapeamento-cruds-perfil.md` (backend), nada além disso:
- **Perfil** (P3): `modules/identity/schemas/updateProfileFormSchema.ts`
  (test-first) + `composables/useUpdateProfileForm.ts` — formulário
  sempre pré-preenchido com `authStore.user`, senha sempre em branco
  (nunca mostra/adivinha a atual). `password`/`password_confirmation` só
  entram no payload (`PATCH /auth/me`) quando o usuário realmente digitou
  algo — mandar string vazia falharia a validação de tamanho mínimo do
  backend. Trocar o e-mail zera `email_verified_at` no backend
  (`UpdateUserProfileAction`) — o guard já existente manda pro
  `verify-email` sozinho na próxima navegação, nada especial a fazer na
  tela por causa disso.
- **Contas conectadas** (P6/P7): `composables/useSsoAccounts.ts` —
  lista (`GET /auth/me/sso-accounts`) e desconecta
  (`DELETE /auth/me/sso-accounts/{id}`) provedores SSO. Backend recusa
  desconectar o único jeito de acesso (`errorMessageCannotDisconnectLastAccessMethod`)
  — o front não tenta prever isso (não sabe se o usuário tem senha), só
  mostra o erro que vier.
- **Excluir conta** (P5): `composables/useDeleteAccount.ts` +
  `components/DeleteAccountModal.vue` — `password` fica sempre opcional
  na UI (`UserResource` não expõe se a conta tem senha cadastrada), manda
  o que foi digitado e deixa `DeleteUserAccountAction` (backend) decidir;
  erro de senha incorreta vira `errorMessageIncorrectPassword`. Sucesso
  limpa a store e redireciona pro login (soft-delete/anonimização no
  backend, nunca hard delete).
- Rota `account` entra como FILHA de `AppLayout` (`identityAppRoutes`,
  `modules/identity/routes.ts`) — diferente das outras rotas de Identity,
  é tela do app principal, precisa do chrome de sidebar/header. Descoberta
  via clique no bloco de usuário (avatar+nome) no topo do
  `AppSidebar` (`core/layouts/AppSidebarContent.vue`), que virou
  `RouterLink` pra cá. `skipOnboardingChecks: true` de propósito — gestão
  da própria conta (inclusive excluir) não pode ficar bloqueada atrás do
  gate de e-mail verificado/assinatura, quem quer sair da plataforma
  precisa conseguir chegar aqui de qualquer jeito.
- `errorMessageIncorrectPassword`/`errorMessageCannotDisconnectLastAccessMethod`
  — novas entradas no registro de `ApiMessageKey` (`pt-BR.ts`).
- Verificado em Playwright: navegação pelo sidebar, formulário
  pré-preenchido, atualização de nome (payload sem `password` quando em
  branco), desconexão de SSO removendo da lista, exclusão de conta
  encerrando a sessão e voltando pro login.

**Mock do Catalog trocado pelo serviço real em 2026-08-31** (dívida
técnica explicitamente marcada como bloqueada nesta fase — comentário
original: "trocar de volta quando a Fase 1 existir"): `useProductList.ts`/
`useProductForm.ts`/`ProductsView.vue` voltaram a importar de
`../services/catalogApi` (real) em vez de `catalogApi.mock.ts`, que foi
removido. Verificado em Playwright interceptando `GET /v1/products` —
lista renderiza com dado vindo do endpoint real.

**`VerifyEmailView` implementado em 2026-08-30** (pedido direto do
usuário — "pequeno gap", cadastro normal precisa confirmar e-mail antes
de assinar). `useRegisterForm.ts` manda pra `verify-email` em vez de
direto pra `choose-plan` (cadastro via SSO nunca passa por essa tela —
`createVerified()`, backend, já vem verificado pelo provider). Tela
mostra o e-mail cadastrado, botão "Reenviar" (`POST /auth/email/verification-notification`)
e "Já verifiquei, continuar" (`useVerifyEmail.checkVerification`, refaz
`GET /auth/me` e só avança pra `choose-plan` se `email_verified_at` vier
preenchido). O link do e-mail em si não volta pra essa tela — o backend
(`EmailVerificationController::verify`, achado real: SEM `auth:sanctum`,
resolve o usuário pelo `{id}` assinado na própria URL, não pela sessão)
redireciona direto pra `/choose-plan` no sucesso, ou
`/login?error=email_verification_failed` na falha — `LoginView.vue`
ganhou tratamento genérico de `?error=` na query (toast + limpa o
parâmetro), cobrindo esse caso e o `sso_failed` do `SsoCallbackView` (que
também nunca tinha sido tratado, gap pré-existente fechado de brinde).
Sem polling automático de verificação — foi decisão deliberada não
adiantar isso, o botão manual já cobre o pedido.

**`SsoCallbackView` implementado em 2026-08-30** (pedido direto do
usuário, com exemplo real de URL do Google) — achado real, confirmado
lendo `../backend/.env`: `GOOGLE_REDIRECT_URI` aponta pro FRONTEND
(`http://localhost:5173/v1/auth/sso/google/callback`), não pro backend
— só o domínio do front está autorizado no console do Google neste
ambiente. `SsoCallbackView.vue` (rota `sso-callback`, path EXATO
`/v1/auth/sso/:provider/callback` — ditado pelo provider, não convenção
nossa) existe só pra repassar a query string (`code`/`state`/...) pro
endpoint real do backend (`buildSsoCallbackUrl()`, `identityApi.ts`) via
navegação de página inteira (`window.location.href`, nunca fetch/axios —
o backend valida `state` contra a sessão do passo `/redirect` original,
precisa de uma navegação top-level de verdade). `error` na query (usuário
cancelou o consentimento) mostra uma tela de erro em vez de relayar.
Verificado com Playwright interceptando a URL do backend: a query string
completa (incluindo `iss`/`scope`/`authuser`/`prompt`, do exemplo real
mandado pelo usuário) chega intacta.

**Gap fechado de brinde em 2026-08-30** (histórico, mantido por
contexto): o parágrafo abaixo descrevia um gap real na época — o redirect
final do `SsoController::callback` (backend) não carrega nenhum sinal de
"usuário novo, precisa escolher plano", sempre `redirect(config('app.frontend_url'))`
sem path/query, então um cadastro novo via SSO caía direto no dashboard.
Isso deixou de ser um problema quando o guard de assinatura ativa foi
implementado no mesmo dia (ver "Bug real corrigido" acima): a rota `/`
agora SEMPRE confere `authStore.requiresSubscription` antes de renderizar
(hoje vindo direto de `GET /auth/me`, ver "Simplificado em 2026-08-31"),
pra QUALQUER caminho de chegada (formulário ou SSO) — um cadastro novo
via SSO pousa em `/`, o guard vê que não tem assinatura nenhuma e
redireciona sozinho pra `/choose-plan`, sem precisar de nenhum sinal
extra do backend além do que `/me` já passou a expor. Verificado em
Playwright: usuário SSO novo (e-mail verificado,
zero assinaturas) pousando em `/` termina em `/choose-plan`.

---

## Navegação da sidebar (transversal, 2026-08-31)

Pedido direto do usuário, antes de fechar a Fase 2 ("organização do
menu, hoje tá cheio de dado mockado") — 3 pontos, todos em
`core/layouts/`, não específicos de nenhuma fase de negócio:

- **Menu real, planejado pra todos os módulos**:
  `core/layouts/config/navigation.ts` reescrito — grupos de exemplo do
  Figma trocados pelos Bounded Contexts reais (Catálogo, Marketplaces,
  Assinatura, Administração), com `NavGroup.roles` filtrando o grupo
  Administração só pra `admin_master`. A maioria dos itens ainda não tem
  `to` (backend já pronto — `pricing.php`/`platform.php`/`billing.php`/
  `identity.php` admin — telas do frontend ainda não construídas,
  Fases 4/5/6) — detalhe completo em `docs/design/design-system.md`
  seção Components → AppSidebar.
- **"Recentes" rastreia navegação real** — `useAppShell().recordVisit()`
  via `router.afterEach`, até 5 páginas, persistido em `localStorage`.
  Test-first.
- **"Favoritos" pronto pro backend, endpoint ainda não existe** —
  mensagem enviada pra sessão `backend-c5` pedindo `POST`/`DELETE` de
  favoritos + inclusão em `GET /auth/me`. Frontend já lê
  `authStore.user.favorites` via cast temporário
  (`modules/identity/types/user.type.ts`); lista fica vazia até o
  backend responder, sem affordance de "adicionar" ainda (evita botão
  morto).

**Ajustes pontuais, mesmo dia**: grupo "Dashboards" tinha ficado de fora
do rewrite acima (item "Padrão" → `home`, reportado pelo usuário); e um
bug real foi corrigido no destaque de item ativo — o link "Padrão"
(`to: { name: 'home' }`, path `/`) ficava marcado como ativo em qualquer
rota, porque `/` é ancestral de todo path do app e o CSS estilizava
`.router-link-active` (não-exato). Corrigido pra
`.router-link-exact-active` em `AppSidebarNavItem.vue` — detalhe completo
em `docs/design/design-system.md` seção Components → AppSidebar.

**Favoritos concluído, mesmo dia** — sessão `backend-c5` implementou
`POST /favorites`/`DELETE /favorites/{id}` + `favorites` em `/auth/me`/
`/auth/login`. Regenerado `schema.d.ts` e ligado o botão de estrela do
`AppHeader` (até então casca inerte) pra favoritar/desfavoritar a página
atual — remover também dá pra fazer direto na lista da sidebar. Corrigido
de quebra um bug real na leitura (o mapper temporário lia o campo do
lugar errado — `favorites` é irmão de `user` na resposta, nunca aninhado
dentro dele — então a lista nunca teria populado mesmo com o backend
pronto). `useFavorites`/`favoriteApi` ficaram em `core/layouts/`, não em
`modules/platform/` (onde `USER_FAVORITE` mora no backend) — é
conveniência de navegação da sidebar, não feature de negócio, e módulo
nunca importa de outro módulo. Detalhe completo em
`docs/design/design-system.md` seção Components → AppHeader.

---

## Fase 2 — Billing

Planos e assinatura — obrigatório antes de liberar o resto do sistema
(jornada: `ChoosePlan → Payment → Dashboard`).

**Listagem de plano + assinatura implementadas em 2026-08-30** — pedido
direto do usuário, com referência visual (mockup de outro produto,
"se inspire no modelo"). `/choose-plan` deixou de ser casca: passou a
listar planos reais e a criar a assinatura de verdade. Duas divergências
deliberadas da referência: sem seletor de marketplace nem plano "combo"
limitado a canal — `PLAN` não tem esse conceito
(`docs/negocio/contexto-plataforma-precificacao.md` seção 2.2).

**Entregue:**
- `modules/billing/types/plan.type.ts` — `Plan` (camelCase, em cima do
  `PlanResource` gerado) + `toPlan()`.
- `modules/billing/services/billingApi.ts` — `listPlans()` (`GET /plans`,
  pública, só planos ativos) e `subscribeToPlan()` (`POST /subscriptions`,
  cria assinatura + preferência de checkout no Mercado Pago na mesma
  chamada, devolve `checkout_url`).
- `modules/billing/composables/usePlanPricing.ts` — `getMonthlyEquivalent`/
  `getYearlySavings`/`findMostEconomicalPlan`, regra de negócio real
  (compara plano anual contra o mensal mais barato da mesma lista),
  test-first (`tests/modules/billing/composables/usePlanPricing.test.ts`).
- `modules/billing/composables/useChoosePlan.ts` — fetch simples da lista
  (sem paginação/busca, mostra todos os planos ativos de uma vez).
- `modules/billing/composables/useSubscribeToPlan.ts` — orquestra
  `POST /subscriptions` e o único desvio real de negócio no caminho:
  `errorMessageDocumentRequired` (usuário sem CPF/CNPJ) abre
  `DocumentPromptModal` em vez de falhar, reenvia a mesma assinatura
  assim que confirmado. Sucesso é sempre `window.location.href` pro
  `checkout_url` (Checkout Pro do Mercado Pago, hospedado — nunca
  renderizamos QR code/formulário de cartão nós mesmos).
- `modules/billing/schemas/documentFormSchema.ts` +
  `composables/useDocumentPromptForm.ts` — valida só a CONTAGEM de
  dígitos (11/14), test-first; checksum real fica pro 422 do backend.
- `modules/billing/components/blocks/PlanCard.vue` e
  `DocumentPromptModal.vue` — ver `docs/design/design-system.md` seção
  Components pro detalhe de cada um (incluindo por que `PlanCard` fica em
  `modules/billing/` e não `shared/` por enquanto — sem segundo
  consumidor real ainda).
- `modules/billing/views/ChoosePlanView.vue` — reescrita da casca:
  heading + selos de confiança + grid de `PlanCard`.
- `modules/billing/views/BillingCheckoutResultView.vue` + 3 rotas
  (`/billing/success`/`/pending`/`/failure`) — `back_urls` REAIS do
  Checkout Pro (`MercadoPagoGateway::createCheckout`, backend); sem essa
  view, o retorno do pagamento caía num 404. Mesmo componente pras 3,
  variando só `route.meta.checkoutResult`.
- `errorMessageDocumentRequired`/`errorMessageEmailNotVerified`/
  `errorMessageSubscriptionAlreadyActive` — primeiras entradas reais do
  registro de `ApiMessageKey` em `pt-BR.ts` (`useApiMessage.resolveMessage()`
  existia desde a Fase 1 mas nunca tinha uma chave real cadastrada; um
  erro de backend sem entrada aqui ainda cai no texto cru da chave,
  gap sistêmico que continua existindo pras chaves não cadastradas).

**Pendências reais desta fase** (fora do escopo do pedido "listagem de
planos"):
- Troca de plano (`PATCH /subscriptions/{id}`, upgrade/downgrade com
  prorata), cancelamento (`DELETE /subscriptions/{id}`), histórico de
  transações (`GET /transactions`) — endpoints já existem no backend,
  telas ainda não construídas.
- Polling/webhook-driven refresh de status em tempo real
  (`useSubscriptionStatus`) — hoje o webhook confirma o pagamento de
  forma assíncrona, mas nada na UI reflete isso automaticamente; usuário
  só vê o status atualizado num próximo carregamento de página.
- `EmailNotVerifiedException` — **resolvido em 2026-08-30**: cadastro
  normal agora passa por `/verify-email` (Fase 1) antes de chegar em
  `choose-plan`, então na prática esse erro só apareceria se o usuário
  navegasse direto pra `/choose-plan` sem passar pela tela de verificação
  — caso residual, ainda cai no toast genérico (`errorMessageEmailNotVerified`).
- Gap de SSO + `choose-plan` já registrado na Fase 1 continua aberto:
  cadastro novo via SSO não é mandado pra `/choose-plan` (falta sinal do
  backend nesse retorno específico).

---

## Fase 3 — Catalog

Cadastro de produto — primeira tela "de trabalho" do vendedor.

**Parcialmente concluída, fora de ordem, 2026-08-28** — pedido direto do
usuário ("vamos montar o CRUD", segunda página de exemplo depois do
dashboard da Fase 0.5/Home), grounded numa captura de referência de uma
listagem genérica ("Order List"). Implementado **antes** das Fases 1/2
(Identity/Billing) por decisão explícita do usuário — a rota `/products`
já existe e funciona de ponta a ponta contra o backend real. **Guard de
autenticação ativado depois, mesmo dia** (Fase 1, `meta.requiresAuth:
true` no `AppLayout` pai) — `/products` agora exige sessão real como
qualquer outra rota do shell. **Mock trocado pelo serviço real em
2026-08-31** (ver Fase 1) — `catalogApi.mock.ts` removido, `/products`
fala com o backend de verdade de ponta a ponta agora. Segue sem
`usePlanLimit`/checagem de `max_products` (depende de Billing, Fase 2,
não implementada ainda).

**Entregue:**
- `modules/catalog/services/catalogApi.ts` — `listProducts`/
  `createProduct`/`updateProduct`/`deleteProduct`, chamando
  `GET/POST/PATCH/DELETE /products` de verdade (`core/api/schema.d.ts`
  já tinha `ProductResource`/`CreateProductRequest`/`UpdateProductRequest`
  reais, gerados do backend — Catalog já estava 100% implementado lá,
  só nunca consumido pelo frontend). **Não é placeholder** como o
  dashboard da Home — é o primeiro consumo real de API do projeto.
- `modules/catalog/types/product.type.ts` — `Product` (camelCase, em
  cima do `ProductResource` gerado, seção 6.1) + `toProduct()`.
- `modules/catalog/schemas/productFormSchema.ts` — `createProductFormSchema(t)`
  (fábrica, não schema pronto — mensagem de validação é texto de UI, regra
  de i18n não-negociável exige `t()`, que só existe dentro de um
  composable/componente, nunca no top-level do módulo). "Preço de venda ≥
  preço de compra" via `.refine()`, exatamente o exemplo canônico citado
  nesta seção. Test-first.
- `modules/catalog/composables/useProductList.ts` — usa o motor genérico
  novo `shared/composables/useResourceList.ts` (ver "Padrão de CRUD"
  abaixo); busca é por SKU exato (`filter[sku]`), não nome — a API real
  só tem esse filtro pra produto hoje, `Search` do toolbar reflete isso
  (`searchPlaceholder: "Buscar por SKU"`, não "Buscar produto"). Ordenação
  só nas 3 colunas que a API aceita (`name`/`full_sale_price`/`created_at`
  — `buildProductSortParam`, testado).
- `modules/catalog/composables/useProductForm.ts` — valida com o schema
  acima antes de chamar `catalogApi`, popula `errors` com o que vier do
  422 também (nunca só confia no cliente).
- `modules/catalog/components/ProductForm.vue` — formulário único de
  criação E edição (pedido explícito do usuário), renderizado dentro de
  `Drawer.vue` lateral direito por `ProductsView.vue`.
- `modules/catalog/views/ProductsView.vue` — header (breadcrumb + título)
  → `ListToolbar` (botão "Novo produto" com texto explícito, busca) →
  `DataTable` (ações "Editar"/"Excluir" com ÍCONE + TEXTO visível na
  própria linha, não escondidas atrás de um menu — pedido explícito do
  usuário: "temos que colocar o texto dos botões para ficar explícito")
  → `PaginationNav`. Banner de erro (`role="alert"`) quando `list.error`
  existe — nunca confunde "sem produto cadastrado" com "falha ao carregar".
  `AppFooter` deixou de ser page-local nesta mesma rodada (2026-08-28) —
  movido pra `AppLayout.vue`, montado uma vez como chrome persistente do
  shell (`position: sticky; bottom: 0`, espelhando o `AppHeader`), não
  mais algo que cada view precisa lembrar de incluir.
- `core/layouts/config/navigation.ts` ganhou o primeiro grupo/item de
  navegação REAL (`catalogGroup`, "Catálogo → Produtos") — todo o resto
  de `navGroups` continua sendo o exemplo de estrutura do Figma.

**Padrão de CRUD reutilizável, pedido explícito do usuário** ("vamos já
criar um padrão pra reutilizarmos nos cruds, tudo abstraído, todos os
composables envolvidos") — 3 composables genéricos novos em
`shared/composables/`, nenhum sabe de `Product`/domínio nenhum, todos
test-first:
- `useResourceList<T>` — paginação/busca/ordenação/loading/erro, recebe
  só uma função `fetchPage`. Sem debounce embutido de propósito (fica no
  composable específico, ex.: `useProductList`, via `refDebounced` do
  `@vueuse/core`).
- `useCrudDrawer<T>` — `isOpen`/`mode` (`create`/`edit`)/`editingRecord`,
  pro par Drawer+Form de qualquer CRUD.
- `useConfirmAction<T>` — `isOpen`/`target`, pro par
  `ConfirmDialog`+"excluir X" de qualquer CRUD; `confirm()` propaga erro
  do handler sem fechar o diálogo (permite tentar de novo).

Um CRUD novo (`Marketplaces conectados`, Fase 4) repete exatamente a
forma de `ProductsView.vue`, só troca `service`/`type`/`schema`/
`colunas`/`form` — ver `.ai/rules/crud-pattern.md`.

**Pendências reais desta fase** (não implementadas ainda, fora do escopo
do pedido "montar o CRUD de exemplo"):
- Rotas `/products/new`/`/products/:id/edit` dedicadas — o form atual só
  existe dentro do Drawer, nunca como página própria (decisão explícita
  do usuário: "renderizarão no modal lateral direito").
- `/products/:id/launches` (histórico de `PRODUCT_LAUNCH`) — não
  mencionado no pedido, não implementado.
- `usePlanLimit` — depende de `SUBSCRIPTION`/`PLAN` (Fase 2, Billing),
  que ainda não existe no frontend.
- ~~Guard de rota real (`requiresAuth`)~~ — **resolvido em 2026-08-28**,
  ver Fase 1 acima (`meta.requiresAuth: true` no `AppLayout` pai).

---

## Fase 4 — Pricing

Conexão com marketplace e vínculo produto↔marketplace. **Sem dashboard de
preço sugerido nesta fase** — ver gap abaixo.

**Rotas:** `/marketplaces` (conectados pelo usuário), `/marketplaces/connect`,
`/products/:id/marketplaces` (vínculo produto↔marketplace).

**Services:** `pricingApi.ts` — `listConnectedMarketplaces` (via
`USER_MARKETPLACE`), `connectMarketplace`, `disconnectMarketplace`,
`linkProductToMarketplace`, `unlinkProductFromMarketplace`.

**Composables:**
- `useMarketplaceConnection` — bloqueia conectar um marketplace já conectado
  como validação de UI (unique `(user_id, marketplace_id)`), não só espera o
  422.
- `useMarketplaceLimit` — mesmo padrão de `usePlanLimit` (Fase 3), agora pra
  `max_marketplaces`.
- `useProductMarketplaceLink` — lista só `USER_MARKETPLACE` ativos como
  opção de vínculo (nunca `MARKETPLACE` direto — regra não-negociável do
  `CLAUDE.md`).

**Gap de backend confirmado (bloqueia a tela de "preço sugerido"):**
`PricingCalculator`/`PriceRange`/`SuggestedPrice` existem na camada de
Domain do backend, testados isoladamente, mas **nunca foram conectados a
nenhuma rota**. `PRODUCT_MARKETPLACE` é vínculo puro (sem
`suggested_price`/`is_approximated` — migration
`2026_08_26_145617_remove_suggested_price_and_is_approximated_from_product_marketplaces_table`
confirma a remoção). A tela "Dashboard de precificação com preço sugerido
por canal" do diagrama de jornada **não é implementável no contrato de API
atual** — só dá pra construir o vínculo puro (conectar marketplace, linkar
produto). Revisitar esta fase quando o backend expuser o endpoint de
sugestão de preço.

**Admin (`role: admin_master`):** `/admin/marketplaces`,
`/admin/marketplaces/:id/pricing-rules` — CRUD de `Marketplace`/`PricingRule`,
guard de rota por `roles: ['admin_master']`.

---

## Fase 5 — Platform

Notificações, e (pro admin) configuração/auditoria.

**Rotas:** `/notifications` (lista + marcar lida), `/admin/audit-logs`,
`/admin/notifications/broadcast`.

**Services:** `platformApi.ts` — `listNotifications`, `markAsRead`,
`listAuditLogs` (admin), `broadcastNotification` (admin).

**Store:** `useNotificationStore` (Pinia) — contador de não lidas, exibido
globalmente no layout (badge no ícone de sino). Estado genuinamente global
(seção 5), diferente da lista paginada em si (fica no composable da tela).

**Composables:** `useNotificationFeed`, `useAuditLogFilters` (admin).

Toda mensagem de notificação passa por `useApiMessage` (Fase 0) — nunca um
`switch` manual mapeando tipo → texto.

---

## Fase 6 — Admin (usuários, impersonation)

Fecha o MVP: painel de administração de usuários, fora do namespace comum.

**Rotas:** `/admin/users`, `/admin/users/:id`, `/admin/users/:id/impersonate`
— todas com guard `roles: ['admin_master']`.

**Services:** `adminApi.ts` — `listUsers`, `getUser`, `updateUser`,
`impersonateUser`, `stopImpersonation` (`POST /auth/impersonation/stop`,
já existe no backend).

**Composables:** `useImpersonation` — troca de sessão pro usuário
impersonado e volta; precisa de aviso visual persistente ("você está
impersonando X") enquanto ativo — notificação de "início de impersonation"
(`NotificationType`) já existe no backend pra isso.

---

## Transversal (todas as fases)

- **Testes**: composable/service com lógica nasce do teste antes da
  implementação (seção 11.1) — TDD não é negociável nas fases acima, mesmo
  que o plano não repita isso fase a fase.
- **E2E crítico (Playwright)**, após a Fase 4 estar de pé: login → cadastro
  de produto → conecta marketplace → vincula produto ao marketplace. (Sem
  "vê preço sugerido" enquanto o gap da Fase 4 não for resolvido pelo
  backend.)
- **i18n**: catálogo `pt-BR` (`core/i18n/messages/pt-BR.ts`) cresce por
  fase, conforme cada módulo integra chaves reais de `ApiMessageKey`/
  `NotificationMessageKey` — não adiantar chave que a fase ainda não usa.
- **Design system**: novos átomos em `shared/components/ui/` sob demanda de
  cada fase (ex.: `Select`/`Modal` provavelmente entram na Fase 2, `Badge`
  na Fase 4/5) — nunca adiantados "por completude".

## Pendências de coordenação com o backend

| Item | Fase afetada | Status |
|---|---|---|
| `APP_URL`/`.env` real ainda aponta pro túnel ngrok de teste | Fase 1 (verificação de e-mail) | Reportado, não bloqueia infra |
| Sugestão de preço (`PricingCalculator`) nunca exposta em rota | Fase 4 | Sem rota — fase segue só com vínculo puro até existir |
