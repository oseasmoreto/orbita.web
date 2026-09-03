<script setup lang="ts">
/**
 * Estrutura da captura de referência ("Forget Password") — heading,
 * subtítulo, campo de e-mail, botão de envio, link de voltar. Sem o passo
 * de "código" da referência: nosso backend real (`ResetPasswordRequest`,
 * `core/api/schema.d.ts`) usa `token` de link de e-mail (Laravel padrão),
 * não um código digitado — mesmo fluxo já documentado em
 * `docs/negocio/jornada-usuario.mmd` ("Define nova senha via link
 * recebido"). Depois de enviar, a mesma tela troca o formulário por uma
 * confirmação (sem navegar pra lugar nenhum — o usuário confere o e-mail).
 */
import { ArrowLeft, EnvelopeSimple, ShieldCheck } from '@/shared/components/icons/regular.generated'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Input from '@/shared/components/ui/Input.vue'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import { useForgotPasswordForm } from '../composables/useForgotPasswordForm'
import type { ForgotPasswordFormValues } from '../schemas/forgotPasswordFormSchema'

const { errors, isSubmitted, isSubmitting, submit, values } = useForgotPasswordForm()

function fieldError(key: keyof ForgotPasswordFormValues): string | undefined {
  return errors.value[key]
}
</script>

<template>
  <AuthLayout :illustration-icon="ShieldCheck">
    <template v-if="!isSubmitted">
      <h1 class="forgot-password-view__title">{{ $t('identity.forgotPassword.title') }}</h1>
      <p class="forgot-password-view__subtitle">{{ $t('identity.forgotPassword.subtitle') }}</p>

      <form class="forgot-password-view__form" @submit.prevent="submit">
        <FormGroup :error="fieldError('email')" :label="$t('identity.forgotPassword.fields.email')">
          <Input
            v-model="values.email"
            :icon-before="EnvelopeSimple"
            :invalid="Boolean(fieldError('email'))"
            :placeholder="$t('identity.forgotPassword.placeholders.email')"
            type="email"
          />
        </FormGroup>

        <Button :disabled="isSubmitting" size="large" type="submit" variant="primary">
          {{ $t('identity.forgotPassword.submit') }}
        </Button>
      </form>
    </template>

    <template v-else>
      <h1 class="forgot-password-view__title">{{ $t('identity.forgotPassword.successTitle') }}</h1>
      <p class="forgot-password-view__subtitle">{{ $t('identity.forgotPassword.success') }}</p>
    </template>

    <RouterLink class="forgot-password-view__back" :to="{ name: 'login' }">
      <Icon :icon="ArrowLeft" :size="16" />
      {{ $t('common.actions.back') }}
    </RouterLink>
  </AuthLayout>
</template>

<style scoped lang="scss">

.forgot-password-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.forgot-password-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.forgot-password-view__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.forgot-password-view__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-4;
  margin-top: $spacing-24;
  font-size: $font-size-sm;
  color: $color-primary;
}
</style>
