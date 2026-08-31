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

**Contrato quebrado e corrigido em 2026-08-31 — login via Google estava
GENUINAMENTE quebrado, não intermitente.** Achado pela sessão de backend:
o redirect final do fluxo antigo (`SsoController::callback` autenticava
direto e redirecionava pra raiz do `FRONTEND_URL`) forma a cadeia
"app → Google → backend → front, outra origem" — exatamente o padrão que
proteção anti-bounce-tracking de browser (Firefox Redirect Tracking
Protection, Safari ITP) existe pra quebrar: o cookie de sessão setado
nesse hop intermediário era descartado de forma CONSISTENTE. Corrigido
com um 2º hop: o backend agora redireciona pra
`{FRONTEND_URL}/sso/callback?token=...` (token opaco, 60s de validade,
uso único, `Cache::pull` atômico) em vez de autenticar direto — o front
troca esse token por sessão de verdade via um `POST /auth/sso/exchange`
comum (`fetch`/`axios`, não navegação de página), que roda numa origem
"parada" (fora de qualquer bounce), então o `Set-Cookie` funciona de
verdade.

- **`identityApi.ts`**: `exchangeSsoLoginToken(token)` — devolve o MESMO
  shape de `login()`/`fetchCurrentUser()` (`LoginResultResource`), sem
  precisar de uma segunda chamada a `/auth/me` depois.
- **`useSsoExchange.ts`** (novo composable) — mesmo critério de
  `useLoginForm.ts`: `requires_subscription: true` vai pra `choose-plan`,
  senão pro dashboard. Diferente do login manual, sem `?redirect=`
  (não sobrevive à ida-e-volta com o provider OAuth).
- **`SsoExchangeView.vue`** (novo, rota `sso-exchange`, path fixo
  `/sso/callback` — ditado pelo contrato do backend). `SsoCallbackView.vue`
  (`sso-callback`, `/v1/auth/sso/:provider/callback`) continua existindo
  tal como está — Google ainda navega pra lá, o backend ainda processa o
  código com o provider; só o que acontece DEPOIS mudou. Mesmo esqueleto
  visual de `SsoCallbackView.vue` (spinner/erro), reaproveitando as
  mesmas chaves `identity.ssoCallback.*` em vez de duplicar cópia
  idêntica.
- `errorMessageInvalidSsoLoginToken` cadastrada (token inexistente,
  expirado ou já usado).
- Tipos regenerados (`npm run generate:api-types`) — `sso.exchange`/
  `ExchangeSsoLoginTokenRequest` já vieram prontos do OpenAPI do backend
  (implementado e testado do lado de lá com a suíte completa, 579
  testes, simulando os 2 hops reais).
- **Verificado em browser real contra o backend local**, token
  fabricado via `Cache::put('sso-login-token:...', $userId, 60)`
  (tinker, mesmo mecanismo real): token válido → exchange → redirect
  correto (`choose-plan` pra usuário sem assinatura); reuso do MESMO
  token (single-use) → erro correto; token ausente/inválido → erro
  correto; sessão confirmada persistente via cookie (navegação +
  reload duro mantêm a mesma página, sem bounce pro login).

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

## Fase 2 — Billing (concluída)

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

**Troca de plano, cancelamento e histórico de transações concluídos em
2026-08-31** — pedido direto do usuário ("implemente tudo q falta pra
fase 02"), fechando as pendências que restavam desta fase:
- `modules/billing/types/subscription.type.ts`/`transaction.type.ts` —
  `Subscription`/`Transaction` (em cima de `SubscriptionResource`/
  `TransactionResource` gerados) + `toSubscription`/`toTransaction` +
  mapeamento status→cor pro `StatusDot` (`subscriptionStatusColor`/
  `transactionStatusColor`).
- `billingApi.ts` ganhou `getCurrentSubscription()` (`GET /subscriptions`,
  `per_page: 1` + `sort: -created_at` — modelo é "1 login = 1 assinatura",
  a lista na prática nunca tem mais que 1 item), `changeSubscriptionPlan()`
  (`PATCH`, mesmo formato de resposta de `subscribeToPlan` — abre um novo
  checkout REAL no Mercado Pago pelo valor prorata), `cancelSubscription()`
  (`DELETE`, nunca apaga a linha, só marca `cancel_at_period_end`) e
  `listTransactions()` (`GET /transactions`, paginado).
- `useSubscription.ts` (fetch + cancelar + trocar de plano, com
  `canCancelSubscription`/`canChangeToPlan` extraídas como funções puras
  test-first — mesma régua de `usePlanPricing.ts`) e
  `useTransactionList.ts` (wrapper de `useResourceList`, mesmo padrão de
  `useProductList.ts`, com `buildTransactionSortParam` testado).
- `MySubscriptionView.vue` ("Meu plano") — resumo da assinatura atual
  (plano/status/ciclo/datas) + cancelamento (com `ConfirmDialog`) + troca
  de plano reaproveitando `PlanCard.vue` (ganhou as props `isCurrent`/
  `ctaLabelOverride` novas) num grid dos demais planos. Sem
  `ConfirmDialog` antes de trocar de plano — mesma consistência do fluxo
  de assinatura original: clicar já redireciona pro checkout do Mercado
  Pago, que já é a confirmação (o usuário revisa o valor prorata lá antes
  de pagar).
- `TransactionsView.vue` ("Faturas") — mesmo padrão de `ProductsView.vue`
  (`DataTable`/`PaginationNav`), sem `ListToolbar`/criar/editar/excluir
  (transação é registro financeiro imutável, mesma regra já vale pro
  admin).
- `navigation.ts`: "Meu plano"/"Faturas" (grupo Assinatura) ganharam `to`
  reais, apontando pras 2 rotas novas (`billingAppRoutes`, filhas de
  `AppLayout`, mesmo padrão de `catalogRoutes`/`identityAppRoutes`).
- Verificado em browser real contra o backend local, com dado de
  verdade (assinatura ativa + 2 transações criadas via tinker): resumo
  do plano renderiza correto; cancelar mostra o aviso "Cancelamento
  agendado" e sobrevive a um reload; trocar de plano dispara o `PATCH`
  real e redireciona de fato pro Checkout Pro do Mercado Pago (sandbox,
  `pref_id` real na URL) — confirmado no banco que `pending_plan_id`
  ficou setado pro plano novo enquanto `plan_id` continua o antigo, exatamente
  como `ChangeSubscriptionPlanAction` documenta; tentar trocar de novo
  com uma troca já pendente mostra o toast `errorMessagePlanChangeAlreadyPending`
  sem navegar pra lugar nenhum; tabela de Faturas mostra as 2 transações
  com `StatusDot` na cor certa (verde/amarelo) e valor formatado.

**Gap do `pending_plan_id` fechado em 2026-08-31** — pedido direto do
usuário ("vamos iniciar pelo gap 2"), mensagem pra sessão `backend-c5`
pedindo o campo em `SubscriptionResource` (backend respondeu no mesmo
dia). `subscription.type.ts` ganhou `pendingPlanId` em `Subscription`/
`toSubscription()`; `MySubscriptionView.vue` ganhou:
- Um aviso (`billing.mySubscription.pendingPlanChange`, mesma classe
  visual `.my-subscription-view__notice` do aviso de cancelamento —
  generalizada de `__cancelled-notice`, já que os 2 avisos podem
  aparecer AO MESMO TEMPO: `cancelAtPeriodEnd`/`pendingPlanId` são
  estados independentes, um usuário pode ter cancelado a renovação E
  estar com uma troca de plano pendente na mesma assinatura).
- A seção inteira "Trocar de plano" (`otherPlans`) fica escondida
  enquanto existe uma troca pendente — evita deixar o usuário clicar de
  novo só pra bater no 422 `errorMessagePlanChangeAlreadyPending`; antes
  disso o front não tinha como saber que já existia uma troca em
  andamento num carregamento novo de página.
- Verificado em browser real (backend local, `pending_plan_id` setado
  via tinker): aviso aparece com o nome do plano de destino resolvido
  (`Pro`), seção de troca escondida, botão de cancelar continua visível
  (independente); com os 2 estados simultâneos (cancelado E com troca
  pendente), os 2 avisos empilham e o botão de cancelar some
  corretamente.

**Refresh de status em tempo real implementado em 2026-08-31** — pedido
direto do usuário ("vamos seguir com o gap 1"), última pendência real da
Fase 2. `useSubscriptionConfirmationPoll.ts` (`modules/billing/composables/`,
testado — `isSubscriptionConfirmed` é função pura, test-first):
- `start()` (chamado no `onMounted` de `BillingCheckoutResultView.vue`,
  só nas variantes `success`/`pending` — `failure` é resultado
  definitivo, sem nada a esperar) captura um SNAPSHOT da assinatura
  (`getCurrentSubscription()`) e só liga o poll (`useIntervalFn` do
  `@vueuse/core`, 3s de intervalo, até 20 tentativas — ~1min, desiste em
  silêncio depois disso) se houver mesmo algo pendente: `status: pending`
  (assinatura nova, `SubscribeToPlanAction` já cria a linha assim antes
  do redirect) ou `pending_plan_id` setado (troca de plano,
  `ChangeSubscriptionPlanAction` idem). As duas rotas de retorno servem
  os dois fluxos sem diferenciar na URL — só dá pra saber qual transição
  importa comparando contra o snapshot inicial, não um valor fixo.
- Confirmado = `status` virou `active` (assinatura nova) OU
  `pending_plan_id` voltou a `null` (troca resolvida) — `ConfirmSubscriptionPaymentAction`
  (backend, chamado pelo webhook) é quem faz essas 2 transições.
- Uma vez confirmado, a tela troca SOZINHA da variante `pending` pra
  `success` (ícone/cor/texto/CTA, via um `displayVariant` computed que
  prevalece sobre o `route.meta.checkoutResult` original) — sem F5. Um
  indicador discreto ("Verificando confirmação automaticamente...", com
  spinner) aparece enquanto isso, só na variante ORIGINAL `pending`.
- Só ficou barato de implementar depois do Gap 2 (acima) fechar — sem
  `pending_plan_id` em `SubscriptionResource`, a detecção de "troca de
  plano confirmada" teria que comparar snapshots de mais campos, com
  mais ambiguidade.
- Verificado em browser real contra o backend local, simulando o
  webhook via tinker enquanto a página estava aberta (o cenário real que
  a feature existe pra cobrir): assinatura `pending`→`active` no meio do
  poll fez a tela virar de "Pagamento em análise" pra "Pagamento
  aprovado" sozinha, indicador de "verificando" sumiu; troca de plano
  pendente resolvida (`pending_plan_id` → `null`, `plan_id` atualizado)
  também detectada, confirmado depois navegando pra "Meu plano" (aviso
  de troca pendente sumiu, plano atual já mostrando o novo).

**Resolvidos antes desta rodada, mantidos por contexto**:
- `EmailNotVerifiedException` — resolvido em 2026-08-30: cadastro normal
  agora passa por `/verify-email` (Fase 1) antes de chegar em
  `choose-plan`, então na prática esse erro só apareceria se o usuário
  navegasse direto pra `/choose-plan` sem passar pela tela de verificação
  — caso residual, ainda cai no toast genérico (`errorMessageEmailNotVerified`).
- Gap de SSO + `choose-plan` — **já tinha sido fechado em 2026-08-30**
  (ver "Gap fechado de brinde" na Fase 1 acima); a lista de pendências
  desta seção nunca tinha sido atualizada depois disso, achado ao revisar
  esta seção pra fechar a Fase 2 — corrigido aqui.

---

## Fase 3 — Catalog (concluída)

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
`colunas`/`form` — ver `.ai/rules/crud-pattern.md`. **Extensão pro lado
do FORMULÁRIO em 2026-08-31** — ver seção "Padrão de CRUD, lado do
formulário" abaixo: as 3 peças acima cobrem só listagem/Drawer/
confirmação; `useResourceForm`/`useNumberFieldModel`/`CrudFormActions.vue`
fecham o mesmo padrão pro `use<Recurso>Form.ts`/`<Recurso>Form.vue`.

**Pendências reais desta fase** (não implementadas ainda, fora do escopo
do pedido "montar o CRUD de exemplo") — **as duas ficaram resolvidas em
2026-08-31**, ver seção "Rotas diretas + limite de plano do Catalog"
abaixo:
- ~~Rotas `/products/new`/`/products/:id/edit` dedicadas~~ — **resolvido**,
  mas não como página própria: continuam abrindo o MESMO `Drawer`
  (decisão original do usuário permanece — "renderizarão no modal lateral
  direito"), só ganharam deep link.
- ~~`usePlanLimit`~~ — **resolvido**, checagem proativa de
  `PLAN.max_products` antes de submeter.
- ~~Guard de rota real (`requiresAuth`)~~ — **resolvido em 2026-08-28**,
  ver Fase 1 acima (`meta.requiresAuth: true` no `AppLayout` pai).

**"Lançamentos de produto" implementado em 2026-08-31** — pedido direto
do usuário ("vamos seguir com o catálogo... implementar produtos e
lançamentos de produtos"), fechando a única pendência funcional real que
restava desta fase. Antes de implementar, `.ai/rules/crud-pattern.md` foi
auditado contra o `ProductsView.vue`/`ProductForm.vue` existentes — sem
achado de drift real, o CRUD de Produtos continuava 100% alinhado ao
padrão documentado.

- Mesma forma de módulo CRUD do padrão (`.ai/rules/crud-pattern.md`):
  `types/productLaunch.type.ts`, `catalogApi.ts` ganhou 4 funções
  (`listProductLaunches`/`createProductLaunch`/`updateProductLaunch`/
  `deleteProductLaunch`, todas recebendo `productId` explícito —
  `PRODUCT_LAUNCH` é sempre aninhado a um produto), `schemas/productLaunchFormSchema.ts`
  (fábrica, testada), `composables/useProductLaunchList.ts`
  (`buildProductLaunchSortParam` testado, mesmo critério de
  `useProductList.ts`) e `useProductLaunchForm.ts`.
- **UI**: "Lançamentos" é sempre uma aba dentro do detalhe de UM produto
  (`core/layouts/config/navigation.ts` já documentava essa decisão desde
  a Fase 3 original) — `ProductsView.vue` ganhou `TabBar` ("Dados do
  produto"/"Lançamentos") dentro do `Drawer` de EDIÇÃO (só existe em modo
  `edit`, produto precisa existir pra ter lançamentos); Drawer cresce de
  `size="md"` pra `"lg"` só nesse modo, pra caber a tabela de lançamentos.
  `components/blocks/ProductLaunchList.vue` (novo, primeiro componente do
  módulo a justificar a subpasta `blocks/` — é composição de verdade:
  `DataTable`+toolbar+`Modal`+`ConfirmDialog`) + `components/ProductLaunchForm.vue`
  (form simples, mesmo padrão de `ProductForm.vue`) dentro de um `Modal`,
  não um segundo `Drawer` — um painel lateral empilhado dentro de outro
  ficaria estranho.
- **2 achados reais, verificados e corrigidos no processo** (não
  específicos de Lançamentos — bugs sistêmicos preexistentes,
  encontrados só agora porque foi a primeira vez que certas combinações
  de componentes foram usadas juntas):
  1. **Erro de campo do backend nunca aparecia sob o input, pra qualquer
     campo com nome composto** (`full_sale_price`, `purchase_price`,
     `target_margin`...) — `parseApiError.ts` devolvia `fieldErrors`
     chaveado exatamente como o Laravel manda (snake_case, nome do
     REQUEST), mas todo `useXForm.ts` indexa `errors.value` pela chave
     CAMELCASE de `XFormValues`. 3 forms de Identity já tinham percebido
     isso pro único campo composto que cada um tem
     (`password_confirmation`) e remendado com um ternário ad-hoc
     repetido 3 vezes; `useProductForm.ts` (3 campos compostos) nunca
     tinha sido corrigido. Centralizado em `parseApiError.ts`
     (`toCamelCaseKey`, testado) — os 3 ternários ad-hoc removidos,
     `useProductForm.ts`/`useProductLaunchForm.ts` funcionam sem precisar
     de nenhum remendo próprio.
  2. **`Select`/`Tooltip`/`DropdownMenu`/`DatePicker`/`DateRangePicker`
     nunca funcionavam de verdade dentro de um `Modal`/`Drawer`** — os 5
     portais floating do design system usavam `z-index: 50`, sempre
     menor que `Modal.vue`/`Drawer.vue` (`100`/`101`), então qualquer um
     deles usado ANINHADO renderizava atrás do modal/drawer,
     interceptando clique (confirmado com Playwright: "element
     intercepts pointer events", tentando clicar no atalho "Hoje" do
     `DatePicker` dentro do `Modal` de lançamento). Nunca tinha aparecido
     antes porque nenhum componente flutuante tinha sido usado dentro de
     um Modal/Drawer até `ProductLaunchForm.vue`. Corrigido nos 5 pra
     `z-index: 200`.
- Verificado em browser real contra o backend local: criar produto →
  editar → aba "Lançamentos" aparece com 2 tabs corretos → estado vazio
  honesto → criar lançamento (incluindo escolher "Hoje" no `DatePicker`
  dentro do `Modal`, confirmando o fix de z-index) → editar → excluir,
  ciclo completo funcionando ponta a ponta.

---

## Bugs de formulário, transversal (2026-08-31)

Pedido direto do usuário ("temos alguns bugs de form no geral"), com 2
capturas reais — 2 bugs distintos, os dois cross-cutting (não específicos
de nenhum módulo), corrigidos no mesmo PR:

**1. Anel de foco cortado** — `.ui-drawer-body`/`.ui-modal-body`
(`Drawer.vue`/`Modal.vue`) e `.product-form__fields`
(`ProductForm.vue`) tinham `overflow-y: auto` sem padding nenhum. Um
campo focado ENCOSTADO na borda desse container tinha o próprio
`focus-ring` (`outline: 2px` + `outline-offset: 2px` = 4px de extensão)
CORTADO pelo `overflow` — nunca aparecia de verdade, só a borda reta do
campo (exatamente a captura mandada). Corrigido nos 3 com `padding:
$spacing-4` + `margin` negativo compensando (conteúdo visível fica
pixel-a-pixel onde estava, só a área de clipping do `overflow` cresce) —
detalhe completo em `docs/design/design-system.md` seção Components →
Drawer/Modal.

**2. Erro de campo sem tradução — "closure_validation_rule" cru na
tela** — investigado a fundo (não assumido como bug óbvio): o backend
(`../backend/bootstrap/app.php`) manda `errors` de validação chaveado
pela RULE NAME que falhou (`Str::snake(class_basename($rule))`), não uma
frase pronta — mesmo espírito de catálogo do `ApiMessageKey`, decisão
DELIBERADA do backend, não um bug de lá. `closure_validation_rule` é o
nome genérico que QUALQUER regra `Closure` custom vira (`ean`/`ncm` em
`CreateProductRequest`/`UpdateProductRequest`, `document` em
`SubscribeToPlanRequest`) — sem dicionário nenhum do lado do front, a
chave crua aparecia direto na tela.

- **2 gaps reais encontrados no processo**: `errorMessageValidation`
  (`ApiMessageKey::ErrorValidation`, o toast GERAL de qualquer 422 em
  QUALQUER formulário do app) nunca tinha sido cadastrada em
  `pt-BR.ts` — todo erro de validação, desde sempre, mostrava o toast com
  a chave crua "errorMessageValidation" em vez de um texto de verdade.
  E nenhum `useXForm.ts` passava a mensagem de campo por
  `useApiMessage()` antes de guardar em `errors.value` — sempre
  `messages[0]` cru.
- **Corrigido**: `errorMessageValidation` cadastrada
  ("Confira os campos destacados abaixo."); `useApiMessage()` ganhou
  `resolveFieldError(field, rule)` (testado —
  `tests/shared/composables/useApiMessage.test.ts`), com 2 camadas de
  dicionário em `pt-BR.ts` (`errors.validation.<rule>` genérico;
  `errors.validation.byField.<campo>.<rule>` só pros 3 casos reais e
  ambíguos de `closure_validation_rule`, grounded exaustivamente contra
  `../backend/app/Http/Requests/**/*.php` — nunca adivinhado). Os 7
  `useXForm.ts` que populam `errors.value` a partir de
  `apiError.fieldErrors` (`useLoginForm`/`useRegisterForm`/
  `useForgotPasswordForm`/`useResetPasswordForm`/`useUpdateProfileForm`/
  `useProductForm`/`useProductLaunchForm`) passaram a usar
  `resolveFieldError()` em vez de `messages[0]` direto.
- Detalhe completo (raciocínio de como o "closure_validation_rule" foi
  rastreado até a linha exata do backend que o gera) em
  `docs/infra/convencoes-frontend-infra.md` seção 4.
- Verificado em browser real contra o backend local: EAN inválido em
  `ProductForm.vue` agora mostra "EAN inválido — deve ser um código de
  barras EAN-8/12/13/14 válido." sob o campo, e o toast geral mostra
  "Confira os campos destacados abaixo." em vez das chaves cruas.

---

## Rotas diretas + limite de plano do Catalog (2026-08-31)

Pedido direto do usuário ("pode implementar os itens 1 e 2"), fechando as
2 pendências reais que restavam da Fase 3.

**Item 1 — `/products/new`/`/products/:id/edit` abrindo o `Drawer` já
existente.** Continua não sendo página própria (decisão original do
usuário permanece) — as 2 rotas novas (`routes.ts`) apontam pro MESMO
`ProductsView.vue`, e um `watch(() => [route.name, route.params.id])`
(`{ immediate: true }`) decide abrir `drawer.openCreate()`/`openEdit()`
reagindo à rota, nunca o inverso. Fechar por QUALQUER caminho (Cancelar,
salvar, `Esc`, clique fora, arrastar no mobile) navega de volta pra
`/products` via um segundo `watch`, só em `drawer.isOpen.value` — única
fonte de verdade, sem `router.push` espalhado em cada handler de
fechamento. `/products/:id/edit` acessado direto (F5, link
compartilhado) busca o produto via `GET /products/{product}`
(`getProduct()`, endpoint real já existente no backend, nunca consumido
antes) quando ele não está na página da listagem já carregada; ID
inexistente mostra o erro e volta pra `/products`.

- **Achado real, reportado pelo usuário durante a implementação**: o
  breadcrumb regredia de "Catálogo / Produtos" pra só "Produtos" nas 2
  rotas novas — `useBreadcrumb.ts`/`resolveBreadcrumbItems` casava só por
  `route.name === item.to.name` exato, e `products-new`/`products-edit`
  têm nome de rota diferente do item de navegação (`to.name: 'products'`),
  então nunca achava o item na árvore e caía no fallback (só o título da
  rota, sem o grupo). Corrigido com `NavItem.relatedRouteNames?: string[]`
  (`navigation.type.ts`) — a "Produtos" da sidebar ganhou
  `relatedRouteNames: ['products-new', 'products-edit']`
  (`navigation.ts`) — e `resolveBreadcrumbItems` passou a: (a) casar
  também por `relatedRouteNames`, (b) acrescentar um 3º segmento (o
  título da própria rota atual) quando a rota casada é "relacionada", não
  a exata do item. Resultado: "Catálogo / Produtos / Novo produto" e
  "Catálogo / Produtos / Editar produto" — exatamente o pedido do
  usuário. TDD: 3 testes novos escritos primeiro (`useBreadcrumb.test.ts`),
  vermelhos, depois a implementação.

**Item 2 — `usePlanLimit`, checagem proativa de `PLAN.max_products`.** A
validação REAL e reativa já existia no backend
(`CreateProductAction`/`ProductLimitReachedException` →
`errorMessageProductLimitReached`) — só a mensagem nunca tinha sido
cadastrada em `pt-BR.ts` (cadastrada agora). O pedido era ir além do
reativo: avisar o vendedor ANTES de ele preencher o formulário todo pra
só então levar um 422.

- **Backend**: pedido pra sessão `backend-c5` denormalizar
  `plan_limits: { max_products, max_marketplaces } | null` direto em
  `LoginResultResource` (mesmo padrão já usado pra `favorites`,
  seção acima) — especificamente pra `modules/catalog` nunca precisar
  importar `modules/billing` só pra achar o plano ativo (regra de
  fronteira de módulo, `docs/infra/convencoes-frontend-infra.md` seção
  2). `null` pra `admin_master`/sem plano; calculado com a MESMA lógica
  de `CreateProductAction` (não uma reimplementação "mais correta") —
  garante que `usePlanLimit` nunca diverge do que acontece de verdade no
  submit. Implementado e confirmado pela sessão de backend no mesmo dia.
- **Frontend**: `PlanLimits`/`toPlanLimits()` (`core/store/types/auth.type.ts`),
  campo `planLimits` em `AuthUser`, propagado pelos 3 pontos que recebem
  `LoginResultResource` (`useLoginForm`/`guards.ts`'s `bootstrapSession()`/
  `useVerifyEmail`) e preservado por `useUpdateProfileForm` (mesmo padrão
  já usado pra `favorites`). `modules/catalog/composables/usePlanLimit.ts`:
  `isProductLimitReached(planLimits, currentCount)` — função pura,
  testada primeiro (`usePlanLimit.test.ts`) — `false` quando não há
  limite conhecido (`admin_master`/sessão ainda não carregada) ou o plano
  não limita esse recurso (`maxProducts: null`), `true` quando a
  contagem atual já bateu ou passou do limite. `usePlanLimit(currentCount)`
  é o wrapper reativo, lendo `useAuthStore()` + a contagem já carregada
  por `useProductList` (`list.total`, nunca uma segunda busca).
- **UI** (`ProductsView.vue`): `ListToolbar` ganhou `addDisabled` (nova
  prop, bloco continua sem regra de negócio própria — só repassa o
  booleano decidido pelo consumidor) — desabilita "Novo produto" quando o
  limite é atingido. Indicador "`{total}` de `{max}` produtos
  cadastrados" sempre visível quando o plano tem limite conhecido, e um
  aviso (mesma linguagem visual do banner de erro, mas em
  `$color-accent-yellow`) quando o limite já foi atingido. **Só a UI é
  bloqueada, nunca a rota** — acessar `/products/new` direto por URL
  continua abrindo o form normalmente mesmo com o limite atingido; o
  backend continua sendo a trava real no submit.
- **Achado colateral, ao registrar a mensagem do limite**: praticamente
  TODAS as 9 chaves genéricas/infra de `ApiMessageKey` (`ErrorUnauthorized`/
  `ErrorForbidden`/`ErrorAccountNotActive`/`ErrorCannotModifyOwnAccount`/
  `ErrorNotFound`/`ErrorTooManyRequests`/`ErrorCsrfTokenMismatch`/
  `ErrorServer`/`ErrorInvalidCredentials`) nunca tinham sido cadastradas
  em `pt-BR.ts` — todo 401/403/404/429/CSRF/500/login inválido do app
  inteiro, desde sempre, mostrava a chave crua em vez de uma mensagem de
  verdade (mesma classe de gap já encontrada uma vez pra
  `errorMessageValidation`, seção "Bugs de formulário" acima — dessa vez
  o gap era sistêmico, não uma chave isolada). Cadastradas as 9. A regra
  de "só cataloga quando um consumidor real existe" (seção 6.3 de
  `docs/infra/convencoes-frontend-infra.md`) foi revisada no comentário
  de `pt-BR.ts`: chaves genéricas/infra (usáveis por QUALQUER endpoint)
  agora são cadastradas de forma antecipada; chaves de negócio específicas
  continuam esperando um consumidor real.
- Verificado em browser real contra o backend local (usuário/plano de
  teste com `max_products: 2`, criado e removido via tinker): com 2/2
  produtos, indicador mostra "2 de 2 produtos cadastrados", aviso de
  limite aparece, botão "Novo produto" fica desabilitado; com 1/2,
  indicador mostra "1 de 2", sem aviso, botão habilitado.

---

## Padrão de CRUD, lado do formulário (2026-08-31)

Pedido direto do usuário ("temos um padrão abstraído de CRUD?... vi
muito código duplicado nos arquivos algumaCoisaForm, precisamos ter
composables e componentes abstraídos... com menos arquivos duplicados
conseguimos gerar novos módulos, antes da Fase 4 vamos mexer com isso").
O padrão de CRUD original (Fase 3) só cobria listagem/Drawer/confirmação
(`useResourceList`/`useCrudDrawer`/`useConfirmAction`) — comparando
`useProductForm.ts`/`useProductLaunchForm.ts` lado a lado, a estrutura
era praticamente idêntica: `values`/`errors`/`isSubmitting`, `reset()`,
`validate()` (corpo byte-a-byte igual) e `submit()` com a mesma forma
(`validate → try { payload, create/update, toast } catch { parseApiError,
toast.error, loop de resolveFieldError } finally`). No componente
(`ProductForm.vue`/`ProductLaunchForm.vue`), o rodapé Cancelar/Submit e a
ponte string↔number de campo numérico também se repetiam.

**Escopo confirmado com o usuário antes de mexer** (pergunta direta,
trade-off real): só CRUD de entidade (Catalog agora, Pricing na Fase 4)
— Identity (login/registro/perfil/senha) fica de fora, são fluxos de
auth com regras próprias (redirect, sessão), não "criar/editar 1
recurso"; forçar no mesmo molde geraria abstração menos natural.

**3 peças novas, todas test-first (exceto o bloco, puramente visual)**,
somando às 3 já existentes — `.ai/rules/crud-pattern.md` atualizado com
a forma completa:

- **`useResourceForm<TValues, TResource, TPayload>`**
  (`shared/composables/`) — motor genérico de "formulário único cria/
  edita 1 recurso". Recebe um objeto de config com só o que REALMENTE
  varia por entidade (`schema`, `emptyValues`, `toFormValues`,
  `toRequestPayload`, `create`, `update`, `successMessage`) e devolve
  `{ values, errors, isSubmitting, reset, submit }` — todo o resto
  (`validate`, o fluxo inteiro de `submit`) passa a existir numa única
  cópia, testada de verdade pela primeira vez (`useProductForm.ts`/
  `useProductLaunchForm.ts` nunca tinham teste próprio — só os schemas
  Zod eram testados). `TPayload` é inferido do retorno de
  `toRequestPayload` — `create`/`update` tipam certo sem nenhum `as`
  quando o objeto de config é passado inline (tipagem contextual do TS,
  confirmado no typecheck: zero cast novo precisou entrar nos módulos).
  Testado em `tests/shared/composables/useResourceForm.test.ts` (8 casos
  — estado inicial, `reset()` com e sem recurso, validação falha não
  chama API, cria vs. atualiza, `isSubmitting` true durante a chamada,
  falha de API não propaga exceção).
- **`useNumberFieldModel<T>(values, key, { nullable? })`**
  (`shared/composables/`) — ponte string↔number pro `v-model` de
  `Input.vue`. `ProductForm.vue` tinha 2 factories locais quase
  idênticas (`numericField`/`nullableNumericField`) pra resolver isso
  DENTRO do próprio arquivo; `ProductLaunchForm.vue` reimplementava o
  mesmo par `get`/`set` de novo, sem reaproveitar nada — a duplicação era
  ENTRE arquivos, não só dentro de um. Testado em
  `tests/shared/composables/useNumberFieldModel.test.ts` (6 casos —
  leitura/escrita normal, default pra `0` vs. `null` conforme
  `nullable`).
- **`CrudFormActions.vue`** (`shared/components/blocks/`) — rodapé
  Cancelar/Submit (mesma marcação+CSS que estava duplicada nos 2 forms).
  Puramente de apresentação (emite só `cancel`, o submit já é o próprio
  `@submit.prevent` do `<form>` pai) — não exige test-first (sem lógica
  de estado interno), verificado em browser real.

**Retrofit dos 2 forms existentes**, sem mudar nenhum comportamento
observável: `useProductForm.ts`/`useProductLaunchForm.ts` ficaram
reduzidos a só `emptyValues`/`toFormValues`/`toRequestPayload` + a
chamada de `useResourceForm({ ...config })` (perderam completamente
`validate()`/o corpo de `submit()`, que agora moram só no composable
genérico); `ProductForm.vue`/`ProductLaunchForm.vue` trocaram os campos
numéricos por `useNumberFieldModel` e o rodapé por `CrudFormActions`,
removendo o CSS `__actions` duplicado dos 2 arquivos.

**Verificado em browser real contra o backend local** (usuário/plano de
teste, removidos depois): criar produto → editar produto (form
pré-preenchido corretamente) → erro de validação do CLIENTE ("Nome é
obrigatório.", confirma que `validate()` do composable genérico continua
funcionando) → cancelar fecha o Drawer → aba "Lançamentos" → criar
lançamento (incluindo o atalho "Hoje" do `DatePicker`) — todos os toasts
de sucesso corretos. Testado à parte também o erro de CAMPO vindo do
BACKEND (EAN inválido, `closure_validation_rule`): segue resolvendo pra
"EAN inválido — deve ser um código de barras EAN-8/12/13/14 válido."
(confirma que `resolveFieldError` dentro do `useResourceForm` genérico
continua no mesmo pipeline de antes). Suíte completa (28 arquivos, 165
testes) + typecheck/eslint/biome verdes.

**Ganho concreto pra Fase 4**: um CRUD novo (`Marketplace`/
`ProductMarketplace`/`PricingRule`) agora só precisa escrever o objeto de
config de `use<Recurso>Form.ts` (schema + as 3 conversões + as 2
chamadas de service) — zero lógica de validação/submissão/error-handling
pra reescrever, e campo numérico novo (ex.: `PricingRule.percentage`/
`fixed_fee`) é um `useNumberFieldModel(values, 'campo')` de uma linha.

---

## Fase 4 — Pricing (primeira rodada concluída, 2026-08-31)

Conexão com marketplace e vínculo produto↔marketplace. **Sem dashboard de
preço sugerido nesta fase** — ver gap abaixo, continua de pé.

Pedido direto do usuário: "vamos primeiro implementar os CRUDs que são do
admin (cadastro de marketplace e regras do marketplace) e pra role user
apenas as ações de marketplace x product" — confirmado por pergunta direta
que "ações de marketplace x product" incluía TANTO conectar/gerenciar
`USER_MARKETPLACE` QUANTO o vínculo `PRODUCT_MARKETPLACE` (sem o primeiro,
o segundo não teria marketplace nenhum pra escolher). Primeiro módulo novo
desde a separação em Bounded Contexts (`modules/pricing/`) e primeira tela
admin do projeto inteiro.

**Módulo `modules/pricing/` — tipos/serviço únicos pras 4 entidades**
(`marketplace.type.ts`, `pricingRule.type.ts`, `userMarketplace.type.ts`,
`productMarketplace.type.ts`, todos em cima do schema OpenAPI gerado;
`services/pricingApi.ts` com as ~20 funções das 4 entidades, mesmo padrão
de 1 arquivo de service por módulo já usado em `catalogApi.ts`/`billingApi.ts`).

### 1. Admin — CRUD de `Marketplace` + `PricingRule` aninhada

`AdminMarketplacesView.vue` (`/admin/marketplaces`, `meta.roles:
['admin_master']`) — MESMA forma exata de `ProductsView.vue`
(`.ai/rules/crud-pattern.md`): `useResourceList`/`useCrudDrawer`/
`useConfirmAction` pro CRUD principal (nome + toggle `active`), `TabBar`
dentro do Drawer de edição pra "Regras de comissão" (só em modo `edit`),
mesmo padrão de "Lançamentos" da Fase 3 — `AdminPricingRuleList.vue`
(`components/blocks/`) + `AdminPricingRuleForm.vue`, ambos usando
`useResourceForm`/`useNumberFieldModel`/`CrudFormActions` (o padrão
abstraído na rodada anterior, primeiro reaproveitado de verdade num
módulo novo). Leitura de regras via endpoint COMPARTILHADO (`GET
/marketplaces/{id}/pricing-rules`, `auth:sanctum` só — funciona pro admin
igual pra qualquer usuário), escrita só pelo admin (`/admin/marketplaces/{id}/pricing-rules`).
Sem `ListToolbar` em nenhuma das duas listas — a API admin não tem
filtro de texto (só `filter[active]`), mesmo raciocínio já registrado em
`ProductLaunchList.vue`.

### 2. User — conectar/gerenciar `USER_MARKETPLACE`

`MarketplacesView.vue` (`/marketplaces`, `meta.roles: ['user']`) — **grid
de cards**, pedido explícito do usuário com referência visual real de
outro produto (ícone + nome + toggle + botão), adaptado aos campos reais
da Orbita (sem badges/tags/link externo — não existe dado análogo em
`MARKETPLACE`). Um único card por marketplace cobre os 2 nós do fluxo
original ("Canais disponíveis" + "Minhas conexões", consolidados num só
item de sidebar): sem conexão → botão "Conectar" (abre
`ConnectMarketplaceModal.vue`, pede `store_name`); conectado → nome da
loja + `Toggle` de `active` + "Gerenciar"/"Excluir". `active`
(pausa — bloqueia novos vínculos, mantém os existentes) e `DELETE`
(remove a conexão E cascade-deleta os vínculos de produto já feitos,
`DeleteUserMarketplaceAction`) são ações DIFERENTES de propósito — só o
`DELETE` pede confirmação. `useMarketplaceLimit` (proativo, `max_marketplaces`)
desabilita "Conectar" quando o limite é atingido, mesmo padrão de
`usePlanLimit` (Fase 3) — os dois agora delegam pra um
`usePlanResourceLimit` genérico novo (`shared/composables/`), extraído
nesta rodada pra não recriar o mesmo par função-pura/wrapper-reativo uma
segunda vez.

**Achado real, corrigido**: no PRIMEIRO clique em "Conectar" de toda a
sessão, `POST /user-marketplaces` saía com `marketplace_id: ""` (422).
Causa: `ConnectMarketplaceModal.vue` é montado (`v-if="activeCard"`) com
a prop `open` já `true` (setada na MESMA função síncrona que define
`activeCard`) — um `watch(open, ...)` sem `immediate: true` só dispara
numa MUDANÇA de valor, e nesse primeiro mount não há mudança nenhuma pra
ele ver, então `values.marketplaceId` nunca era setado. Reaberturas
seguintes funcionavam (componente já montado, `open` realmente
transiciona false→true). Corrigido com `{ immediate: true }` no watch —
confirmado inspecionando o payload real da requisição antes/depois do
fix (Playwright + interceptação de request).

### 3. User — vínculo `PRODUCT_MARKETPLACE`

`ProductMarketplacesView.vue`, rota PRÓPRIA `/products/:id/marketplaces`
(`meta.roles: ['user']`) — **não** uma aba dentro do Drawer de edição de
`ProductsView.vue`, de propósito: `PRODUCT_MARKETPLACE` é do Bounded
Context Pricing no backend (`Api/Pricing/ProductMarketplaceController`,
mesmo com a URL aninhada sob `/products`), e um módulo nunca importa de
outro diretamente (seção 2 de `docs/infra/convencoes-frontend-infra.md`)
— `ProductsView.vue` (Catalog) só ganhou um 3º botão de ação de linha
("Marketplaces") que NAVEGA por nome de rota (`router.push({ name:
'product-marketplaces', ... })`), nunca um import de `modules/pricing/*`
(mesmo mecanismo já usado entre Identity→Billing). Cabeçalho mostra o
nome do produto via `getProductName()` (`pricingApi.ts`, lê só o campo
necessário do mesmo `GET /products/{id}` que Catalog já consome, sem
duplicar `Product`/`toProduct()` inteiro).

Lista (`DataTable`, sem paginação de UI) resolve nome do marketplace/loja
cruzando as 3 listas (`ProductMarketplace`+`UserMarketplace`+`Marketplace`)
client-side — `buildProductMarketplaceRows`/`buildAvailableConnectionOptions`
(funções puras, testadas primeiro). "Vincular marketplace" abre um
`Modal` com `Select` — opções são só conexões ATIVAS e ainda não
vinculadas a ESTE produto (validação de UI, não só espera o 422 de
`UserMarketplaceNotActiveException`/`ProductAlreadyLinkedToMarketplaceException`).
Sem update — trocar de canal é sempre `DELETE` + `POST` de novo (vínculo
puro, sem campo mutável). "Desvincular" pede confirmação
(`ConfirmDialog`), mesmo padrão de exclusão do resto do app.

### i18n

7 novas chaves genéricas/infra de `ApiMessageKey` do Bounded Context
Pricing cadastradas de uma vez (mesmo critério já usado nas 9 chaves de
infra da rodada anterior — cada uma já tem consumidor real nesta
implementação): `errorMessageMarketplaceAlreadyConnected`,
`errorMessageMarketplaceHasConnections`, `errorMessageMarketplaceLimitReached`,
`errorMessageNoPricingRuleAvailable`, `errorMessageInvalidPricingRuleRange`,
`errorMessageProductAlreadyLinkedToMarketplace`,
`errorMessageUserMarketplaceNotActive`.

### Verificado em browser real, ponta a ponta, contra o backend local

Usuários/planos de teste criados e removidos via tinker pra cada rodada:
CRUD admin de marketplace + regra de comissão (criar/editar/excluir os
dois); grid de conexão (conectar → limite atingido bloqueia o botão →
pausar → editar nome da loja → desconectar → limite libera de novo); e o
fluxo completo produto→conectar→vincular→desvincular. Suíte completa (37
arquivos, 206 testes) + typecheck/eslint/biome verdes.

**Gap de backend confirmado (continua bloqueando a tela de "preço
sugerido")**: `PricingCalculator`/`PriceRange`/`SuggestedPrice` existem
na camada de Domain do backend, testados isoladamente, mas **nunca foram
conectados a nenhuma rota**. `PRODUCT_MARKETPLACE` é vínculo puro (sem
`suggested_price`/`is_approximated` — migration
`2026_08_26_145617_remove_suggested_price_and_is_approximated_from_product_marketplaces_table`
confirma a remoção). A tela "Dashboard de precificação com preço sugerido
por canal" do diagrama de jornada **não é implementável no contrato de
API atual** — só dá pra construir o vínculo puro, já feito acima.
Revisitar esta fase quando o backend expuser o endpoint de sugestão de
preço.

**Correção pixel-perfect do grid de cards, 2026-08-31** — usuário comparou
lado a lado com a captura de referência ("não está pixel perfect"). 2
erros estruturais reais corrigidos (`Toggle` que morava no cabeçalho
movido pro rodapé, ao lado do botão; botão "Conectar" trocado de
`primary` sólido pra `outline` + ícone `ArrowsDownUp`) — detalhe completo
em `docs/design/design-system.md`, seção MarketplacesView. **Gap real que
persiste**: a referência tem logo por marca, descrição, tags e link
externo — `MARKETPLACE` só tem `id`/`name`/`active` hoje, nenhum desses 4
é implementável só no frontend. Pedido enviado pra sessão de backend
(`logo_url`/`description`/`tags`/`website_url`, nullable, em
`MarketplaceResource`/`AdminMarketplaceResource` +
`CreateMarketplaceRequest`/`UpdateMarketplaceRequest`).

**Gap fechado, mesmo dia, em duas rodadas.** 1ª rodada: backend
implementou os 4 campos exatamente como pedido (`logo_url` ainda como
link colado nesse momento). `AdminMarketplaceForm.vue` ganhou os 4
campos de cadastro (`Input` pra descrição/site, `TagsInput` pra tags);
`MarketplacesView.vue`/card ganhou `<img>` real (fallback `IconTile` sem
logo ou se a imagem falhar ao carregar), link externo (`hostnameOf()`,
ícone `ArrowSquareOut`), descrição e tags (`Badge`). Verificado em
browser real com dado de teste (`logo_url` externo, descrição, 3 tags,
site) — bate com a referência.

**2ª rodada, mesmo dia — mudança de contrato pedida pelo usuário direto
pro backend**: "não podemos ficar dependendo de links externos" —
`logo_url` deixou de ser aceito como ENTRADA; o campo de escrita virou
`logo_base64` (upload real, até 2MB, backend hospeda e serve). `logo_url`
continua existindo, só que agora só do lado da RESPOSTA, sempre um link
do próprio storage. `AdminMarketplaceForm.vue` reescrito: primeiro upload
de arquivo do projeto — `<input type="file">` nativo escondido +
`Button` disparando `.click()`, `FileReader` convertendo pra base64.
`logo_base64` só entra no payload quando um arquivo novo é escolhido
(nunca `null` implícito numa edição de rotina — mesmo padrão de senha
opcional já usado em `useUpdateProfileForm.ts`). Detalhe completo em
`docs/design/design-system.md`, seção AdminMarketplaceForm. Verificado
em browser real com upload de arquivo de verdade (`page.setInputFiles`):
preview aparece na hora, submit grava, `logo_url` resultante aponta pro
storage do backend, card exibe a imagem real servida. Suíte completa (37
arquivos, 210 testes) + typecheck/eslint/biome verdes nas duas rodadas.

**Bug de breadcrumb em `product-marketplaces`, corrigido no mesmo dia** —
reportado pelo usuário: clicar "Marketplaces" na listagem de produtos
levava pra `/products/:id/marketplaces` com o breadcrumb mostrando só
"Marketplaces do produto", sem "Catálogo / Produtos /" na frente. Mesma
causa raiz já corrigida uma vez pra `products-new`/`products-edit`
(seção "Rotas diretas..." acima) — `product-marketplaces` nunca tinha
sido adicionada ao `relatedRouteNames` do item "Produtos"
(`core/layouts/config/navigation.ts`), então `useBreadcrumb.ts` não
achava a rota na árvore de navegação e caía no fallback (só
`route.meta.title`). Corrigido estendendo o array pra incluir
`'product-marketplaces'`, verificado em browser real (breadcrumb
completo "Catálogo / Produtos / Marketplaces do produto"; reconfirmado
que `/products/new` não regrediu). **Terceira vez que esse exato padrão
regride** — usuário pediu pra formalizar como regra, feito em
`.ai/rules/app-shell.md` (checklist de 4 passos pra toda rota nova) e
`.ai/rules/crud-pattern.md` (item novo em "O que NÃO fazer").

**Bug relacionado, mesmo dia — crash real (não só visual) ao clicar em
"Recentes"**: `Error: Missing required param "id"`, não capturável por
try/catch (quebra o `RouterLink` no render). Causa: `router.afterEach`
(`core/router/guards.ts`) gravava `to: { name: to.name }` sem `params` —
qualquer rota com segmento dinâmico já visitada (`product-marketplaces`,
`products-edit`) virava um item de "Recentes" impossível de resolver de
volta. Corrigido propagando `to.params` junto. Mesma classe de bug
existia (ainda não reportada, corrigida proativamente) no botão de
favoritar página atual — `UserFavoriteResource` só persiste `route_name`
no backend, sem params, então a correção ali é diferente: impedir CRIAR
favorito de rota com param (`isCurrentRouteFavoritable` checa
`route.params` vazio) + filtrar defensivamente na lista da sidebar
qualquer favorito já persistido de antes dessa correção
(`routeRequiresParams()`, `AppSidebarContent.vue`). Verificado em browser
real: clicar em "Recentes" pra uma rota parametrizada navega certo pro
mesmo registro visitado; botão de favoritar some em `product-marketplaces`,
continua em `/products`. Regra geral documentada em `.ai/rules/app-shell.md`.

**3 ajustes pedidos direto pelo usuário no mesmo dia (2026-08-31)**:

1. **Admin não conseguia acessar `/marketplaces` nem
   `/products/:id/marketplaces`** — as duas rotas (`pricing.routes.ts`) e o
   grupo "Marketplaces" da sidebar (`navigation.ts`) tinham
   `meta.roles: ['user']`/`roles: ['user']` puramente por serem, no
   momento em que a Fase 4 nasceu, telas só do vendedor comum — sem
   motivo de negócio real pra excluir `admin_master`, que já passa pelo
   mesmo middleware `subscription.active` (o guard de assinatura ativa já
   isenta admin no backend). Removido o `roles` das duas entradas de rota
   e do grupo de navegação. Verificado em browser real: `admin_master`
   navega pra `/marketplaces` e `/products/:id/marketplaces` sem redirect,
   sidebar mostra o grupo normalmente.
2. **Logo do marketplace só aparecia no card grid (`MarketplacesView.vue`),
   não nas outras listagens** — extraído `MarketplaceLogo.vue`
   (`modules/pricing/components/`, `<img>` real com fallback `IconTile`/
   `Storefront` em `@error`) do markup que já existia solto ali, e
   reaproveitado nos 2 lugares que ainda mostravam só o nome cru:
   `AdminMarketplacesView.vue` (`#cell-name`, via `IconText`) e
   `ProductMarketplacesView.vue` (`#cell-marketplaceName`, idem). Exigiu
   um campo novo, `marketplaceLogoUrl`, em `ProductMarketplaceRow`
   (`useProductMarketplaces.ts`) — TDD confirmou o gap primeiro (fixture
   de teste com o campo esperado, `toEqual` falhando antes da mudança na
   função `buildProductMarketplaceRows`, verde depois). **Decisão de
   escopo, não comunicada como pedido explícito**: o `Select` de "vincular
   marketplace" (dropdown de texto puro do Reka UI) NÃO ganhou logo — é um
   átomo compartilhado (`shared/components/ui/Select.vue`) sem suporte a
   conteúdo rico por opção hoje, mudar isso pra um único consumidor
   contrariaria a régua de "sobe pra shared/blocks só com um 2º consumidor
   real" ao contrário (desceria complexidade nova pro átomo genérico por 1
   caso). Revisitável se o usuário confirmar que quer isso também.
3. **Filtro de ciclo de cobrança (`?filter[billing_cycle]=`) em
   `ChoosePlanView.vue`/`MySubscriptionView.vue`** — a API já suportava o
   filtro (`GET /plans`), só não tinha seletor nenhum na UI; o front
   sempre buscava a lista inteira (mensal + anual misturados). Adicionado
   um `BlockTab` "Mensal"/"Anual" acima da grade nos 2 lugares.
   `useChoosePlan.ts` reescrito pra manter DUAS listas — `plans` (todos os
   planos, sem filtro, buscada uma vez) e `visiblePlans` (só o ciclo
   selecionado, refeita a cada troca via `GET /plans?filter[billing_cycle]=...`
   de verdade) — necessário porque `usePlanPricing.ts`
   (`getYearlySavings`/`findMostEconomicalPlan`) precisa comparar contra o
   universo INTEIRO de planos (ex.: "economize R$X/ano" compara o anual
   contra o mensal mais barato, que só existe na lista sem filtro), mas a
   grade renderizada usa só `visiblePlans`. Mesmo padrão replicado em
   `MySubscriptionView.vue` (`plans.plans`/`plans.visiblePlans` da mesma
   composable), com um cuidado extra: a seção "Trocar de plano" (que
   contém o próprio seletor) fica visível mesmo quando o ciclo
   selecionado não tem nenhum plano pra trocar (`hasPendingPlanChange`
   continua sendo o gate real, não `otherPlans.length`) — senão o usuário
   ficaria preso sem conseguir descobrir que o outro ciclo tem opções,
   mostrando em vez disso a mensagem `changePlan.emptyForCycle`.
   Verificado em browser real contra o backend de verdade (2 planos
   mensais + 2 anuais seedados): alternar Mensal/Anual dispara o `GET`
   real com o `filter[billing_cycle]` certo nos 2 componentes, grade troca
   de conteúdo, resumo de "Meu plano" (plano atual/status/datas) não muda
   com o filtro, badge "Mais econômico" calcula só dentro do ciclo
   visível, e o caso de "economia zero" (yearly = 12× o mensal exato nos
   dados de seed) corretamente NÃO mostra nenhum badge de economia (nunca
   um valor zerado/negativo).

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
