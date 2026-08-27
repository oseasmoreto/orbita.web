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

## Fase 1 — Identity

Cadastro, login, sessão. Bloqueia todas as fases seguintes (tudo exige
usuário autenticado).

**Rotas** (`modules/identity/routes.ts`):
`/login`, `/register`, `/forgot-password`, `/reset-password/:token`,
`/verify-email`, `/sso/callback`, `/account` (perfil).

**Services** (`modules/identity/services/identityApi.ts`):
`register`, `login`, `me`, `updateMe`, `deleteMe`, `listSsoAccounts`,
`removeSsoAccount`, `requestPasswordReset`, `resetPassword`,
`resendVerificationEmail`.

**Composables:**
- `useLoginForm` / `useRegisterForm` — Zod schema (`schemas/loginSchema.ts`,
  `schemas/registerSchema.ts`) + `ensureCsrfCookie()` + chamada ao service +
  `useAuthStore().setUser(...)`. Candidatos a test-first (seção 11.2 das
  convenções — validação de formulário com regra não-trivial).
- `usePasswordResetForm`, `useProfileForm`.
- `useSsoRedirect` — monta a URL de `GET /auth/sso/{provider}/redirect` e
  redireciona o browser (sem chamada axios, é navegação de página inteira).

**Views:** substituir os placeholders da Fase 0 pelos formulários reais
(`LoginView`, `RegisterView`, `ForgotPasswordView`, `ResetPasswordView`,
`VerifyEmailView`, `SsoCallbackView`, `AccountView`).

**Gap de backend confirmado (não é decisão de frontend):** **não existe
endpoint de logout** em `orbita.api` (`grep` em `routes/api/v1/identity.php`
e `Http/Controllers/Api/Identity/` não retorna nenhuma rota `logout`). Como a
autenticação é sessão via cookie Sanctum (não Bearer token), o frontend não
tem como encerrar a sessão do lado do servidor sem uma rota
`POST /v1/auth/logout`. Já reportado à sessão do backend em 2026-08-27 — a
tela de "sair da conta" fica bloqueada até essa rota existir. Enquanto isso,
`useAuthStore().clear()` limpa o estado local, mas o cookie de sessão
continua válido no servidor.

---

## Fase 2 — Billing

Planos e assinatura — obrigatório antes de liberar o resto do sistema
(jornada: `ChoosePlan → Payment → Dashboard`).

**Rotas:** `/plans`, `/checkout`, `/checkout/pix`, `/billing` (histórico de
transações + status da assinatura).

**Services:** `billingApi.ts` — `listPlans`, `subscribe`, `changePlan`
(prorata), `cancelAtPeriodEnd`, `listTransactions`.

**Composables:**
- `usePlanSelection` — lista planos, marca o atual.
- `useCheckout` — orquestra criação de assinatura/troca de plano, Pix (QR
  code via `qrcode`) ou cartão via Mercado Pago; precisa de polling ou
  webhook-driven refresh do `SUBSCRIPTION.status` (checkout não é síncrono).
- `useSubscriptionStatus` — deriva `requiresSubscription`/limites de plano
  pro guard de rota (router já expõe o campo, mas a leitura de
  `max_products`/`max_marketplaces` pro aviso de upgrade mora aqui).

**Guard novo:** rota que exige assinatura ativa checa
`authStore.requiresSubscription` — redireciona pra `/checkout` em vez de
`/login`.

---

## Fase 3 — Catalog

Cadastro de produto — primeira tela "de trabalho" do vendedor.

**Rotas:** `/products`, `/products/new`, `/products/:id/edit`,
`/products/:id/launches`.

**Services:** `catalogApi.ts` — CRUD de `Product` + `ProductLaunch`
(paginado, `sort`/`filter` conforme `Http/Support/QueryFilters` do backend).

**Composables:**
- `useProductForm` — Zod (`schemas/productFormSchema.ts`) espelhando o
  `FormRequest` real (preço de venda ≥ preço de compra é o exemplo canônico
  de regra replicável no cliente — seção 6.2). Test-first.
- `useProductList` — paginação + filtro, usa `@vueuse/core` onde couber
  (debounce de busca) antes de escrever algo próprio.
- `usePlanLimit` — checa `max_products` do plano atual contra a contagem
  real antes de submeter o form de criação, mostra aviso de upgrade em vez
  de esperar o 422 do backend. Test-first (mesmo critério de
  `useSuggestedPrice` citado nas convenções).

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
| Endpoint de logout inexistente | Fase 1 | Reportado à sessão backend em 2026-08-27, aguardando |
| `APP_URL`/`.env` real ainda aponta pro túnel ngrok de teste | Fase 1 (verificação de e-mail) | Reportado, não bloqueia infra |
| Sugestão de preço (`PricingCalculator`) nunca exposta em rota | Fase 4 | Sem rota — fase segue só com vínculo puro até existir |
