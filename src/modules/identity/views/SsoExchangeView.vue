<script setup lang="ts">
/**
 * Segundo (e novo) hop do fluxo SSO, introduzido em 2026-08-31 —
 * `SsoCallbackView.vue` (`sso-callback`, `/v1/auth/sso/:provider/callback`)
 * continua existindo tal como está (Google ainda navega pra lá, o
 * backend ainda processa o código com o provider), só que agora, em vez
 * de autenticar direto e redirecionar pra raiz do `FRONTEND_URL`, o
 * backend redireciona pra CÁ (`{FRONTEND_URL}/sso/callback?token=...`,
 * token opaco de 60s/uso único) — ver `useSsoExchange.ts` pro raciocínio
 * completo (proteção anti-bounce-tracking do browser descartava o cookie
 * de sessão no meio do caminho).
 *
 * Esta view só lê `token` da query string e delega pra
 * `useSsoExchange().exchange()` — troca por sessão de verdade via fetch
 * normal (roda numa origem "parada", não em bounce, então o `Set-Cookie`
 * funciona). Mesmo esqueleto visual de `SsoCallbackView.vue` (spinner
 * "conectando" / erro com link de volta pro login) — os dois estados são
 * genuinamente iguais visualmente, reaproveita as mesmas chaves de i18n
 * (`identity.ssoCallback.*`) em vez de duplicar cópia quase idêntica.
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ShieldCheck, WarningCircle } from '@/shared/components/icons/regular.generated'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import { useSsoExchange } from '../composables/useSsoExchange'

const route = useRoute()
const { t } = useI18n()
const { errorMessage, exchange, isExchanging } = useSsoExchange()

onMounted(() => {
  const token = route.query.token

  if (typeof token !== 'string' || !token) {
    isExchanging.value = false
    errorMessage.value = t('identity.ssoCallback.errorDescription')
    return
  }

  void exchange(token)
})
</script>

<template>
  <AuthLayout :illustration-icon="ShieldCheck">
    <div class="sso-exchange-view">
      <template v-if="isExchanging">
        <Spinner :size="32" />
        <p class="sso-exchange-view__connecting">{{ $t('identity.ssoCallback.connecting') }}</p>
      </template>

      <template v-else-if="errorMessage">
        <Icon class="sso-exchange-view__error-icon" :icon="WarningCircle" :size="48" />
        <h1 class="sso-exchange-view__title">{{ $t('identity.ssoCallback.errorTitle') }}</h1>
        <p class="sso-exchange-view__subtitle">{{ errorMessage }}</p>

        <RouterLink class="sso-exchange-view__back" :to="{ name: 'login' }">
          {{ $t('common.actions.back') }}
        </RouterLink>
      </template>
    </div>
  </AuthLayout>
</template>

<style scoped lang="scss">

.sso-exchange-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sso-exchange-view__error-icon {
  margin-bottom: $spacing-16;
  color: $color-accent-red;
}

.sso-exchange-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.sso-exchange-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.sso-exchange-view__back {
  font-size: $font-size-sm;
  color: $color-primary;
}

.sso-exchange-view__connecting {
  margin-top: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
