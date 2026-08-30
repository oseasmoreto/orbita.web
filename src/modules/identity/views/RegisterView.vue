<script setup lang="ts">
/**
 * Mesma estrutura de `LoginView.vue` (ver comentário lá pra grounding da
 * referência e as 2 divergências deliberadas: sem "Remember me", SSO é
 * Google + Microsoft). Campo extra: `Name`, ícone `User`.
 */
import {
  EnvelopeSimple,
  GoogleLogo,
  LockSimple,
  User,
  UserCirclePlus,
  WindowsLogo,
} from '@/shared/components/icons/regular.generated'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import { useRegisterForm } from '../composables/useRegisterForm'
import type { RegisterFormValues } from '../schemas/registerFormSchema'
import { buildSsoRedirectUrl, type SsoProvider } from '../services/identityApi'

const { errors, isSubmitting, submit, values } = useRegisterForm()

function fieldError(key: keyof RegisterFormValues): string | undefined {
  return errors.value[key]
}

function signUpWithSso(provider: SsoProvider): void {
  window.location.href = buildSsoRedirectUrl(provider)
}
</script>

<template>
  <AuthLayout :illustration-icon="UserCirclePlus">
    <h1 class="register-view__title">{{ $t('identity.register.title') }}</h1>
    <p class="register-view__subtitle">{{ $t('identity.register.subtitle') }}</p>

    <form class="register-view__form" @submit.prevent="submit">
      <FormGroup :error="fieldError('name')" :label="$t('identity.register.fields.name')">
        <Input
          v-model="values.name"
          :icon-before="User"
          :invalid="Boolean(fieldError('name'))"
          :placeholder="$t('identity.register.placeholders.name')"
        />
      </FormGroup>

      <FormGroup :error="fieldError('email')" :label="$t('identity.register.fields.email')">
        <Input
          v-model="values.email"
          :icon-before="EnvelopeSimple"
          :invalid="Boolean(fieldError('email'))"
          :placeholder="$t('identity.register.placeholders.email')"
          type="email"
        />
      </FormGroup>

      <FormGroup :error="fieldError('password')" :label="$t('identity.register.fields.password')">
        <Input
          v-model="values.password"
          :icon-before="LockSimple"
          :invalid="Boolean(fieldError('password'))"
          :placeholder="$t('identity.register.placeholders.password')"
          type="password"
        />
      </FormGroup>

      <FormGroup
        :error="fieldError('passwordConfirmation')"
        :label="$t('identity.register.fields.passwordConfirmation')"
      >
        <Input
          v-model="values.passwordConfirmation"
          :icon-before="LockSimple"
          :invalid="Boolean(fieldError('passwordConfirmation'))"
          :placeholder="$t('identity.register.placeholders.passwordConfirmation')"
          type="password"
        />
      </FormGroup>

      <Button :disabled="isSubmitting" size="large" type="submit" variant="primary">
        {{ $t('identity.register.submit') }}
      </Button>
    </form>

    <div class="register-view__divider">
      <span>{{ $t('identity.register.orContinueWith') }}</span>
    </div>

    <div class="register-view__sso">
      <Button :icon-before="GoogleLogo" type="button" variant="outline" @click="signUpWithSso('google')">
        {{ $t('identity.register.ssoGoogle') }}
      </Button>
      <Button
        :icon-before="WindowsLogo"
        type="button"
        variant="outline"
        @click="signUpWithSso('microsoft')"
      >
        {{ $t('identity.register.ssoMicrosoft') }}
      </Button>
    </div>

    <p class="register-view__footer">
      {{ $t('identity.register.hasAccount') }}
      <RouterLink :to="{ name: 'login' }">{{ $t('identity.register.loginLink') }}</RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.register-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.register-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.register-view__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.register-view__divider {
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

.register-view__sso {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-8;
}

.register-view__footer {
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
