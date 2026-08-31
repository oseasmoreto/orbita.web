<script setup lang="ts">
/**
 * Fecha o gap real da jornada `EmailVerified` (`docs/negocio/jornada-usuario.mmd`)
 * — cadastro normal (`useRegisterForm.ts`) manda pra cá em vez de direto
 * pra `/choose-plan`, já que `SubscribeToPlanAction` (backend) recusa
 * assinatura de e-mail não verificado. Cadastro via SSO nunca passa por
 * aqui (`createVerified()`, backend — já vem verificado pelo provider).
 *
 * O link do e-mail em si não volta pra esta tela — o backend redireciona
 * direto pra `/choose-plan` (sucesso) ou `/login?error=email_verification_failed`
 * (falha), sem `auth:sanctum` na rota (`EmailVerificationController::verify`
 * resolve o usuário pelo `{id}` assinado na própria URL). Isso é
 * suficiente quando o link é aberto na MESMA aba; se for aberto no
 * cliente de e-mail/outra aba, quem ficou nesta tela precisa do botão
 * "Já verifiquei" (`useVerifyEmail.checkVerification`) pra avançar.
 */
import { useAuthStore } from '@/core/store/useAuthStore'
import { EnvelopeSimple } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import { useVerifyEmail } from '../composables/useVerifyEmail'

const authStore = useAuthStore()
const { checkVerification, isChecking, isResending, resend } = useVerifyEmail()
</script>

<template>
  <AuthLayout :illustration-icon="EnvelopeSimple">
    <div class="verify-email-view">
      <h1 class="verify-email-view__title">{{ $t('identity.verifyEmail.title') }}</h1>
      <p class="verify-email-view__subtitle">
        {{ $t('identity.verifyEmail.subtitle', { email: authStore.user?.email ?? '' }) }}
      </p>

      <Button :disabled="isChecking" size="large" variant="primary" @click="checkVerification">
        {{ $t('identity.verifyEmail.continueCta') }}
      </Button>

      <p class="verify-email-view__resend-hint">
        {{ $t('identity.verifyEmail.notReceived') }}
        <button
          class="verify-email-view__resend-button"
          :disabled="isResending"
          type="button"
          @click="resend"
        >
          {{ $t('identity.verifyEmail.resendCta') }}
        </button>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.verify-email-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.verify-email-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.verify-email-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.verify-email-view__resend-hint {
  margin-top: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.verify-email-view__resend-button {
  padding: 0;
  font: inherit;
  color: $color-primary;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;

  &:disabled {
    color: $color-ink-40;
    cursor: not-allowed;
  }
}
</style>
