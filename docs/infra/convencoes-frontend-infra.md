# Convenções de Desenvolvimento — Frontend & Infra

Plataforma SaaS de Precificação para Marketplace
Stack: Vue 3 (Composition API) · TypeScript · SCSS · componentização por domínio · Docker · Dokploy

Localização do projeto: raiz do repositório `orbita.frontend` é onde este documento descreve — `src/`, `docker-compose.yml`, `Dockerfile` etc. O backend (Laravel, `orbita.api`) vive em repositório separado e expõe a API que este frontend consome — ver seção 8.

---

## 1. Princípios gerais

- **KISS**: Composition API sempre, sem Options API. Sem estado global (Pinia) pra tela que não precisa, sem camada nova "pra caso um dia precise".
- **DRY**: componente/composable/service que se repete em 2+ módulos sobe pra `shared/`. Duplicar 2-3 linhas parecidas é aceitável; duplicar lógica de decisão nunca é.
- **Componentização por domínio, não por tipo técnico**: a estrutura reflete os Bounded Contexts do backend (`Pricing`, `Catalog`, `Billing`, `Identity`, `Platform`), não pastas genéricas soltas na raiz.
- **Micro e macro, mas nunca lógica de negócio no componente**: componente Vue é sempre visual — recebe props, emite eventos, no máximo compõe outros componentes. Toda decisão de negócio (`if` que importa: cálculo, validação, limite de plano) vive num `composable`, nunca no `<script setup>` de um componente.
- **Tudo tipado**: `strict: true` sem exceção, `any` proibido. Tipo de domínio duplicado à mão é a mesma categoria de bug de "regra de negócio duplicada" — ver seção 6 pra como isso é resolvido sem duplicar manualmente os DTOs do backend.
- **Test-first**: composables e services com lógica (cálculo, validação, formatação que espelha regra de domínio) só são escritos depois do teste que os exige existir e falhar primeiro. Ver seção 11.

---

## 2. Estrutura de pastas

```
src/
  modules/
    pricing/
      components/
        blocks/          # composições específicas do módulo (ex: PricingRuleTable.vue) — ver seção 3.2
        PricingRuleForm.vue   # componente solto é aceitável enquanto o módulo for pequeno (ver critério na seção 3.3)
      composables/         # lógica reativa do domínio (ex: useSuggestedPrice.ts) — seção 4
      services/            # chamada à API do módulo (ex: pricingApi.ts) — seção 4
      schemas/             # schemas Zod de validação de formulário (ex: productFormSchema.ts) — seção 6.2
      types/               # tipos do domínio, derivados do contrato gerado — seção 6.1
      views/               # páginas roteadas do módulo
      routes.ts            # rotas do módulo (lazy-loaded) — seção 9
    catalog/ ...
    billing/ ...
    identity/ ...
    platform/ ...

  shared/
    components/
      ui/                  # átomos de design system (Button, Input, Select, Badge, Icon) — seção 3.1
      blocks/              # composições reutilizáveis entre módulos (DataTable, FormGroup, PageHeader, ConfirmDialog) — seção 3.2
    composables/           # genéricos, sem domínio (useDebounce, usePagination, useToast)
    services/              # utilitário de API sem domínio (ex: parseApiError.ts)
    types/                 # tipos compartilhados (Pagination<T>, ApiError) + schema gerado — seção 6
    layouts/               # AppLayout, AuthLayout

  core/
    api/
      client.ts            # instância única de HTTP (axios), interceptors — seção 8
      schema.d.ts           # tipos gerados a partir do OpenAPI do backend (NUNCA editado à mão) — seção 6.1
    router/                # router principal + guards — seção 9
    store/                 # Pinia root (auth, notifications) — seção 5
    i18n/                  # setup do vue-i18n + catálogo de mensagens (pt-BR) — seção 6.3
    styles/                # SCSS global — seção 7

  App.vue
  main.ts
```

**Regra de fronteira** (já valia, reforçada aqui): um módulo pode importar de `shared/` e `core/`, mas **nunca** de outro módulo diretamente. Se dois módulos precisam do mesmo componente/composable/service, ele sobe pra `shared/`.

**Critério de promoção pra `shared/`** (mesma régua do DRY, tornada explícita): um componente/composable/service nasce dentro do módulo. Só sobe pra `shared/` quando um **segundo** módulo precisar dele de verdade — nunca antecipado "porque parece genérico".

---

## 3. Componentes Vue

- Composition API com `<script setup lang="ts">` sempre — sem exceção, nem pra componente trivial.
- Props sempre via `defineProps<{ ... }>()`, emits sempre via `defineEmits<{ ... }>()` — nunca a forma de array (`defineProps(['foo'])`).
- Um componente = uma responsabilidade visual clara. Se o `<template>` passar de ~150 linhas ou acumular muita lógica condicional, provavelmente precisa ser quebrado.
- Nomeação de arquivo: `PascalCase.vue` (ex: `PricingRuleForm.vue`, `ProductMarketplaceCard.vue`).

### 3.1 Componentes "micro" (`shared/components/ui/`)

- Átomo de design system: não sabe nada de domínio, não importa `modules/*`, não faz chamada de API. Recebe dado, emite evento (`Button`, `Input`, `Select`, `Badge`, `Modal`, `Icon`).
- **`docs/design/design-system.md` é a fonte de verdade visual, obrigatória sem exceção** (regra não-negociável, repetida no `CLAUDE.md` raiz do repo): cor, tipografia, espaçamento, raio e as receitas de componente já documentadas ali. Todo átomo/bloco novo consome só as variáveis SCSS de `core/styles/_variables.scss` (que por sua vez só são aliases de `core/styles/_tokens.scss`) — nunca um hex/px direto no componente, nunca um valor fora da escala documentada. Componente novo entra na seção "Components" do design system no mesmo PR que o introduz.
- **Decisão 2026-08-26 — não reinventar primitivo acessível do zero**: componente com comportamento complexo (`Select`, `Modal`/`Dialog`, `Popover`, `Tooltip`, `Tabs`, `Combobox`) é sempre construído **em cima** do primitivo headless equivalente da **Reka UI** — só estiliza via SCSS/props em cima do que a lib já resolve (foco, teclado, ARIA, posicionamento). Nunca implementar isso à mão quando a Reka UI já cobre. `vaul-vue` é o primitivo específico pro padrão de *bottom sheet*/drawer mobile (não coberto pela Reka UI) — usar em vez de simular drawer com `Modal`.
- **Ícones**: `@lucide/vue` pra genérico, ou o conjunto próprio do design system (`shared/components/icons/`, gerado via `npm run generate:icons` a partir de `docs/icons-regular/`/`docs/icons-duotone/`) — nunca SVG solto colado no componente. `Icon.vue` é o wrapper fino em cima de qualquer uma das duas fontes. **Regra não-negociável, sem exceção**: importar o ícone do conjunto próprio sempre direto do módulo gerado (`import { Check } from '@/shared/components/icons/regular.generated'`), **nunca** por namespace (`shared/components/icons/index.ts` não reexporta os ícones de propósito) — um acesso `IconsRegular.Check` via namespace impede o bundler de eliminar os outros 1247 ícones do módulo e infla o chunk de ~1kB pra ~2,4MB (achado real, medido em build). Detalhe completo em `docs/design/design-system.md`, seção Components → Icon.
- Estado interno permitido só quando é puramente de UI (ex: `Modal` sabe se está aberto, `Input` sabe se está focado) — nunca estado de negócio.
- É o componente mais barato de tornar 100% reutilizável — qualquer prop nova deve ser genérica (`variant`, `size`, `disabled`), nunca nomeada por caso de uso de um módulo específico (ex: nunca `showMarketplaceIcon`).

### 3.2 Componentes "macro" (`blocks/`, dentro de `shared/` ou de um módulo)

- Composição de 2+ componentes micro com alguma lógica de apresentação (paginação de tabela, abrir/fechar de um `ConfirmDialog`, layout de um card) — mas **ainda sem regra de negócio**: se precisa decidir algo (ex: "esse produto está fora da margem, mostra badge vermelho"), a decisão (`isOutOfMargin`) vem de um composable via prop, o componente só recebe o booleano e pinta.
- `shared/components/blocks/` é pra quem serve 2+ módulos (`DataTable`, `PageHeader`, `ConfirmDialog`, `FormGroup`). `modules/<contexto>/components/blocks/` é pra composição específica daquele domínio (`PricingRuleTable`, `ProductMarketplaceCard`) que ainda não tem motivo de subir.
- Teste-first cobre a **lógica de estado interno** desses componentes (ex: "emite `update:page` ao clicar próximo"), não o markup — ver seção 11.2.
- Wrapper de gráfico (`chart.js` + `vue-chartjs`) e de carrossel (`embla-carousel-vue`) são sempre um `block` (`ChartCard`, `ImageCarousel`) — nunca `chart.js` chamado direto dentro de uma `view`. Se 2+ módulos precisam do mesmo tipo de gráfico (ex: série temporal de preço), o wrapper sobe pra `shared/components/blocks/`; um gráfico específico de um módulo fica em `modules/<contexto>/components/blocks/`.

### 3.3 Quando um módulo ainda não precisa da subpasta `blocks/`

- Módulo novo/pequeno: componentes soltos direto em `modules/<contexto>/components/` são aceitáveis. Só cria a subpasta `blocks/` quando o módulo acumular componentes de composição o suficiente pra ficar confuso misturado com os triviais — mesmo critério de escalonamento que o backend usa pra rotas (`docs/infra/convencoes-backend-infra.md` seção 2). Não adianta criar `blocks/` vazio "por padronização".

---

## 4. Composables e Services — onde a lógica repetida vive

Esta é a camada equivalente ao `Domain/Services` + `Application/Actions` do backend (seção 3 de `docs/infra/convencoes-backend-infra.md`): é aqui, não no componente, que mora todo `if` que importa.

| Camada | Responsabilidade | Regra de negócio? | Chama API direto? |
|---|---|---|---|
| `services/<recurso>Api.ts` | 1 função por chamada HTTP, tipada (recebe/devolve tipos de `types/`, derivados do schema gerado — seção 6). Zero estado reativo. | Não — só request/response mapping. | Sim, via `core/api/client.ts` (nunca `axios`/`fetch` direto fora daqui). |
| `composables/use<Recurso>.ts` | Estado reativo (`ref`/`reactive`), orquestra chamada ao `service`, expõe `isLoading`/`error`/dado. Pode conter regra de negócio client-side (ex: cálculo de preço espelhando o backend, checagem de limite de plano antes de submeter). | **Sim, quando aplicável** — é o principal candidato a test-first (seção 11). | Não direto — sempre via `services/`. |
| `stores/use<Dominio>Store.ts` (Pinia) | Estado genuinamente global entre telas (seção 5). Pode usar `composables`/`services` internamente. | Só o que for estado compartilhado — decisão pontual de tela fica no composable da tela, não na store. | Não direto. |
| Componente `.vue` | Consome o composable, renderiza. | Não. | Não. |

- **Nunca `axios.get()`/`fetch()` direto dentro de componente ou composable de UI** — sempre via `services/`, mesma régua do "Repository obrigatório" do backend (seção 3.6 de `convencoes-backend-infra.md`): o objetivo não é trocar de biblioteca HTTP no futuro, é isolar a chamada de rede da camada de apresentação.
- **Decisão 2026-08-26 — `@vueuse/core` antes de escrever um composable genérico novo**: `useDebounce`, `usePagination`-like, `useClickOutside`, `useLocalStorage` etc. já existem lá — só escreve um composable próprio em `shared/composables/` quando o VueUse genuinamente não cobre o caso. Isso não vale pra composable de domínio (`useSuggestedPrice`, `usePlanLimit`) — esses continuam sempre próprios, é onde mora a regra de negócio.
- **Validação de formulário sempre via schema Zod** (`modules/<contexto>/schemas/<recurso>Schema.ts`), espelhando as regras do `FormRequest` correspondente no backend (limites de campo, formato, obrigatoriedade) — o composable do formulário (`use<Recurso>Form.ts`) faz `schema.safeParse(payload)` antes de chamar o `service`, nunca confia só na validação HTML nativa nem só no 422 de volta da API. Schema com regra não-trivial (ex: "preço de venda não pode ser menor que preço de compra") é o mesmo tipo de candidato a test-first que um composable de cálculo.
- Composable que **espelha regra de negócio do backend** (ex: exibição de preço sugerido, checagem de limite de plano na UI antes de submeter) é o candidato número um a test-first — divergência sutil entre front e back nessas contas é o tipo de bug que só aparece em produção (mesmo alerta da seção 10.3 da versão anterior deste documento).
- Tratamento de erro de API centralizado: `services/parseApiError.ts` (em `shared/`) traduz o envelope `{ success, message, data, errors }` do backend (ver `docs/infra/convencoes-backend-infra.md`, não copiado aqui — consultar sob demanda) pra um formato consumível pelos composables. Nunca duplicar esse parsing em cada módulo.

---

## 5. Estado global (Pinia)

- Usar Pinia **só** para estado genuinamente global e persistente entre telas: `auth` (usuário logado, plano ativo, `role`), `notifications` (contador não lido).
- Estado local de tela/formulário fica em `ref`/`reactive` dentro do componente ou composable — não polui a store global.
- Um store por domínio claro (`useAuthStore`, `useNotificationStore`), nunca um store "catch-all".

---

## 6. Tipos, validação e contrato de API

- `strict: true` no `tsconfig.json`, sem exceção. `any` proibido — payload realmente desconhecido usa `unknown` + narrowing explícito.

### 6.1 Tipos gerados a partir do OpenAPI do backend

- **Tipos de API não são digitados à mão.** O backend expõe schema OpenAPI via Scramble (`docs/infra/convencoes-backend-infra.md` seção 10, consultar sob demanda). Rodar `npm run generate:api-types`, que executa `openapi-typescript` contra `${API_OPENAPI_URL}/docs/api.json` e escreve `src/core/api/schema.d.ts` — **arquivo gerado, nunca editado à mão** (mesmo espírito de "não deixe o código divergir da documentação" já usado pro ERD/back).
  - Tipos de domínio em `modules/<contexto>/types/` (ex: `Product`, `PricingRule`) são definidos **em cima** do schema gerado (`Pick`/`Omit`/alias dos tipos de `components['schemas']['...']`), não redigitados campo por campo — isso é o que garante que uma mudança de `Resource` no backend quebra o build do frontend em vez de divergir silenciosamente.
  - Rodar a geração: (a) manualmente durante o dev quando o backend muda um contrato, (b) como etapa de CI que falha o build se `schema.d.ts` gerado divergir do commitado (evita "esqueci de rodar").
- Enums de negócio (`SubscriptionStatus`, `NotificationType` etc.) também vêm do schema gerado quando o backend os expõe como enum OpenAPI; só cria union type manual pra algo que não existe no contrato da API (ex: estado de UI puro, tipo `TabKey`).
- Respostas genéricas (paginação, envelope) ficam em `shared/types/` (`ApiResponse<T>`, `Paginated<T>`), casando com o formato do backend.

### 6.2 Validação de formulário com Zod — não é o mesmo papel do OpenAPI

- **Zod não substitui o schema gerado da seção 6.1 — os dois têm papéis diferentes, pra não acabar com dois lugares "dona" do mesmo tipo:**

| | Escopo | Onde mora | Gerado ou manual? |
|---|---|---|---|
| Tipo OpenAPI (6.1) | Formato de request/response da API — o que o backend aceita/devolve | `core/api/schema.d.ts` + `modules/<contexto>/types/` | Gerado, nunca editado à mão |
| Schema Zod (aqui) | Regra de validação de **formulário**, do lado do cliente, antes de submeter | `modules/<contexto>/schemas/` | Escrito à mão, espelhando o `FormRequest` do backend |

- Schema Zod é sobre **experiência de preenchimento** (avisar o vendedor antes de submeter, sem esperar o roundtrip do 422): campo obrigatório, formato, regra de negócio simples replicável no cliente (ex: "preço de venda ≥ preço de compra"). O tipo estático do formulário vem de `z.infer<typeof schema>`, nunca redigitado numa interface separada.
- Mecânica de uso (composable, test-first) já descrita na seção 4.

### 6.3 Internacionalização e chaves de mensagem

- **`NOTIFICATION.title`/`.message` e as respostas de erro/sucesso da API aceitam uma CHAVE catalogada** (`NotificationMessageKey`/`ApiMessageKey` — `docs/negocio/contexto-plataforma-precificacao.md` seção 2.5) **ou texto livre; é o frontend quem decide traduzir ou mostrar cru.** `vue-i18n` é o mecanismo dessa tradução — não é i18n multi-idioma no sentido tradicional (produto é pt-BR only no MVP), é a camada que resolve chave → texto.
- `core/i18n/` concentra a config do `vue-i18n` e o catálogo `pt-BR` (única locale no MVP — não criar `en.json`/seletor de idioma sem novo motivo de negócio). Chave desconhecida (texto livre vindo do backend) é exibida como veio, sem tentar traduzir.
- Mensagem de notificação/erro na UI sempre passa por esse resolver (`$t(key)` ou composable equivalente) — nunca um `switch`/`if` manual mapeando chave pra texto espalhado pelo componente.

---

## 7. SCSS

- **Fonte de verdade é `docs/design/design-system.md`** (gerado a partir de `docs/design/tokens/` — paleta SnowUI, fonte Inter Variable, densidade Standard). Regra não-negociável: nenhuma cor, espaçamento, raio, tamanho ou peso de fonte hardcoded num componente — sempre pela variável SCSS correspondente. Precisar de um valor que não existe na escala já trazida? Ele existe no export de origem (`docs/design/tokens/`) — traga o valor que falta pra `_tokens.scss`, nunca invente um novo fora dele.
- Estrutura em `core/styles/`: `_tokens.scss` (as custom properties CSS de verdade — `:root`/`[data-theme='dark']` — importado **uma única vez**, só por `main.scss`, nunca por um componente: como são regras CSS reais, `@use` num componente duplicaria o bloco inteiro no CSS compilado daquele componente, já que cada `.vue` é uma unidade de compilação Sass separada), `_variables.scss` (só `$nome: var(--x)`, aliases finos sem nenhuma regra CSS própria — esse sim é `@use`d livremente por qualquer componente), `_mixins.scss`, `_reset.scss`, `main.scss` (único ponto de entrada global, importa `tokens` + `reset` + `variables`).
- Componentes usam **scoped styles** (`<style scoped lang="scss">`) por padrão — SCSS global só pra tokens de design (variáveis/mixins) e reset.
- Nunca hardcode cor/espaçamento direto no componente — sempre via variável SCSS (`$color-primary`, `$spacing-16`).
- Fonte auto-hospedada (`@fontsource-variable/inter`), nunca CDN do Google Fonts — o app é PWA offline-first (seção 13.5) e o service worker já faz precache de `.woff2`; uma fonte via CDN quebraria isso e adicionaria uma requisição de rede fora do controle do precache.
- BEM como convenção de classe quando não estiver isolado por scoped style (ex: componente com muitas variações de estado): `.pricing-card__header--active`.
- Mobile-first: media queries sempre `min-width`, nunca `max-width` como padrão.

---

## 8. Comunicação com a API — sessão e segurança

- **Decisão herdada do backend** (`docs/infra/convencoes-backend-infra.md` seção 10.3): autenticação é cookie httpOnly (Sanctum) + header CSRF — **nunca Bearer token guardado em `localStorage`/`sessionStorage`**. O frontend não gerencia token de acesso manualmente.
- `core/api/client.ts` é a **única** instância HTTP do projeto (axios, `withCredentials: true`, `baseURL` vindo de `import.meta.env.VITE_API_BASE_URL`). Nenhum módulo cria sua própria instância.
  - Interceptor de request: em todo método que não seja `GET`/`HEAD`, injeta `X-XSRF-TOKEN` a partir do cookie `XSRF-TOKEN` (lido via `js-cookie`, já decodificado — nunca parseado `document.cookie` na mão) — espelha `PreventRequestForgery::isReading()` do backend.
  - Interceptor de response: `401` → limpa `useAuthStore` e redireciona pro login; `422` → repassa pro composable chamador via `parseApiError()` (seção 4), nunca solto como erro genérico.
- `v-html` é proibido por padrão — conteúdo dinâmico (ex: mensagem de notificação que aceita texto livre, seção 2.5 de `contexto-plataforma-precificacao.md`) é sempre tratado como texto, nunca interpolado como HTML. Na exceção rara em que HTML de fato precisa ser renderizado, o conteúdo passa por `DOMPurify.sanitize()` antes do `v-html` — nunca `v-html` direto sobre dado vindo do backend/usuário sem passar por ele.

---

## 9. Roteamento

- Cada módulo define seu próprio `routes.ts`, agregado em `core/router`. Todas as rotas usam **lazy loading** (`component: () => import('...')`) — sem exceção.
- Guards de rota (autenticação, checagem de `role` — `admin_master`/`user` — e de limite de plano) centralizados em `core/router`, nunca espalhados em cada `routes.ts`. Sem permissão granular por tela no MVP (`docs/negocio/contexto-plataforma-precificacao.md` seção 6).

---

## 10. Convenções de código

- **ESLint (`eslint-plugin-vue` + `@typescript-eslint` + `@vue/eslint-config-typescript`) pras regras semânticas/Vue, Biome via Ultracite pra formatação e lint rápido complementar** — não é ESLint + Prettier: Prettier não faz parte do stack, Biome assume a formatação (mais rápido) enquanto o ESLint continua sendo quem entende regra específica de Vue/TS que o Biome não cobre. Os dois obrigatórios, rodando em pre-commit via Husky.
- Nomeação: componentes `PascalCase.vue`; composables `camelCase.ts` prefixo `use`; types/interfaces `PascalCase`; variáveis/funções `camelCase`.
- Import absoluto via alias (`@/modules/...`, `@/shared/...`, `@/core/...`), nunca `../../../` em cadeia.
- Sem `console.log` em código commitado.
- **Todo código em inglês, sem exceção** — componente, composable, variável, prop, emit, rota, nome de teste. Só prosa de documentação (`.md`) e diagramas de fluxo/jornada (`.mmd` `flowchart`) ficam em português — regra completa no `CLAUDE.md` raiz.
- **Config de ferramenta sempre na raiz do repo, um arquivo por ferramenta** — `eslint.config.ts`, `biome.jsonc`, `vitest.config.ts`, `playwright.config.ts`, `pwa-assets.config.ts`. `tsconfig.json` não é um único arquivo monolítico: é só o índice de *project references* (`tsconfig.app.json` pro app, `tsconfig.node.json` pros próprios arquivos de config em contexto Node, `tsconfig.sw.json` pro service worker — seção 13.5 — e `tsconfig.test.json`, este **de propósito fora** das references do `tsconfig.json` raiz, pra manter os testes fora do `vue-tsc -b` que roda no `build`/`typecheck` — ver seção 11.3). Isso evita um `tsconfig` só tentando servir 4 ambientes (DOM, Node, WebWorker, teste) com flags incompatíveis entre si.
- `@typescript-eslint`/tipagem completa (`projectService`) é ligado nos arquivos `.ts`, mas **deliberadamente desligado nos `.vue`** — rodar o language service completo do TS por arquivo Vue trava em projeto grande rodando em WSL2 (ambiente real de dev deste time). A tipagem completa de `.vue` fica coberta pelo `npm run typecheck` (`vue-tsc -b --noEmit`), não pelo ESLint; regra type-aware "insegura" (`no-unsafe-*`) por isso só roda nos `.ts`, não nos `.vue`.

---

## 11. Testes — Test-First (TDD)

**Mesmo critério do backend, adaptado**: lógica com decisão nasce de um teste que falha antes de qualquer implementação. Isso se concentra em `composables` com lógica e em `services`/utils — não em todo componente visual indiscriminadamente.

### 11.1 Fluxo obrigatório (red → green → refactor)

1. **Red** — escreve o teste do composable/função descrevendo o comportamento, roda e confirma que falha.
2. **Green** — implementa o mínimo pra passar.
3. **Refactor** — limpa com o teste como rede de segurança.

PR com composable/lógica de cálculo nova sem teste correspondente no mesmo commit é rejeitado na revisão.

### 11.2 O que é test-first obrigatório vs. o que pode vir depois

| Camada | Test-first? | Motivo |
|---|---|---|
| `composables` com lógica de negócio (`useSuggestedPrice`, `usePlanLimit`) | **Sim, sempre** | Onde o frontend replica/consome regra de domínio — mesmo critério do backend. |
| `services`/utils puros (parsers, formatters, validators) | **Sim, sempre** | Função pura, barata de testar; edge case (preço negativo, faixa vazia) nasce do teste. |
| Componentes `blocks/` com lógica de estado interno (paginação, validação de `Form`) | **Sim**, para a lógica de estado — não para o markup | Escreve o teste do comportamento (ex: "emite `update:page`") antes do handler. |
| Componentes `ui/` e puramente visuais | Teste depois é aceitável, ou snapshot leve | Baixo risco, custo/benefício ruim de test-first em puro template. |
| E2E de fluxo crítico | Teste depois é aceitável (obrigatório antes do merge da feature) | Escrever antes da UI existir é pouco produtivo. |

### 11.3 Ferramentas

| Tipo | Alvo | Ferramenta |
|---|---|---|
| Unit | composables, funções puras de `services`/utils, schemas Zod | Vitest (ambiente `happy-dom`, mais leve que jsdom) |
| Componente | `shared/components/` e componentes de módulo com lógica | Vitest + `@vue/test-utils` |
| Cobertura | acompanhamento, não gate por número mínimo (mesmo critério do backend, seção 5.4 de `convencoes-backend-infra.md`) | `@vitest/coverage-v8` |
| E2E | fluxos críticos (login → cadastro produto → conecta marketplace → vê preço sugerido) | Playwright — ver seção 15 |

**Decisão 2026-08-26 — `@vue/test-utils`, não Testing Library**: é a lib oficial do time do Vue, sem dependência extra de adaptador. **Playwright, não Cypress**, pro E2E: multi-browser nativo e integra melhor com Vite/CI sem runner adicional.

Setup global do Vitest fica em `tests/setup.ts` (referenciado por `vitest.config.ts`); `tsconfig.test.json` cobre `tests/**/*.ts` com regras propositalmente mais soltas que o `tsconfig.app.json` (ex: `noUnusedLocals`/`noUnusedParameters` desligados) — teste explora caso de borda, não é código de produção, mas sem abrir mão do `strict: true` base.

### 11.4 CI / gate

- Pipeline roda `eslint` + `vitest run` em todo PR; merge bloqueado se falhar.
- E2E crítico roda no PR que altera o fluxo correspondente; obrigatório antes de merge em `main` de qualquer mudança nesses fluxos.
- Ausência de teste em composable/service novo com lógica é motivo de review request, não sugestão.

---

## 12. Git / Fluxo de trabalho

- Branches: `feature/<modulo>-<descricao>`, `fix/<modulo>-<descricao>`.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, `test:`, `chore:`.
- PR referencia o módulo afetado no título (ex: `feat(pricing): formulário de regra de comissão por faixa`).
- Lint + testes rodando localmente antes de abrir PR.

---

## 13. Infraestrutura — Docker & Dokploy

**Decisão 2026-08-26 — deploy próprio, desacoplado do backend**: apesar de o `docker-compose` do backend citar um nginx que também serve "os estáticos do frontend" (redação antiga, de quando os dois viviam num só repositório), a partir da separação em `orbita.frontend` o frontend passa a ter **seu próprio** Dockerfile/Dokploy — deploy independente, sem esperar build do backend.

### 13.1 Build (Dockerfile multi-stage)

```dockerfile
# estágio 1: build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # gera dist/ (Vite)

# estágio 2: runtime — só o estático, sem Node
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK CMD wget -qO- http://localhost/healthz || exit 1
```

- `nginx.conf` do runtime cobre: fallback de SPA (`try_files $uri /index.html`), gzip, cache agressivo pra assets com hash (`/assets/*`), e uma rota `/healthz` retornando `200` estático (pro `HEALTHCHECK`/Dokploy).
- **Nenhum container roda Node em produção** — o build acontece só no estágio 1, descartado depois; o container que sobe é só `nginx` + arquivos estáticos.

### 13.2 Ambiente local

- **Diferente do backend** (que exige Docker local por causa de paridade de extensão PHP — `docs/infra/convencoes-backend-infra.md` seção 8.3): frontend roda `npm run dev` (Vite) **nativo no host**, sem Docker. Node não tem o mesmo risco de "funciona na minha máquina" que binding nativo de PHP tem — a paridade real que importa é a do **build final**, que já roda dentro do mesmo Dockerfile usado em CI/staging/produção.
- Versão do Node fixada via `.nvmrc` (`24`) e `engines` no `package.json` — evita drift de versão entre devs.
- Variáveis de ambiente locais em `.env.local` (Vite já suporta nativamente, `VITE_*` prefixo obrigatório pra expor ao client) — nunca commitado, `.env.example` commitável documentando as chaves esperadas (`VITE_API_BASE_URL`, `API_OPENAPI_URL` pra geração de tipos — seção 6).

### 13.3 Dokploy

- Projeto Dokploy próprio (`orbita-frontend`), um por ambiente (`staging`, `production`) — nunca compartilhar deploy com o backend.
- Deploy via Git push → Dokploy builda o Dockerfile da seção 13.1.
- **Coordenação obrigatória com o backend no primeiro deploy de cada ambiente novo**: o domínio do frontend precisa entrar em `SANCTUM_STATEFUL_DOMAINS` e no `cors.allowed_origins` do backend (`docs/infra/convencoes-backend-infra.md`, consultar sob demanda) — sem isso, cookie de sessão e CSRF não funcionam entre os dois domínios. Isso é um passo manual de infra, não código; documentar no runbook de deploy do ambiente.
- Variáveis de ambiente (`VITE_API_BASE_URL` etc.) via env do Dokploy, nunca hardcoded/commitadas.

### 13.4 Ambientes

- `local`: Vite dev server nativo (seção 13.2), apontando pro backend local (`docker compose` do repo `orbita.api`) ou pra `staging` via env, conforme a feature.
- `staging`: build via Dockerfile real, aponta pra API de staging; dados sintéticos.
- `production`: build via Dockerfile real, `VITE_API_BASE_URL` de produção, sem qualquer flag de debug.

### 13.5 PWA (offline-first)

- **Decisão 2026-08-26 — estratégia `injectManifest`, não `generateSW`**: o service worker é um arquivo próprio versionado no repo (`src/sw.ts`, `workbox-precaching` chamado explicitamente), não gerado 100% às cegas pelo plugin — dá controle sobre o que entra no precache e sobre a lógica de update (abaixo), ao custo de ter um arquivo a mais pra manter. `vite-plugin-pwa` builda esse arquivo no mesmo `npm run build` do estágio 1 (seção 13.1) — não é um passo de deploy separado. Ícones/manifest gerados via `@vite-pwa/assets-generator` (`npm run generate:pwa-assets`, config em `pwa-assets.config.ts`) a partir de uma imagem-fonte única (`public/favicon.svg`) — evita manter cada tamanho de ícone manualmente; os PNGs gerados **são** commitados (não são build output, `dist/` continua sendo o único gitignored).
- **Update é via prompt, não automático** (`registerType: 'prompt'` + `injectRegister: false`): o composable `core/pwa/useAppUpdatePrompt.ts` chama `useRegisterSW()` (`virtual:pwa-register/vue`) e, quando `needRefresh` vira `true`, dispara um toast (`vue-sonner` — seção 15.3) com ação "Atualizar" chamando `updateServiceWorker(true)`. Vendedor no meio de um cadastro de produto não perde o formulário porque um deploy novo saiu — só atualiza quando confirma. `<Toaster />` do `vue-sonner` fica montado uma vez na raiz (`App.vue`).
- **Cache do service worker é versionado pelo hash do build do Vite** — cada deploy novo invalida o precache automaticamente (comportamento padrão do Workbox); não precisa de lógica manual de "limpar cache" no `nginx.conf` da seção 13.1, só garantir que `sw.js`/`manifest.webmanifest` **não** entrem no cache agressivo de asset com hash (esses dois arquivos precisam de `Cache-Control: no-cache` pro browser sempre checar se há versão nova).
- Estratégia de cache runtime (o que fica cacheado pra uso offline) é decidida por rota/recurso conforme a feature evoluir — não cachear resposta de API que muda por sessão (preço sugerido, notificação) por padrão; cachear só estático (assets, shell da SPA).
- `src/sw.ts` é excluído do `tsconfig.app.json` e coberto pelo `tsconfig.sw.json` próprio (`lib: ["ES2023", "WebWorker"]`, seção 10) — o contexto de tipos de um Service Worker (`self`, `ServiceWorkerGlobalScope`) não é o mesmo de um módulo de app rodando no DOM.

---

## 14. Observabilidade

Escopo do MVP, espelhando a decisão já tomada pro backend (`docs/infra/convencoes-backend-infra.md` seção 9): **logs de acesso/erro do nginx pesquisáveis, sem exception tracking de JS client-side ainda**.

- Container `nginx` deste repo ganha um sidecar `promtail` apontando pro **mesmo Loki** já usado pelo backend (mesma VPS/Grafana) — dashboards existentes ganham um label `service=frontend` novo, não duplicam infra.
- Erro de JS não tratado: `app.config.errorHandler` (em `main.ts`) captura e loga no console por enquanto — **sem envio pra serviço externo no MVP**. Caminho de evolução (fora do escopo do MVP, mesmo espírito da seção 9.5 do backend): se o volume de bug silencioso em produção justificar, plugar o mesmo GlitchTip que o backend eventualmente adotar (SDK `@sentry/vue`, protocolo compatível), reaproveitando o servidor já provisionado — não é retrabalho, é uma peça a mais.

---

## 15. Stack técnica e dependências

Decisões fechadas sobre linguagem/ferramentas. Lib nova fora dessa lista passa pela mesma discussão antes de entrar no `package.json` — não adicionar dependência "de passagem" durante uma feature.

### 15.1 Core

| Item | Escolha | Observação |
|---|---|---|
| Runtime local | Node 24 (LTS) | Só usado pra dev/build — produção não roda Node (seção 13.1). Fixado via `.nvmrc`. |
| Framework | Vue 3 (Composition API) | `<script setup lang="ts">` sempre — seção 3. |
| Linguagem | TypeScript `strict: true` | `any` proibido — seção 6. |
| Build | Vite + `@vitejs/plugin-vue` + `vue-tsc` | |
| Estado global | Pinia | Seção 5 — só pra estado genuinamente global. |
| Roteamento | Vue Router | Lazy loading obrigatório — seção 9. |
| HTTP client | axios | Interceptors de request/response tornam CSRF+401 (seção 8) muito mais simples que envolver `fetch` manualmente; é o padrão recomendado pela própria doc do Sanctum. |

### 15.2 Tipagem, validação e dados

| Item | Escolha | Observação |
|---|---|---|
| Geração de tipos de API | `openapi-typescript` | Consome o OpenAPI (Scramble) do backend — seção 6.1. Dev dependency, roda via script `generate:api-types`. |
| Validação de formulário | Zod | Schema por recurso, `z.infer` pro tipo — nunca redigitado numa interface separada. Papel diferente do OpenAPI gerado, ver seção 6.2. |
| Composables genéricos | `@vueuse/core` | Usar antes de escrever um composable genérico próprio — seção 4. |
| Datas | `dayjs` | Formatação/manipulação de data (ex: `end_date` de assinatura, `date` de `PRODUCT_LAUNCH`). |
| Números/moeda | `Intl.NumberFormat` nativo, envolvido em util de `shared/` | Sem lib externa pra isso especificamente (mesmo espírito do VO `Money` do backend) — `dayjs` cobre data, não substitui formatação de moeda/percentual. |
| Sanitização de HTML | `dompurify` | Só na exceção rara de `v-html` — seção 8. |
| Cookies | `js-cookie` | Leitura do cookie `XSRF-TOKEN` no interceptor do `core/api/client.ts` — seção 8. |

### 15.3 UI e componentes

| Item | Escolha | Observação |
|---|---|---|
| Fonte | `@fontsource-variable/inter` (Inter Variable, auto-hospedada) | Design system (`docs/design/design-system.md`) — nunca CDN do Google Fonts, quebraria o precache do PWA (seção 7/13.5). Família registrada é `"Inter Variable"`, não `"Inter"`. |
| Primitivos headless | Reka UI | Fundação de `shared/components/ui/` pra componente com comportamento complexo — seção 3.1. |
| Drawer/bottom sheet | `vaul-vue` | Complementa a Reka UI pro padrão mobile de drawer — seção 3.1. |
| Ícones | `@lucide/vue` | Fonte única de ícone — nunca SVG solto colado em componente. |
| Carrossel | `embla-carousel-vue` | Sempre envolvido num `block` — seção 3.2. |
| Gráficos | `chart.js` + `vue-chartjs` | Sempre envolvido num `block` — seção 3.2 (ex: série de preço sugerido no dashboard). |
| Toast/feedback | `vue-sonner` | Base do composable `useToast` de `shared/composables`. |
| QR Code | `qrcode` | Renderização do Pix (`copia e cola`) na tela de pagamento — módulo `billing`. |
| i18n / chaves de mensagem | `vue-i18n` | Resolve `NotificationMessageKey`/`ApiMessageKey` → texto pt-BR — seção 6.3. |
| PWA | `vite-plugin-pwa` + `workbox-precaching` + `@vite-pwa/assets-generator` | Seção 13.5. |

### 15.4 Qualidade e testes

| Item | Escolha | Observação |
|---|---|---|
| Lint (regras Vue/TS) | ESLint + `eslint-plugin-vue` + `@typescript-eslint` + `@vue/eslint-config-typescript` | Seção 10. |
| Formatação + lint rápido | Biome (`@biomejs/biome`) via preset `ultracite` | Substitui Prettier — seção 10. |
| Git hooks | Husky | Pre-commit: lint + format + testes relevantes. |
| Testes unit/componente | Vitest + `@vue/test-utils` + `happy-dom` + `@vitest/coverage-v8` | Seção 11.3. |
| Testes E2E | Playwright | Seção 11.3, decisão 2026-08-26. |

### 15.5 Nota de versão — TypeScript

**Decisão 2026-08-26 — TypeScript fixado em `~6.0.3`, não na última versão (`7.x`)**: TypeScript 7 já é o `latest` do pacote, mas `@typescript-eslint` (usado por `eslint-plugin-vue`/`@vue/eslint-config-typescript` — seção 15.4) ainda declara suporte só até `<6.1.0`; instalar TS 7 quebra o lint type-aware (`npm ls` acusa árvore de dependência inválida). "Última versão possível" aqui significa a mais nova que não quebra o resto do toolchain — não a mais nova em termos absolutos. Revisitar esse teto assim que o `@typescript-eslint` publicar suporte a TS 7 (acompanhar o changelog do pacote antes de subir a versão).
