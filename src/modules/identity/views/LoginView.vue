<script setup lang="ts">
/**
 * Estrutura grounded na captura de referência do usuário (2026-08-28, um
 * outro produto — "pegue como referência só a estrutura"): split screen,
 * heading + subtítulo, campo de e-mail/senha com ícone, link de "esqueci
 * a senha" na mesma linha do label da senha, botão de submit, divisor "ou
 * continue com", 2 botões de SSO, link de rodapé pro cadastro.
 *
 * **Duas divergências deliberadas da referência, com motivo real**:
 * - Sem checkbox "Remember me": `LoginRequest` (`core/api/schema.d.ts`)
 *   só aceita `email`/`password` — não existe nenhum parâmetro pra esse
 *   controle acionar (mesma régua de "sem botão sem ação" já aplicada no
 *   `ListToolbar` do CRUD de Produtos).
 * - SSO é Google + Microsoft, não Google + Apple: `SSO_ACCOUNT.provider`
 *   só aceita `google`/`microsoft` (`docs/negocio/contexto-plataforma-precificacao.md`
 *   seção 2.1) — Apple não existe no domínio.
 */
import {
  EnvelopeSimple,
  GoogleLogo,
  LockKey,
  LockSimple,
  WindowsLogo,
} from '@/shared/components/icons/regular.generated'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import { useLoginForm } from '../composables/useLoginForm'
import type { LoginFormValues } from '../schemas/loginFormSchema'
import { buildSsoRedirectUrl, type SsoProvider } from '../services/identityApi'

const { errors, isSubmitting, submit, values } = useLoginForm()

function fieldError(key: keyof LoginFormValues): string | undefined {
  return errors.value[key]
}

function signInWithSso(provider: SsoProvider): void {
  window.location.href = buildSsoRedirectUrl(provider)
}
</script>

<template>
  <AuthLayout :illustration-icon="LockKey">
    <h1 class="login-view__title">{{ $t('identity.login.title') }}</h1>
    <p class="login-view__subtitle">{{ $t('identity.login.subtitle') }}</p>

    <form class="login-view__form" @submit.prevent="submit">
      <FormGroup :error="fieldError('email')" :label="$t('identity.login.fields.email')">
        <Input
          v-model="values.email"
          :icon-before="EnvelopeSimple"
          :invalid="Boolean(fieldError('email'))"
          :placeholder="$t('identity.login.placeholders.email')"
          type="email"
        />
      </FormGroup>

      <FormGroup :error="fieldError('password')">
        <div class="login-view__field-header">
          <span class="login-view__field-label">{{ $t('identity.login.fields.password') }}</span>
          <RouterLink class="login-view__forgot-link" :to="{ name: 'forgot-password' }">
            {{ $t('identity.login.forgotPasswordLink') }}
          </RouterLink>
        </div>
        <Input
          v-model="values.password"
          :icon-before="LockSimple"
          :invalid="Boolean(fieldError('password'))"
          :placeholder="$t('identity.login.placeholders.password')"
          type="password"
        />
      </FormGroup>

      <Button :disabled="isSubmitting" size="large" type="submit" variant="primary">
        {{ $t('identity.login.submit') }}
      </Button>
    </form>

    <div class="login-view__divider">
      <span>{{ $t('identity.login.orContinueWith') }}</span>
    </div>

    <div class="login-view__sso">
      <Button :icon-before="GoogleLogo" type="button" variant="outline" @click="signInWithSso('google')">
        {{ $t('identity.login.ssoGoogle') }}
      </Button>
      <Button
        :icon-before="WindowsLogo"
        type="button"
        variant="outline"
        @click="signInWithSso('microsoft')"
      >
        {{ $t('identity.login.ssoMicrosoft') }}
      </Button>
    </div>

    <p class="login-view__footer">
      {{ $t('identity.login.noAccount') }}
      <RouterLink :to="{ name: 'register' }">{{ $t('identity.login.registerLink') }}</RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.login-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.login-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.login-view__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.login-view__field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-view__field-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.login-view__forgot-link {
  font-size: $font-size-sm;
  color: $color-primary;
  text-decoration: underline;
}

.login-view__divider {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  margin: $spacing-24 0;
  font-size: $font-size-sm;
  color: $color-ink-40;

  &::before,
  &::after {
    flex: 1;
    height: 1px;
    content: '';
    background-color: $color-ink-10;
  }
}

.login-view__sso {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-8;
}

.login-view__footer {
  margin-top: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
  text-align: center;

  a {
    color: $color-primary;
    text-decoration: underline;
  }
}
</style>
