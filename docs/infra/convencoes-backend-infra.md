# Convenções de Desenvolvimento — Backend & Infra

Plataforma SaaS de Precificação para Marketplace
Stack: Laravel (PHP) · DDD pragmático · Clean Arch (camadas) · Docker · Dokploy

Localização do projeto: raiz do repositório é `/orbita`; a aplicação Laravel inteira (tudo que este documento descreve — `app/`, `docker-compose.yml`, `Dockerfile` etc.) vive em `/orbita/backend`. Ver seção 11 para a stack técnica/versões consolidadas.

---

## 1. Princípios gerais

- **KISS**: prefira a solução mais simples que resolve o problema. Não abstraia "pra caso um dia precise".
- **DRY**: lógica de negócio duplicada em dois lugares é bug esperando pra acontecer. Se dois Use Cases fazem a mesma coisa, extraia um Service.
- **DDD pragmático**: Eloquent Model = entidade de domínio. Regra de negócio NUNCA vive no Model — vive em `Services` ou `Actions`.
- **Separação por contexto, não por tipo técnico**: o código é organizado por Bounded Context (`Pricing`, `Catalog`, `Billing`, `Identity`, `Platform`), não por "Models/Controllers/Requests" soltos na raiz.
- Toda decisão de negócio (`if` que importa) deve estar em uma classe testável isoladamente — nunca dentro de Controller ou Model.
- **Test-first**: regra de negócio (Domain Services, Value Objects, ramificação de Actions) só é escrita depois do teste que a exige existir e falhar primeiro. Ver seção 5.

---

## 2. Estrutura de pastas

```
app/
  Domain/
    <BoundedContext>/
      Models/          # Eloquent Models — SEM regra de negócio (só relations, casts, scopes simples)
      Enums/            # Enums nativos de negócio (status, role, type...) — seção 4
      ValueObjects/     # Money, PriceRange, SuggestedPrice, PercentageFee...
      Services/         # Regras de domínio puras (ex: PricingCalculator) — sem tocar em Eloquent quando possível
      Contracts/        # Interfaces de repositório/gateway externo — seção 3.6, obrigatório pra todo acesso a Model
      Policies/          # Policy de autorização do contexto (ex: UserPolicy) — resolvida pelo guesser padrão do Laravel, sem registro manual
      Exceptions/         # Exceptions de domínio (ex: NoPricingRuleAvailableException)
      Events/           # Domain Events (ex: PriceRecalculated, MarketplaceRuleUpdated)
      Listeners/         # Reage a eventos DE OUTRO contexto (ex: Platform escuta PriceOutOfMargin)
    Shared/              # Infra de domínio cross-context: Contracts/Enums/Models/Scopes/ValueObjects usados por
                          # mais de um Bounded Context (ex: CarriesApiMessage, ApiMessageKey, UserOwnedScope) —
                          # só sobe pra cá o que dois ou mais contextos realmente precisam, mesma régua do DRY
                          # do frontend (shared/): nunca criar aqui "por prevenção".

  Application/
    <BoundedContext>/
      Actions/          # 1 classe = 1 caso de uso. Entry point único: __invoke()
      DTOs/             # Objetos de transporte entre camadas (evitar passar array solto)

  Infrastructure/
    <BoundedContext>/
      Repositories/     # Implementação Eloquent das interfaces em Domain/Contracts — único lugar que chama Model:: direto
      External/         # Integrações externas (gateway de pagamento, API de marketplace)
      Jobs/             # Jobs de fila (ex: RecalculatePricesJob)

  Http/
    Controllers/Api/<BoundedContext>/
    Requests/<BoundedContext>/
    Resources/<BoundedContext>/
    Support/            # Utilitário HTTP cross-context, sem regra de negócio (ex: ApiResponse, QueryFilters)
    Middleware/

  Providers/            # Bindings de interface → implementação (Domain\Contracts → Infrastructure\Repositories)
```

Rotas seguem a mesma separação por Bounded Context — nunca todas misturadas num arquivo só:

```
routes/
  api.php              # domínio condicional + prefixo /v1 (infra de roteamento, não rota de negócio)
  api/
    v1.php             # índice: só dá require em cada arquivo abaixo, nenhuma rota direto aqui
    v1/
      identity.php     # rotas de Http/Controllers/Api/Identity
      billing.php       # rotas de Http/Controllers/Api/Billing
      catalog.php        # rotas de Http/Controllers/Api/Catalog
      pricing.php         # rotas de Http/Controllers/Api/Pricing
      platform.php         # rotas de Http/Controllers/Api/Platform
```

**Critério de escalonamento**: começa flat (um arquivo por contexto, como acima). Se um contexto crescer a ponto do arquivo ficar difícil de navegar (regra prática: por volta de 15–20 rotas, ou quando o contexto tiver módulos claramente distintos — ex: `Identity` com auth manual, SSO, recuperação de senha), esse arquivo vira pasta e quebra por módulo, sem sair da mesma convenção nem mudar o `require` no índice:

```
routes/api/v1/
  identity/
    auth.php       # em vez de identity.php
    sso.php
    password.php
```

Não vale a pena montar essa subdivisão adiantado, pra um contexto que ainda não tem rota nenhuma — mesmo critério de "reorganiza sem quebrar contrato, só quando o volume justificar" já usado pro `ApiMessageKey` (seção 5.5 abaixo cobre a mesma decisão pros arquivos `.http`).

**Bounded Contexts do projeto:**
| Contexto | Entidades |
|---|---|
| `Identity` | User, SsoAccount, PasswordReset |
| `Billing` | Plan, Subscription, Transaction |
| `Catalog` | Product, ProductLaunch |
| `Pricing` | Marketplace, PricingRule, UserMarketplace, ProductMarketplace |
| `Platform` | Notification, AuditLog, Settings |

**`/http` (raiz do repositório, fora de `app/`) não é a mesma coisa que `app/Http/`** — não confundir os dois pelo nome. `app/Http/` é a camada HTTP da arquitetura (Controllers/Requests/Resources/Middleware, ver seção 3.4 e acima). `/http` é o diretório dos arquivos `.http` do REST Client (VS Code), com a mesma organização por Bounded Context — ver seção 5.5. `routes/api/v1/<contexto>.php` fecha o mesmo padrão em três lugares: Controller, requisição manual (`.http`) e rota — todos organizados pelo mesmo Bounded Context, nunca por tipo técnico solto.

---

## 3. Regras por camada

### 3.1 Models (`Domain/<Contexto>/Models`)
- Permitido: `$fillable`/`$guarded`, `casts`, relations (`hasMany`, `belongsTo`...), scopes simples de query (`scopeActive`), accessors triviais de formatação.
- **Proibido**: cálculo de negócio, validação de regra (ex: "está dentro da margem?"), disparo de efeito colateral (envio de notificação, chamada externa).
- Todo Model com dado de usuário deve usar um **Global Scope** de ownership (ex: `UserOwnedScope`) para evitar vazamento de dados entre usuários — nunca confiar em lembrar o `WHERE user_id = ?` manualmente em cada query.

### 3.2 Value Objects (`Domain/<Contexto>/ValueObjects`)
- Imutáveis (`readonly` properties, PHP 8.1+).
- Sempre que um valor tiver regra de validação ou formatação própria (dinheiro, percentual, faixa de preço), vira Value Object — não fica solto como `float`/`string` primitivo circulando pelo sistema.
- Exemplo mínimo: `Money`, `PriceRange`, `SuggestedPrice`.

### 3.3 Services (`Domain/<Contexto>/Services`)
- Contêm regra de domínio pura, idealmente sem dependência de Eloquent/banco (recebem e devolvem VOs/dados primitivos).
- Devem ser 100% testáveis via unit test, sem `RefreshDatabase`.
- Exemplo: `PricingCalculator::calculate(purchasePrice, PricingRule[]): SuggestedPrice`.

### 3.4 Actions (`Application/<Contexto>/Actions`)
- Um caso de uso = uma classe = um método `__invoke()`.
- Orquestra: valida entrada (via Request/DTO), chama Services de domínio, **persiste/lê via Repository (nunca `Model::` estático direto — ver seção 3.6)**, dispara Events.
- Controllers **não têm lógica** — só chamam a Action e devolvem a Resource.
- Nomeação: verbo + substantivo no infinitivo, ex.: `CalculateSuggestedPriceAction`, `LinkProductToMarketplaceAction`, `SubscribeToPlanAction`.
- **Sempre uma classe explícita por verbo/entidade, mesmo pro CRUD mais trivial (ex: `CreatePlanAction`, `DeletePlanAction`) — nunca uma Action genérica reutilizada em runtime por vários tipos de recurso.** Decisão tomada com você ao planejar a rodada de CRUDs de `docs/api/mapeamento-cruds.md` (repositório `backend`): o "boilerplate" que dá pra abusar fica nas camadas de baixo (Repository, seção 3.6; Policy, seção 3.7), não na Action — cada Action continua achável pelo nome e testável isoladamente, sem duas categorias de Action (genérica vs. dedicada) pra quem lê o código ter que aprender.

### 3.5 Domain Events & Listeners
- Comunicação **entre contextos** é sempre via Event, nunca chamada direta de Service de outro contexto.
- Exemplo: `Pricing` dispara `MarketplaceRuleUpdated` → `Pricing\Listeners` reage recalculando preços → dispara `PriceOutOfMargin` se aplicável → `Platform\Listeners` escuta e cria `Notification`.
- Eventos que disparam trabalho pesado (recálculo em lote) devem ser processados via **Queue** (`ShouldQueue`), nunca síncrono no request.

### 3.6 Repositories/Contracts
- **Toda Action que lê ou persiste dado via Eloquent faz isso através de um Repository — nunca `Model::query()`/`Model::create()`/`Model::find()`/etc. chamado direto dentro de `Application/<Contexto>/Actions`.** Isso vale mesmo quando existe só uma implementação hoje e nenhum teste precisa mockar: o objetivo não é permitir troca futura de banco, é isolar o acesso a dado da camada de aplicação — é a fronteira que separa DDD pragmático de "Eloquent solto por todo lugar".
- Interface em `Domain/<Contexto>/Contracts/<Entidade>RepositoryInterface`, implementação Eloquent em `Infrastructure/<Contexto>/Repositories/Eloquent<Entidade>Repository` — os dois nomes já saem prontos da estrutura de pastas da seção 2, não é opcional criar só quando "surgir necessidade".
- Bind de interface → implementação sempre em `Providers/` (método `register()`), nunca resolvido manualmente com `new` dentro de Action.
- Repository pode expor `Illuminate\Database\Eloquent\Builder` quando a Action ainda precisa compor filtro/ordenação genérico (ex: listagem paginada via `Http/Support/QueryFilters`) — o que esta regra proíbe é a Action referenciar a **classe do Model** diretamente (`Plan::query()`, `User::create()`), não o tipo `Builder` em si.
- **Base genérica pra CRUD simples, decidida ao planejar a rodada de `docs/api/mapeamento-cruds.md`** (repositório `backend`; perfil de usuário, telas admin, telas de usuário — vários Repositories com a mesma forma: `find`/`findOrFail`/`query`/`create`/`update`/`delete`, zero regra de negócio): `Domain/Shared/Contracts/CrudRepositoryInterface` (`find(string $id): ?Model`, `findOrFail`, `query(): Builder`, `create(array $attributes): Model`, `update(Model $model, array $attributes): Model`, `delete(Model $model): void`) + `Infrastructure/Shared/Repositories/EloquentCrudRepository` (classe abstrata implementando os 5 métodos em cima de um `modelClass(): string` abstrato). Repository concreto de uma entidade sem necessidade especial vira só `extends EloquentCrudRepository implements <Entidade>RepositoryInterface { protected function modelClass(): string { return <Entidade>::class; } }` — a interface específica da entidade (`Domain/<Contexto>/Contracts/<Entidade>RepositoryInterface`) continua existindo e sendo o que a Action injeta, só que agora pode `extends CrudRepositoryInterface` em vez de redeclarar os 5 métodos. Um Repository com necessidade real além do CRUD básico (ex: `PlanRepositoryInterface::activeQuery()`) declara o método extra na sua própria interface e implementação, sem abrir mão da base genérica pro resto.
- Essa base é só pra Repository — não existe equivalente pra Action (seção 3.4) nem pra Controller/Request/Resource, que continuam um por entidade. `Request`/`Resource` não genericizam porque o Scramble (seção 10) depende do tipo concreto pra inferir o schema OpenAPI — uma classe genérica ali quebraria a documentação automática.

### 3.7 Policies (`Domain/<Contexto>/Policies`)
- Resolvidas pelo *guesser* padrão do Laravel (Model → Policy por convenção de nome), sem registro manual — confirmado na tarefa 11 de `docs/api/ordem-de-implementacao.md` (repositório `backend`).
- **Base compartilhada pra "dono ou admin_master"**, o caso mais comum em toda a rodada de CRUD de `docs/api/mapeamento-cruds.md` (usuário só mexe no próprio registro, `admin_master` mexe em qualquer um): `Domain/Shared/Policies/OwnerOrAdminPolicy` (trait ou classe base, a decidir na implementação) com os métodos padrão (`view`/`update`/`delete`) já resolvendo `$user->id === $model->user_id || $user->role === UserRole::AdminMaster`. Policy concreta de uma entidade só declara métodos além disso quando a regra realmente for diferente do padrão (ex: uma ação que só o dono pode fazer, nunca o admin).

---

## 4. Convenções de código PHP/Laravel

- **Idioma: todo identificador de código é em inglês, sem exceção** — classe, método, variável, propriedade, coluna/tabela do banco, rota, nome de teste (`it('...')`/nome de método de teste), mensagem de exception interna (a que vai pro log, não a que vai pro cliente via `ApiMessageKey`). Só prosa de documentação (`.md`) e diagrama de fluxo/jornada (`.mmd` `flowchart`) ficam em português — ver seção de convenção de idioma do `CLAUDE.md` raiz.
- PSR-12 obrigatório (formatação via Pint, já incluso no Laravel: `./vendor/bin/pint`).
- Strict types em todo arquivo novo: `declare(strict_types=1);`.
- Type hints e return types obrigatórios em métodos públicos.
- Nomeação:
  - Classes: `PascalCase`.
  - Métodos/variáveis: `camelCase`.
  - Tabelas do banco: `snake_case`, plural (`product_marketplaces`).
  - Rotas de API: `kebab-case`, versionadas via subdomínio + prefixo `/v1` (`api.meudominio.com/v1/user-marketplaces`) — detalhe completo nos docs de implementação de API do repositório `backend` (`docs/api/`, não replicados aqui).
- Migrations: uma responsabilidade por migration. Nunca editar migration já mergeada em `main` — criar nova.
- Enums de negócio (ex: `status` de `Subscription`, `type` de `Notification`) sempre como **PHP Enum** nativo (8.1+), nunca string solta comparada por `===`.
- Nunca usar Facades (`DB::`, `Auth::`) dentro de Domain Services — só em Controllers/Actions/Infrastructure, se necessário. **Exceção explícita**: `Domain/<Contexto>/Scopes` (Global Scope do Eloquent, ex: `UserOwnedScope`) pode usar `Auth::` — a assinatura de `Scope::apply()` é fixada pela interface do Eloquent, não passa por injeção de construtor via container, e não existe alternativa sem Facade pra ler o usuário autenticado ali. Isso é Scope, não Service — a restrição desta linha nunca cobriu essa pasta, deixado explícito aqui só pra não gerar dúvida de novo.

---

## 5. Testes — Test-First (TDD)

**Regra do time: nenhuma linha de regra de negócio é escrita antes do teste que a exige.** Isso vale para `Domain/Services`, `ValueObjects` e `Application/Actions` — é onde mora a lógica que justifica o projeto. Não é opcional nem "quando der tempo".

### 5.1 Fluxo obrigatório (red → green → refactor)

1. **Red**: escreve o teste (unit ou feature) descrevendo o comportamento esperado, ainda sem implementação — roda e vê falhar. Se o teste passa de cara, ele não testa nada de novo.
2. **Green**: escreve o mínimo de código para o teste passar. Nada de adiantar funcionalidade que o teste não pede.
3. **Refactor**: com o teste verde como rede de segurança, limpa a implementação (extrai método, renomeia, remove duplicação) sem mudar comportamento.

Isso vale como critério de PR: **PR sem teste correspondente ao commit de regra de negócio é rejeitado na revisão**, não só "recomendado".

### 5.2 O que é test-first obrigatório vs. o que pode vir depois

| Camada | Test-first? | Motivo |
|---|---|---|
| `Domain/Services` (ex: `PricingCalculator`) | **Sim, sempre** | É a regra de negócio central — cada faixa/edge case (limite de faixa, valor zero, marketplace sem regra) deve nascer de um teste antes do código. |
| `ValueObjects` (ex: `Money`, `PriceRange`) | **Sim, sempre** | Validação/invariante do VO é regra, mesma lógica do item acima. |
| `Application/Actions` | **Sim, para o caminho de decisão** (ex: limite de plano atingido, produto já vinculado) | O "encanamento" (chamar repositório, devolver DTO) pode vir junto, mas toda ramificação de negócio nasce de um teste de caso. |
| `Http/Controllers`, `Requests`, `Resources` | Teste depois é aceitável | É camada de contrato HTTP, não decisão de negócio — mas ainda precisa de feature test antes do merge (só não precisa ser escrito primeiro). |
| `Infrastructure/Repositories` | Teste depois é aceitável | Implementação de acesso a dado, coberta indiretamente pelo feature test da Action. |

### 5.3 Tipos de teste

| Tipo | Camada alvo | Banco? |
|---|---|---|
| Unit | `Domain/Services`, `ValueObjects` | Não |
| Feature | `Application/Actions` (ponta a ponta) | Sim (`RefreshDatabase`) |
| Feature/HTTP | `Controllers` (contrato da API) | Sim |

- Prioridade de cobertura: **Services de domínio primeiro** (mais barato, mais valioso — é onde mora a regra de negócio).
- Não mockar o Eloquent excessivamente; teste de integração leve com SQLite in-memory ou banco de teste é mais honesto.
- Toda Action de escrita (create/update/delete) precisa de pelo menos 1 feature test de caminho feliz + 1 de caminho de erro/validação — escritos **antes** da implementação da ramificação que testam.
- Casos de borda de precificação (faixa exata no limite, valor abaixo da menor faixa, marketplace sem `PricingRule` cadastrada) são o exemplo canônico de "escreve o teste primeiro" — é onde bug silencioso custa dinheiro real do vendedor.

### 5.4 CI / gate

- Pipeline de CI roda `pint --test` + suíte completa em todo PR; merge bloqueado se algo falhar.
- Cobertura não é a métrica principal (não perseguir "100%"), mas **todo Domain Service e Action nova precisa ter teste correspondente no mesmo PR** — ausência é motivo de review request, não sugestão.

### 5.5 Testes manuais via REST Client (`/http`)

Complementar aos testes automatizados acima (que continuam sendo o único gate real de CI/PR) — toda rota nova também ganha uma requisição correspondente em `/http`, na raiz do repositório.

- **Um arquivo por Bounded Context**, nome em minúsculo batendo com o contexto: `http/identity.http`, `http/billing.http`, `http/catalog.http`, `http/pricing.http`, `http/platform.http` — mesma organização por Bounded Context que já é regra pra `app/Domain`, `app/Application` e `app/Http/Controllers/Api` (seção 2). Se um contexto crescer a ponto do arquivo ficar difícil de navegar, quebra em subpasta (`http/identity/auth.http`, `http/identity/sso.http`) sem sair da mesma convenção.
- **Nunca escrever requisição pra rota que ainda não existe.** Requisição sem endpoint real por trás é ruído, não documentação — mesma régua de "não deixe o código divergir da documentação" já citada neste projeto.
- Toda rota de escrita nova (`store`/`update`/`delete`) e toda rota nova de leitura (`index`/`show`) ganham sua requisição no arquivo do contexto correspondente no mesmo PR que introduz a rota — não é gate de CI (REST Client não roda em pipeline), é convenção de review, no mesmo espírito do que já vale pra teste automatizado.
- Config compartilhada: `.vscode/settings.example.json` (committável — ambientes `local`/`staging`/`production`) vira `.vscode/settings.json` (cópia local de cada dev, fora do git) — mesma lógica do `.env`/`.env.example` do projeto. Extensão recomendada via `.vscode/extensions.json` (`humao.rest-client`).
- **Variáveis repetidas em toda requisição ficam no `rest-client.environmentVariables` do settings, nunca redeclaradas por arquivo** (`@baseUrl = ...` no topo de cada `.http`, por exemplo): `baseUrl` (raiz, sem versão — pra rotas fora do `/v1`, tipo `sanctum/csrf-cookie`), `apiBase` (`{{baseUrl}}/v1`, a maioria das rotas), `xsrfToken` (cookie `XSRF-TOKEN` decodificado de URL, pra header `X-XSRF-TOKEN` em requisição autenticada por cookie — precisa ser atualizado manualmente no settings sempre que a sessão rotacionar, ex: depois de um login/register). Um arquivo `.http` só declara `@variável` local pra algo específico dele mesmo, nunca pra algo que outro arquivo do contexto também vai precisar.
- **Isso não substitui o teste automatizado, nem é TDD** — não tem red/green/refactor aqui, é validação manual/exploratória contra uma instância real (local/staging) e documentação viva do contrato HTTP de verdade (dá pra ver o envelope `ApiResponse` e o `ApiMessageKey` retornados numa resposta real, não só no exemplo do doc). O que garante correção e trava merge continua sendo Pest (seção 5.4).

---

## 6. Multi-tenancy / Segurança

- Modelo é single-tenant por usuário (`user_id` em quase todas as entidades), **não** multi-tenant com isolamento de schema.
- Toda query de leitura em dado de usuário passa por Global Scope de ownership — nunca `Model::find($id)` puro em dado sensível vindo de request externo; sempre escopado (`$user->products()->findOrFail($id)`).
- Rate limiting em rotas de autenticação e webhooks de pagamento.
- `AUDIT_LOG` é gravado via Listener em Actions sensíveis (mudança de plano, exclusão de produto, configuração de marketplace) — não espalhar `AuditLog::create()` manualmente em cada Action; centralizar via Event.

---

## 7. Git / Fluxo de trabalho

- Branches: `feature/<contexto>-<descricao>`, `fix/<contexto>-<descricao>`, `hotfix/<descricao>`.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, `test:`, `chore:`.
- PR obrigatoriamente referencia o Bounded Context afetado no título (ex: `feat(pricing): calcula faixa de comissão por marketplace`).
- Pint + testes rodando localmente (ou via pre-commit hook) antes de abrir PR.

---

## 8. Infraestrutura — Docker & Dokploy

### 8.1 Containers (docker-compose)

| Serviço | Papel |
|---|---|
| `app` | PHP-FPM + Laravel (imagem própria, multi-stage build) |
| `nginx` | Reverse proxy / servidor do PHP-FPM e dos estáticos do frontend |
| `postgres` (ou `mysql`) | Banco relacional principal |
| `redis` | Cache, filas (`queue`), rate limiting |
| `queue-worker` | Container separado rodando `php artisan queue:work` (não dividir responsabilidade com `app`) |
| `scheduler` | Container/cron rodando `php artisan schedule:run` a cada minuto |

- Build multi-stage: estágio de build (composer install, npm build do frontend) separado do estágio de runtime (imagem final enxuta, sem ferramentas de dev).
- Variáveis sensíveis (`.env`) nunca commitadas — gerenciadas via variáveis de ambiente do Dokploy.
- Healthcheck obrigatório no container `app` (endpoint `/up` do Laravel 11+).

### 8.2 Dokploy

- Um projeto Dokploy por ambiente (`staging`, `production`), nunca compartilhar banco entre ambientes.
- Deploy via Git push → build automático (Dokploy detecta `docker-compose.yml` ou Dockerfile).
- Migrations rodam como **etapa de release** (comando executado antes do container `app` receber tráfego), nunca automaticamente dentro do boot do container em produção sem controle.
- Logs centralizados: `storage/logs` não deve crescer indefinidamente dentro do container — configurar log driver para stdout (Dokploy/Docker já coleta) em produção. Ver seção 9 para o pipeline completo de coleta/consulta/alerta.
- Backup de banco agendado fora do container da aplicação (job separado ou recurso nativo do Dokploy/VPS).

### 8.3 Ambientes

- `local`: **sempre via `docker-compose` próprio** (sem Laravel Sail) — mínimo `app` (PHP-FPM) + `postgres`; `redis`/`queue-worker`/`scheduler` sobem conforme a feature em desenvolvimento precisar deles. Não rodar `php artisan serve` nativo direto no host: o objetivo é que o ambiente local já rode na mesma imagem/Dockerfile que staging/produção, evitando "funciona na minha máquina" por divergência de extensão PHP ou versão.
- `staging`: espelha produção, usado para validar antes do deploy final; dados sintéticos, nunca dados reais de cliente.
- `production`: sem acesso de debug (`APP_DEBUG=false` sempre), `APP_ENV=production`.

---

## 9. Observabilidade — Logs, erros e alertas

Escopo do MVP: **logs pesquisáveis + visibilidade de erro 500 + alerta no Discord**. Sem exception tracking com agrupamento automático (tipo Sentry) por enquanto — reavaliar se o volume de erro justificar (ver 9.5).

### 9.1 Pipeline

```
Laravel (app container)
  → loga em JSON estruturado no stdout
  → Promtail (container leve) lê os logs via Docker
  → envia pro Loki
  → Grafana consulta o Loki (dashboards + Alerting)
  → Alerting dispara notificação no Discord via webhook
```

### 9.2 Containers novos (docker-compose)

| Serviço | Papel |
|---|---|
| `loki` | Armazena e indexa os logs. Storage local em disco na VPS neste estágio (sem object storage). |
| `promtail` | Lê os logs dos containers Docker (via socket montado) e envia pro Loki. Praticamente zero config. |
| `grafana` | Já existente — consulta o Loki como datasource e concentra dashboards + Alerting. |

### 9.3 Logging no Laravel

- Log de exception: usar o `Handler`/`bootstrap/app.php` (Laravel 11) para garantir que toda exception não tratada seja logada em `level: error`, formato JSON, incluindo: `timestamp`, `level`, `message`, `exception_class`, `trace`, `request_id`, `route`, `status_code`, `user_id` (se autenticado).
- Log de request de API: middleware dedicado (`Http/Middleware/LogApiRequest`) registrando `method`, `route`, `status_code`, `duration_ms`, `user_id` — mesmo formato JSON, mesmo canal.
- Configurar o driver de log (`config/logging.php`) para escrever em `stderr`/`stdout` com formatter JSON em produção — nunca em arquivo dentro do container (reforça a regra já citada em 8.2).
- **Não logar dado sensível**: nunca logar senha, token, payload completo de cartão/pagamento. Campos sensíveis do request devem ser mascarados antes de entrar no log (Laravel já tem suporte a isso na config de logging/exception).
- `request_id` (correlation id) gerado por middleware no início do request e propagado em todo log daquele ciclo — é o que permite, no Grafana, filtrar "todos os logs desse request específico" quando um erro 500 acontece.

### 9.4 Grafana — dashboards e alertas

- Dashboard mínimo do MVP:
  - Contagem de `level=error` por período (painel de série temporal).
  - Tabela com últimos erros (`timestamp`, `route`, `status_code`, `message`, `request_id`).
  - Taxa de erro por rota (`status_code >= 500` agrupado por `route`).
- Alerta: regra no Grafana Alerting disparando quando a contagem de `level=error` ultrapassar um threshold numa janela (ex: >5 em 5 min) — ajustar o número depois de observar o baseline real em produção.
- Contact point Discord: configurado via **provisioning** (arquivo YAML montado no container do Grafana em `/etc/grafana/provisioning/alerting/`), não manualmente pela UI — garante que o alerta já existe configurado em todo ambiente novo, sem passo manual esquecido.
  ```yaml
  apiVersion: 1
  contactPoints:
    - orgId: 1
      name: discord-erros-api
      receivers:
        - uid: discord-erros-api
          type: discord
          settings:
            url: "${GRAFANA_DISCORD_WEBHOOK_URL}" # variável de ambiente, nunca hardcoded
            message: |
              **{{ .Status | toUpper }}** — {{ .GroupLabels.alertname }}
              {{ range .Alerts }}> {{ .Annotations.summary }}{{ end }}
            use_discord_username: true
  ```
- Webhook URL do Discord é secret — vem de variável de ambiente do Dokploy, nunca commitada no repositório.

### 9.5 Caminho de evolução (fora do escopo do MVP)

Se o volume de erro crescer e faltar agrupamento/dedup automático de exception (mesmo erro ocorrendo centenas de vezes deveria virar "1 issue", não centenas de linhas de log), avaliar adicionar **GlitchTip** (self-hosted, protocolo compatível com Sentry, SDK `sentry/sentry-laravel`) como consumidor adicional do mesmo pipeline de exceptions — não exige retrabalho no que já foi implementado aqui, é uma peça a mais, não uma substituição.

---

## 10. Documentação de API — OpenAPI/Swagger

Ferramenta: **Scramble** (`dedoc/scramble`). Diferente do L5-Swagger, ele não usa anotação PHPDoc manual — infere o schema OpenAPI direto do código (`Http/Requests` para parâmetros/validação, `Http/Resources` para o shape da resposta, type hints das rotas/Controllers). Isso mantém a doc acoplada ao código real e reduz o risco de divergência, no mesmo espírito da regra "não deixe o código divergir da documentação" já citada neste projeto.

### 10.1 Instalação e convenção

- `composer require dedoc/scramble`. UI fica disponível por padrão em `/docs/api`.
- Como o schema é inferido, o pré-requisito é seguir as convenções já definidas na seção 3: toda rota de API passa por um `FormRequest` tipado (nunca `Request` genérico) e retorna sempre um `Http/Resources/<Contexto>` tipado (nunca `response()->json()` solto ou array cru) — sem isso, Scramble não tem o que inferir e o schema fica incompleto.
- Quando o schema não é inferível a partir do código (ex: parâmetro de query sem `FormRequest`, exemplo de valor específico), usar os atributos PHP do próprio Scramble (`#[QueryParameter]`, `#[BodyParameter]`, `#[Example]`) direto no método do Controller — é a exceção, não a regra; a maioria dos endpoints não deve precisar disso.
- Toda rota nova em `Http/Controllers/Api/<BoundedContext>` precisa aparecer documentada automaticamente; se não aparecer ou aparecer incompleta na UI, é sinal de que o Controller está fora da convenção (Request/Resource ausente ou mal tipado) — corrigir a causa, não documentar manualmente por cima.
- **`config/scramble.php` precisa ser publicado e o `api_path` ajustado pra `'v1'`** (`php artisan vendor:publish --tag=scramble-config`) — o default do pacote é `'api'`, que não bate com a convenção deste projeto (`apiPrefix: ''` em `bootstrap/app.php`, rotas reais em `/v1/...`, seção 1 de `fundamentos-api.md`). **Achado real**: instalado desde cedo no projeto mas nunca configurado — `/docs/api.json` respondia `200` com `paths: {}` vazio (nenhuma das rotas reais aparecia, UI carregava mas sem conteúdo), só percebido quando alguém checou o schema de verdade, não só se a página abria. `api_domain` também setado pra `env('API_DOMAIN')`, mesma env var que `routes/api.php` já usa pro domínio condicional de staging/produção.

### 10.2 Ambientes e acesso

- `/docs/api` habilitado em `local` e `staging` sem restrição.
- Em `production`, protegido — gate via middleware de auth (`admin_master`) ou desabilitado por config (`SCRAMBLE_ENABLED=false` via env do Dokploy), nunca exposto publicamente sem autenticação.
- **Achado real**: a própria middleware padrão do Scramble (`RestrictedDocsAccess`) já implementa esse gate — mas só libera sozinha quando `app()->environment('local')`; qualquer outro ambiente (inclusive `staging`) exige um Gate chamado `viewApiDocs` que **não existe por padrão** — sem defini-lo, `staging` também vira `403`, contrariando esta seção. Definido em `AppServiceProvider::boot()`: `Gate::define('viewApiDocs', fn (?User $user) => app()->environment('staging') || $user?->role === UserRole::AdminMaster)`. Testado nos três ambientes (`staging` sempre libera, `production` só com `admin_master`) em `tests/Feature/Platform/ViewApiDocsGateTest.php`.

### 10.3 Query params sem `FormRequest` e envelope de erro compartilhado

- **Query params documentados via `FormRequest`, exceto quando não existe um** (ex: `PlanController::index`, que recebe `Request` cru pra `Http/Support/QueryFilters` — seção 7 de `fundamentos-api.md`). Nesse caso, usa os atributos `#[QueryParameter(...)]` do próprio Scramble direto no método do Controller — a exceção já prevista acima (seção 10.1), não regra nova. **Fica em sincronia manual** com o `sortable`/`filterable` reais da Action correspondente, não é derivado automaticamente.
- **`items` de listagem paginada precisa de override manual** — `ApiResponse::paginated()` devolve `LengthAwarePaginator<int, mixed>` (o PHP não tem generics de verdade), então o Scramble não consegue seguir estaticamente que `items` é um array de `PlanResource` depois do `->through(...)`. Corrigido com `#[Response(type: 'array{success: bool, message: string, data: array{items: PlanResource[], meta: array{...}}, errors: null}')]` no método do Controller — mesmo atributo, aceita qualquer "array shape" do PHPStan como string. Repete esse padrão pra todo endpoint de listagem novo.
- **Achado real, sistêmico**: as `ExceptionToResponseExtension` nativas do Scramble (que geram os componentes compartilhados `components.responses.AuthenticationException`/`AuthorizationException`/`ValidationException`/`NotFoundHttpException`, referenciados via `$ref` em toda rota que pode devolver `401`/`403`/`422`/`404`) descrevem o formato de erro **delas** (`{message, errors}`), não o `ApiResponse::error()` real do projeto (`{success, message, data, errors}`). Não dá pra corrigir via `config('scramble.extensions')`/`Scramble::registerExtension()` — as duas só **anexam** ao fim da lista nativa, e a primeira extension que casa com o tipo da exception vence, então uma extension nossa registrada assim nunca seria chamada. Corrigido reescrevendo os componentes já gerados via `Scramble::afterOpenApiGenerated()` (hook de pós-processamento do documento inteiro) em `AppServiceProvider::boot()` — como são `$ref` compartilhados, uma correção em `components.responses.*` conserta toda rota que os referencia de uma vez.
- **Achado real: nenhuma rota documentava autenticação.** `security_strategy` nativo do Scramble (`config/scramble.php`) assume Bearer token por padrão — não bate com a decisão #7 (cookie httpOnly + header CSRF, nunca token). Corrigido registrando dois `SecurityScheme` do tipo `apiKey` manualmente, mesmo hook `afterOpenApiGenerated`: `cookieAuth` (`in: cookie`, `orbita-session`) e `csrfToken` (`in: header`, `X-XSRF-TOKEN`). `cookieAuth` só entra nas rotas que **realmente** têm `auth:sanctum` — checado contra `Route::getRoutes()` de verdade (não lista hardcoded, nunca diverge se uma rota ganhar/perder a middleware). `csrfToken` entra em todo método que não seja `GET`/`HEAD` (mesma regra de `PreventRequestForgery::isReading()`), **exceto** rotas de webhook (`AppServiceProvider::WEBHOOK_ROUTES`, hoje só `POST /billing/webhooks/mercadopago`) — essas nunca são "stateful" de verdade (quem chama é o Mercado Pago, autenticado por assinatura HMAC própria, não por sessão/CSRF), documentar CSRF ali seria enganoso; sem sinal de middleware pra detectar isso automaticamente, fica em sincronia manual. **Achado colateral durante a implementação**: `$path->path` do Scramble não tem `/` inicial (`"auth/register"`, não `"/auth/register"`) — quebrou o match contra `Route::uri()` (que também não tem barra) na primeira tentativa.

---

## 11. Stack técnica e dependências

Decisões fechadas sobre linguagem, banco e bibliotecas. Qualquer lib nova fora dessa lista precisa passar por essa mesma discussão antes de entrar no `composer.json` — não adicionar dependência "de passagem" durante uma feature.

### 11.1 Core

| Item | Escolha | Observação |
|---|---|---|
| Linguagem | PHP 8.5 | Local e container usam a mesma versão (ver 11.3) — evita divergência de comportamento entre dev e produção. |
| Framework | Laravel (última estável no momento do `laravel new`) | |
| Banco | PostgreSQL | Preferido a MySQL por tipos `DECIMAL`/`NUMERIC` mais previsíveis (crítico em cálculo de preço) e enum/JSON nativos mais robustos. |
| Testes backend | Pest | Roda sobre PHPUnit — sintaxe mais enxuta, casa melhor com o volume de TDD exigido na seção 5. |
| Cache/fila/rate limit | Redis via extensão `phpredis` | Mais rápido que `predis/predis` puro PHP; extensão nativa vai dentro da imagem Docker (seção 11.3). |

### 11.2 Bibliotecas por necessidade de domínio

| Necessidade | Lib | Por quê |
|---|---|---|
| PK em UUID (todo o ERD) | `HasUuids` (trait nativo do Laravel) | Sem pacote externo — já vem no framework. |
| Auth de API (SPA Vue separada) | Laravel Sanctum | Mais leve que Passport; não precisamos de OAuth server completo, só token/cookie de sessão pra SPA. |
| Login social (`SSO_ACCOUNT`: google, microsoft) | Laravel Socialite + `socialiteproviders/microsoft` | Google já vem no Socialite core; Microsoft precisa do provider da comunidade. |
| Gateway de pagamento (`TRANSACTION.gateway`, `SUBSCRIPTION`) | Mercado Pago — SDK oficial `mercadopago/dx-php` | Decisão de mercado (Pix/boleto/cartão nativos, público BR). Webhook de confirmação de pagamento cai em `Infrastructure/Billing/External`. |
| Documentação OpenAPI | `dedoc/scramble` | Ver seção 10 — infere schema do código, não usa anotação manual. |
| Controle de acesso | **Nenhuma lib** — só `USER.role` (`admin_master`/`user`) + limite numérico do plano validado na Action | MVP não tem granularidade de tela por grupo/plano (decisão registrada na seção 6 do contexto) — `spatie/permission` resolveria um problema que não existe hoje. |
| Enum de negócio (`status`, `type`) | PHP Enum nativo + cast do Eloquent | Já é regra da seção 4 — nunca string solta comparada por `===`. |
| Money/percentual (`Money`, `PriceRange` VOs) | Sem lib externa por padrão — VO próprio sobre `decimal`/`bcmath` | Reavaliar `brick/money` só se a aritmética de VO própria começar a acumular bug de arredondamento. |

### 11.3 Ambiente local e versões de ferramenta

- **PHP**: atualizar o host de PHP 8.4 → **8.5** (repo `ondrej/php` via PPA já configurado no host; pacote `php8.5` disponível). PHP local existe só pra rodar `composer`/`laravel new`/tooling de IDE — a aplicação em si **nunca roda via PHP nativo do host**, sempre dentro do container (ver 8.3).
- **Composer**: manter sempre na versão mais recente da série 2.x (`composer self-update`).
- **Laravel Installer**: instalado global via Composer (`composer global require laravel/installer`), com `~/.config/composer/vendor/bin` no `PATH` — usado uma única vez para o `laravel new backend`, depois disso todo `composer`/`artisan` do dia a dia roda dentro do container (`docker compose exec app ...`), não no host.
- **Dockerfile** (`/orbita/backend/Dockerfile`): multi-stage, `php:8.5-fpm` como base do estágio de runtime, extensões alinhadas com o que a aplicação usa (`pdo_pgsql`, `redis`, `bcmath`, `intl`, `zip`, `gd`) — build separado do `composer install`/`npm build` do estágio anterior (regra já citada em 8.1).
- **docker-compose local** (`/orbita/backend/docker-compose.yml`): mínimo viável pra dev é `app` (build do Dockerfile) + `postgres`; demais serviços (`redis`, `queue-worker`, `scheduler`, `nginx`) entram conforme a feature em desenvolvimento exigir — não subir tudo de uma vez só porque existe no compose de produção.
