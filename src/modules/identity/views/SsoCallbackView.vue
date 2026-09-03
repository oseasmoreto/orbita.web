<script setup lang="ts">
/**
 * Relay do callback OAuth — Google redireciona o browser DIRETO pro
 * FRONTEND nesse path exato (`GOOGLE_REDIRECT_URI` real, `../backend/.env`:
 * `http://localhost:5173/v1/auth/sso/google/callback`), nunca pro backend
 * (`http://localhost:8000/v1/...`) — só o domínio do front está autorizado
 * no console do Google neste ambiente (achado real, confirmado lendo o
 * `.env` do backend, não assumido).
 *
 * Esta tela não é um destino de verdade — existe só pra repassar a query
 * string exata (`code`/`state`/`scope`/...) pro endpoint real do backend
 * (`SsoController::callback`, mesmo path, `VITE_API_BASE_URL`), via
 * NAVEGAÇÃO DE PÁGINA INTEIRA (`window.location.href`, nunca fetch/axios):
 * o backend valida o `state` (proteção CSRF do OAuth) contra a sessão
 * criada no passo `/redirect` original — isso só funciona com uma
 * navegação top-level de verdade (cookie `SameSite=Lax` vai junto); um
 * fetch/XHR cross-origin não carregaria esse cookie do mesmo jeito, e
 * ainda esbarraria em CORS pra um redirect com `Set-Cookie`.
 *
 * O backend então processa o código com o provider, cria a sessão
 * (cookie httpOnly) e redireciona de novo — sempre pra raiz do
 * `FRONTEND_URL` (`../backend/.env`), sem path/query nenhum. Dali, o
 * guard de rota (`core/router/guards.ts`) faz o bootstrap normal
 * (`GET /auth/me`) e o usuário cai autenticado no dashboard.
 *
 * **Gap real, documentado em `docs/planejamento/plano-implementacao.md`**:
 * diferente do login por formulário (`LoginResultResource.requires_subscription`),
 * esse redirect final não carrega nenhum sinal de "usuário novo, precisa
 * escolher plano" — `AuthenticateWithSsoAction` (backend) não expõe isso,
 * e `/auth/me` (`UserResource`) também não. Um cadastro novo via SSO cai
 * direto no dashboard normal, não em `/choose-plan`, até essa lacuna ser
 * fechada no backend (mesma computação que `LoginUserAction` já faz,
 * replicada em `UserProfileController::show` ou no próprio callback).
 */
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShieldCheck, WarningCircle } from '@/shared/components/icons/regular.generated'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import { buildSsoCallbackUrl } from '../services/identityApi'
import type { SsoProvider } from '../types/ssoAccount.type'

const route = useRoute()

// Google manda `error` (ex.: `access_denied`, usuário cancelou o consentimento)
// no lugar de `code` quando a autorização falha — sem `code`, não há nada
// pra repassar pro backend.
const hasError = Boolean(route.query.error) || typeof route.query.code !== 'string'

onMounted(() => {
  if (hasError) {
    return
  }

  const provider = route.params.provider as SsoProvider
  window.location.href = `${buildSsoCallbackUrl(provider)}${window.location.search}`
})
</script>

<template>
  <AuthLayout :illustration-icon="ShieldCheck">
    <div class="sso-callback-view">
      <template v-if="hasError">
        <Icon class="sso-callback-view__error-icon" :icon="WarningCircle" :size="48" />
        <h1 class="sso-callback-view__title">{{ $t('identity.ssoCallback.errorTitle') }}</h1>
        <p class="sso-callback-view__subtitle">{{ $t('identity.ssoCallback.errorDescription') }}</p>

        <RouterLink class="sso-callback-view__back" :to="{ name: 'login' }">
          {{ $t('common.actions.back') }}
        </RouterLink>
      </template>

      <template v-else>
        <Spinner :size="32" />
        <p class="sso-callback-view__connecting">{{ $t('identity.ssoCallback.connecting') }}</p>
      </template>
    </div>
  </AuthLayout>
</template>

<style scoped lang="scss">

.sso-callback-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sso-callback-view__error-icon {
  margin-bottom: $spacing-16;
  color: $color-accent-red;
}

.sso-callback-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.sso-callback-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.sso-callback-view__back {
  font-size: $font-size-sm;
  color: $color-primary;
}

.sso-callback-view__connecting {
  margin-top: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
