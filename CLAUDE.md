# Plataforma SaaS de Precificação para Marketplace — Frontend

SaaS que permite ao vendedor cadastrar produtos, conectar contas de marketplaces (Shopee, TikTok Shop, Amazon, Mercado Livre etc.) e visualizar o preço que deve praticar em cada canal, considerando as regras de comissão de cada marketplace e a margem de lucro que o próprio vendedor define por produto.

Este repositório (`orbita.frontend`) é só o frontend. Stack: Vue 3 (Composition API) + TypeScript + SCSS, componentização por domínio. O backend (Laravel/PHP, DDD pragmático) vive em outro repositório (`orbita.api`) e expõe a API que este frontend consome.

---

## Leitura obrigatória (carregada automaticamente nesta sessão)

Os arquivos abaixo são a fonte de verdade do domínio e das convenções deste frontend. Antes de propor qualquer componente, composable, store ou rota, o conteúdo já está carregado via import — não adivinhe uma regra de negócio ou convenção sem checar aqui primeiro.

Modelo de dados, regras de negócio, diagrama de fluxo do sistema, diagrama de jornada do usuário e pontos em aberto:
@docs/negocio/contexto-plataforma-precificacao.md

Convenções de frontend & infra: estrutura de módulos por domínio, componentes micro/macro, composables/services, TypeScript strict + geração de tipos a partir do contrato da API, Pinia, roteamento, TDD de composables, Docker/Dokploy, observabilidade, stack técnica:
@docs/infra/convencoes-frontend-infra.md

ERD isolado (fonte de verdade estrutural das tabelas — útil pra tipar `modules/<contexto>/types` em sincronia com o backend):
@docs/negocio/entidades-precificacao.mmd

Diagrama de jornada do usuário isolado (login vs. cadastro, verificação de e-mail, recuperação de senha, pagamento, limite de plano, preço fora da margem — mapeia as Views/guards que este frontend implementa):
@docs/negocio/jornada-usuario.mmd

Design system (fonte de verdade visual — cor, tipografia, espaçamento, raio, componentes de UI já implementados). Gerado a partir de `docs/design/tokens/`; qualquer componente/view novo segue isso, sem exceção:
@docs/design/design-system.md

Convenções de backend (`docs/infra/convencoes-backend-infra.md`, cópia neste repo) não são carregadas automaticamente aqui — consultar sob demanda quando precisar entender a forma do endpoint/DTO que o `services/` de um módulo vai consumir, ou os detalhes de CORS/Sanctum citados na seção 13.3 do doc de infra do frontend. Docs de implementação de API (padrão de resposta/envelope, mensagens de erro, roteiro de cadastro/assinatura/login) ficam no repositório `orbita.api`, em `docs/api/` — não existem cópia aqui, consultar lá quando integrar um novo endpoint.

---

## Regras não-negociáveis (resumo — detalhe completo nos arquivos acima)

- **Test-first é obrigatório** para `composables` e `services`/utils com lógica de negócio (cálculo, validação, formatação que espelha regra de domínio) — não é exigido para todo componente visual indiscriminadamente. PR com composable/lógica nova sem teste correspondente é rejeitado — não é sugestão, é gate de review.
- **Regra de negócio nunca vive no componente.** Componente Vue só consome e renderiza; cálculo/transformação de dado complexo vai para um `composable` (`useX.ts`).
- **Componentização por domínio, não por tipo técnico.** Estrutura reflete os Bounded Contexts do backend: `Identity`, `Billing`, `Catalog`, `Pricing`, `Platform` — cada um vira (ou vai virar) um módulo em `src/modules/<contexto>`.
- **Um módulo nunca importa de outro módulo diretamente** (`modules/catalog` não importa de `modules/pricing`). O que é compartilhado por 2+ módulos sobe para `shared/`.
- **Controle de acesso é só por `USER.role`** (`admin_master`/`user`) **+ limite numérico do plano** (`max_products`/`max_marketplaces`), validado nos guards de `core/router` — sem granularidade por grupo/tela no MVP; não construir UI condicional por grupo/menu sem novo motivo de negócio.
- **Produto só vincula a marketplace conectado**: ao montar a UI de vínculo produto↔marketplace, a lista de marketplaces disponíveis vem sempre de `USER_MARKETPLACE` (conexões já feitas pelo usuário), nunca de `MARKETPLACE` direto.
- **Uma conta por marketplace por usuário**: a tela de conexão de marketplace não permite conectar um canal já conectado (reflete a unique `(user_id, marketplace_id)` do backend) — trata isso como validação de UI, não só espera o erro 422 do backend.
- **`PRODUCT_MARKETPLACE` é vínculo puro nesta rodada** (decisão 2026-08-26): sem `suggested_price`/`is_approximated` ainda — não construir tela de preço sugerido em cima dessa entidade; isso fica pra uma tela/tabela futura, ainda não desenhada.
- **Aplicação do preço sugerido é manual no MVP.** Não implementar botão de "aplicar automaticamente" via API do marketplace — o vendedor copia o valor e atualiza manualmente no canal.
- **1 login = 1 assinatura ativa.** Sem UI de conta compartilhada/multiusuário no MVP.
- **TypeScript `strict: true` sem exceção, nunca `any`** — payload realmente desconhecido usa `unknown` + narrowing explícito.
- **Todo código é em inglês, sem exceção** — componente, composable, variável, prop, emit, rota, nome de teste. Só prosa de documentação (`.md`) e diagramas de fluxo/jornada (`.mmd` do tipo `flowchart`) ficam em português — regra completa na seção "Convenção de idioma nos documentos" do `CLAUDE.md` raiz e seção 10 de `docs/infra/convencoes-frontend-infra.md`.
- **`docs/design/design-system.md` é obrigatório, sem exceção.** Nenhuma cor, espaçamento, raio, tamanho ou peso de fonte é hardcoded num componente — sempre via variável SCSS de `core/styles/_variables.scss` (`$color-primary`, `$spacing-16`, `$radius-8`...), que por sua vez são aliases das custom properties definidas em `core/styles/_tokens.scss`. Precisa de um valor que não existe na escala documentada? Ele está no export de origem (`docs/design/tokens/`) — traga o valor que falta, nunca invente um novo. Componente novo em `shared/components/ui/` ou `blocks/` entra na seção "Components" do design system no mesmo PR.

---

## Pontos em aberto (não bloqueiam, mas não implemente sem revalidar)

Ver seção 6 de `docs/negocio/contexto-plataforma-precificacao.md`: fluxo de recuperação de pagamento abandonado (hoje termina em churn simples, sem tela/e-mail de cobrança). `USER.group_id` já foi resolvido (removido do MVP — sem UI de grupo/menu), trial já foi resolvido (jornada sempre `ChoosePlan → Payment`, sem branch de teste gratuito na UI), token de SSO e credencial de marketplace em `USER_MARKETPLACE` já foram decididos (frontend nunca pede/exibe credencial de API de marketplace).

---

## Ao alterar o modelo de dados

Sempre que uma entidade, campo ou relacionamento mudar, atualize `docs/negocio/contexto-plataforma-precificacao.md` (seção 2 e o ERD embutido) e `docs/negocio/entidades-precificacao.mmd` juntos — os dois devem ficar idênticos no bloco do ERD. Isso inclui manter os tipos de `modules/<contexto>/types/` em sincronia com a mudança — na prática, rodar `npm run generate:api-types` depois de qualquer mudança de contrato no backend (seção 6 de `docs/infra/convencoes-frontend-infra.md`).

**Este repositório tem uma cópia desses docs.** O original/guarda-chuva do projeto (que também cobre o backend) vive em `/orbita/docs`, num repositório separado. O backend (`orbita.api`) também tem sua própria cópia. Ao mudar o modelo de dados ou regra de negócio aqui, replique a mudança nos outros dois lugares — não há automação entre os repos ainda, é sincronia manual.
