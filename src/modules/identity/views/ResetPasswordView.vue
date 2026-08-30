<script setup lang="ts">
/**
 * Estrutura da captura de referência ("Reset Password" + modal de
 * sucesso) — com uma divergência real e deliberada: a referência pede um
 * CÓDIGO digitado ("we sent a code to..."), mas `ResetPasswordRequest`
 * (`core/api/schema.d.ts`) usa `token` de link de e-mail (Laravel padrão,
 * mesmo fluxo de `docs/negocio/jornada-usuario.mmd` — "define nova senha
 * via link recebido"), não um código curto pra digitar. Esta tela é o
 * destino desse link: `email`/`token` vêm da query string
 * (`?email=...&token=...`), o formulário só pede a senha nova.
 *
 * **Modal de sucesso revisado pixel a pixel contra a captura real do
 * Figma** (não só "aproximação visual" como antes): ícone em círculo
 * tintado ACIMA do título (não abaixo, como a v1 tinha via slot padrão),
 * título/descrição centralizados, botão único esticado pra largura total
 * — usa a variante `centered` do `Modal.vue` (slot `#icon`, `centered`
 * prop) em vez de tentar recentralizar aqui de fora (o `DialogContent` é
 * teletransportado via `DialogPortal`, um `:deep()`/`:global()` de
 * consumidor de fora não alcançaria o conteúdo — mesmo achado já
 * documentado no design system pro Select/Tooltip/Modal).
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, LockSimple } from '@/shared/components/icons/regular.generated'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import { useResetPasswordForm } from '../composables/useResetPasswordForm'
import type { ResetPasswordFormValues } from '../schemas/resetPasswordFormSchema'

const route = useRoute()
const router = useRouter()

const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const hasValidLink = computed(() => Boolean(email.value && token.value))

const { errors, isSubmitting, submit, values } = useResetPasswordForm()
const isSuccessModalOpen = ref(false)

function fieldError(key: keyof ResetPasswordFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const success = await submit(email.value, token.value)

  if (success) {
    isSuccessModalOpen.value = true
  }
}

function goToLogin(): void {
  isSuccessModalOpen.value = false
  void router.push({ name: 'login' })
}
</script>

<template>
  <AuthLayout :illustration-icon="LockSimple">
    <template v-if="!hasValidLink">
      <h1 class="reset-password-view__title">{{ $t('identity.resetPassword.invalidLinkTitle') }}</h1>
      <p class="reset-password-view__subtitle">{{ $t('identity.resetPassword.invalidLink') }}</p>
    </template>

    <template v-else>
      <h1 class="reset-password-view__title">{{ $t('identity.resetPassword.title') }}</h1>
      <p class="reset-password-view__subtitle">
        {{ $t('identity.resetPassword.subtitle', { email }) }}
      </p>

      <form class="reset-password-view__form" @submit.prevent="handleSubmit">
        <FormGroup :error="fieldError('password')" :label="$t('identity.resetPassword.fields.password')">
          <Input
            v-model="values.password"
            :icon-before="LockSimple"
            :invalid="Boolean(fieldError('password'))"
            :placeholder="$t('identity.resetPassword.placeholders.password')"
            type="password"
          />
        </FormGroup>

        <FormGroup
          :error="fieldError('passwordConfirmation')"
          :label="$t('identity.resetPassword.fields.passwordConfirmation')"
        >
          <Input
            v-model="values.passwordConfirmation"
            :icon-before="LockSimple"
            :invalid="Boolean(fieldError('passwordConfirmation'))"
            :placeholder="$t('identity.resetPassword.placeholders.passwordConfirmation')"
            type="password"
          />
        </FormGroup>

        <Button :disabled="isSubmitting" size="large" type="submit" variant="primary">
          {{ $t('identity.resetPassword.submit') }}
        </Button>
      </form>
    </template>

    <RouterLink class="reset-password-view__back" :to="{ name: 'login' }">
      {{ $t('common.actions.back') }}
    </RouterLink>

    <Modal
      v-model="isSuccessModalOpen"
      centered
      :description="$t('identity.resetPassword.success.description')"
      :title="$t('identity.resetPassword.success.title')"
    >
      <template #icon>
        <span class="reset-password-view__success-icon">
          <Icon :icon="CheckCircle" :size="32" />
        </span>
      </template>

      <template #footer>
        <Button size="large" variant="primary" @click="goToLogin">
          {{ $t('identity.resetPassword.success.cta') }}
        </Button>
      </template>
    </Modal>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.reset-password-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.reset-password-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.reset-password-view__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.reset-password-view__back {
  display: inline-flex;
  justify-content: center;
  margin-top: $spacing-24;
  font-size: $font-size-sm;
  color: $color-primary;
}

.reset-password-view__success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: $size-64;
  height: $size-64;
  color: $color-accent-green;
  background-color: color-mix(in srgb, $color-accent-green 16%, transparent);
  border-radius: $radius-80;
}
</style>
