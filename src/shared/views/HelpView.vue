<script setup lang="ts">
/**
 * Central de Ajuda — pedido direto do usuário, 2026-09-03: guia passo a
 * passo com screenshots reais + texto de orientação, começando pela
 * jornada completa (empresa → conectar marketplace → cadastrar produto →
 * vincular produto ao marketplace → conferir precificação → praticar
 * preço), usando a Shopee como exemplo por ser o único marketplace com o
 * motor de precificação já validado (`docs/design/design-system.md`,
 * seção `ProductMarketplacePricingView`).
 *
 * Conteúdo é 100% estático (`public/guides/onboarding/shopee.json` +
 * screenshots na mesma pasta), sem chamada nenhuma à API do backend —
 * `useHelpGuide`/`fetchHelpGuide` (`shared/`) cuidam disso. Vive em
 * `shared/views/`, não em `modules/<contexto>/`, porque não mapeia pra
 * nenhum Bounded Context do backend — mesmo precedente de
 * `ShowcaseView.vue`/`PricingDashboardMockupView.vue`, views roteadas
 * sem dono de domínio único.
 *
 * **`public/guides/`, nunca `public/help/`** — bug real de produção,
 * 2026-09-03: a pasta estática nasceu como `public/help/onboarding/...`,
 * MESMO nome da rota `/help` (`core/router/index.ts`). O build da Vite
 * copia `public/` verbatim pra `dist/`, então isso virava uma pasta REAL
 * `dist/help/` — no F5 (nunca na navegação via SPA, que não passa pelo
 * nginx), `try_files $uri $uri/ /index.html;` (`docker/nginx.conf`)
 * encontrava esse diretório antes do fallback pro `index.html`, o nginx
 * disparava o PRÓPRIO redirect 301 (dono/exigindo barra final) — e como
 * esse container escuta numa porta interna (`listen 5173`, atrás do
 * Traefik/Dokploy), o `Location` desse redirect vazava a porta interna,
 * mandando o navegador pra um endereço não-público (loop de carregamento
 * infinito). Renomear pra `guides` elimina a colisão; `nginx.conf` também
 * ganhou `absolute_redirect off;` e `try_files` sem `$uri/` como defesa
 * contra qualquer colisão futura do mesmo tipo (ver `docker/nginx.conf`).
 *
 * Só existe UM guia hoje — `GUIDE_PATH` fixo, sem seletor de guia nem
 * rota parametrizada. Se um segundo guia (outro marketplace) aparecer,
 * generalizar pra `/help/:guideId` é a extensão natural; antecipar isso
 * agora seria abstração sem caso de uso real ainda.
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/shared/components/ui/Button.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import { useHelpGuide } from '@/shared/composables/useHelpGuide'

const GUIDE_PATH = '/guides/onboarding/shopee.json'

const { t } = useI18n()
const {
  currentIndex,
  currentStep,
  error,
  goTo,
  groupedSteps,
  guide,
  isFirst,
  isLast,
  isLoading,
  load,
  next,
  previous,
  steps,
} = useHelpGuide(GUIDE_PATH)

function groupLabel(key: string): string {
  return t(`help.groups.${key}`)
}

onMounted(load)
</script>

<template>
  <div class="help-view">
    <h1 class="help-view__title">{{ $t('help.title') }}</h1>

    <div v-if="isLoading" class="help-view__state">
      <Spinner :size="32" />
    </div>

    <div v-else-if="error" class="help-view__state">
      <p>{{ $t('help.loadError') }}</p>
      <Button variant="outline" @click="load">{{ $t('help.retry') }}</Button>
    </div>

    <template v-else-if="guide && currentStep">
      <p class="help-view__guide-title">{{ guide.title }}</p>
      <p class="help-view__guide-description">{{ guide.description }}</p>

      <div class="help-view__body">
        <nav :aria-label="$t('help.stepsNavLabel')" class="help-view__steps">
          <template v-for="group in groupedSteps" :key="group.key">
            <p class="help-view__group-label">{{ groupLabel(group.key) }}</p>
            <button
              v-for="step in group.steps"
              :key="step.id"
              :aria-current="step.index === currentIndex ? 'step' : undefined"
              :class="[
                'help-view__step-link',
                { 'help-view__step-link--active': step.index === currentIndex },
              ]"
              type="button"
              @click="goTo(step.index)"
            >
              <span class="help-view__step-number">{{ step.index + 1 }}</span>
              {{ step.title }}
            </button>
          </template>
        </nav>

        <div class="help-view__content">
          <p class="help-view__progress">
            {{ $t('help.stepProgress', { current: currentIndex + 1, total: steps.length }) }}
          </p>

          <div class="help-view__step-header">
            <h2 class="help-view__step-title">{{ currentStep.title }}</h2>
            <div class="help-view__nav-buttons">
              <Button :disabled="isFirst" variant="outline" @click="previous">
                {{ $t('help.previous') }}
              </Button>
              <Button :disabled="isLast" variant="primary" @click="next">
                {{ $t('help.next') }}
              </Button>
            </div>
          </div>
          <p class="help-view__step-description">{{ currentStep.description }}</p>

          <img
            :alt="$t('help.stepImageAlt', { title: currentStep.title })"
            class="help-view__image"
            :src="currentStep.image"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">

.help-view__title {
  margin-bottom: $spacing-8;
}

.help-view__state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-12;
  padding: $spacing-24 0;
}

.help-view__guide-title {
  margin-bottom: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
}

.help-view__guide-description {
  max-width: 640px;
  margin-bottom: $spacing-16;
  color: $color-ink-40;
}

.help-view__body {
  display: flex;
  flex-direction: column;
  gap: $spacing-24;

  @media (min-width: $breakpoint-md) {
    flex-direction: row;
    align-items: flex-start;
  }
}

.help-view__steps {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: $spacing-4;
  width: 100%;

  @media (min-width: $breakpoint-md) {
    width: 260px;
  }
}

.help-view__group-label {
  margin: $spacing-16 0 $spacing-4;
  font-size: $font-size-sm;
  color: $color-ink-40;

  &:first-child {
    margin-top: 0;
  }
}

.help-view__step-link {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-8;
  text-align: left;
  color: $color-ink;
  background-color: transparent;
  border-radius: $radius-8;

  &:hover {
    background-color: $color-ink-4;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &--active {
    color: $color-primary;
    background-color: $color-ink-4;
  }
}

.help-view__step-number {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: $size-20;
  height: $size-20;
  font-size: $font-size-sm;
  background-color: $color-ink-10;
  border-radius: $radius-80;
}

.help-view__content {
  flex: 1;
  min-width: 0;
}

.help-view__progress {
  margin-bottom: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

// Título + botões Anterior/Próximo na mesma linha, pedido direto do
// usuário — economiza uma linha inteira de altura (antes os botões
// ficavam embaixo do título, numa linha só deles).
.help-view__step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
  margin-bottom: $spacing-8;
}

.help-view__step-title {
  margin-bottom: 0;
}

.help-view__step-description {
  max-width: 640px;
  margin-bottom: $spacing-16;
  color: $color-ink-80;
}

.help-view__nav-buttons {
  display: flex;
  flex-shrink: 0;
  gap: $spacing-8;
}

// Pedido direto do usuário, 2026-09-03: título/descrição/botões ANTES da
// imagem, não depois (o usuário só via os botões depois de rolar a
// página) — resolvido reordenando o template E juntando título+botões
// numa linha só (`__step-header` acima). Com isso, a imagem já não
// precisa de nenhum limite de altura pra os botões ficarem visíveis —
// pedido explícito do usuário pra manter o tamanho original (largura
// total da coluna, altura natural da proporção da captura).
.help-view__image {
  display: block;
  width: 100%;
  margin-top: $spacing-16;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}
</style>
