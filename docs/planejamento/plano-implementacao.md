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

**Parcialmente concluída, fora de ordem, 2026-08-28** — pedido direto do
usuário ("vamos montar o CRUD", segunda página de exemplo depois do
dashboard da Fase 0.5/Home), grounded numa captura de referência de uma
listagem genérica ("Order List"). Implementado **antes** das Fases 1/2
(Identity/Billing) por decisão explícita do usuário — a rota `/products`
já existe e funciona de ponta a ponta contra o backend real, mas ainda
sem guard de autenticação de verdade (`meta.requiresAuth: false` no
`AppLayout` pai, Fase 1 gap já registrado) e sem `usePlanLimit`/checagem
de `max_products` (depende de Billing, Fase 2, não implementada ainda).

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
- Guard de rota real (`requiresAuth`) — depende da Fase 1 (Identity)
  terminar; hoje qualquer um acessa `/products` sem estar logado (só não
  CONSEGUE fazer nada porque a API real devolve 401 sem sessão).

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
