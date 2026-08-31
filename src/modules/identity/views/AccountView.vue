<script setup lang="ts">
/**
 * Fecha a última pendência real da Fase 1 (`docs/planejamento/plano-implementacao.md`)
 * — escopo direto de `mapeamento-cruds-perfil.md` (backend): editar
 * nome/e-mail/senha (P3), ver/desconectar provedores SSO (P6/P7), excluir
 * a própria conta (P5, soft-delete/anonimização). Nada além disso —
 * limite de plano/histórico de assinatura não é escopo de perfil, é
 * Billing (Fase 2).
 *
 * `skipOnboardingChecks: true` na rota (`routes.ts`) de propósito: gestão
 * da própria conta (inclusive excluir) não pode ficar bloqueada atrás do
 * gate de assinatura/e-mail verificado — um usuário que quer sair da
 * plataforma precisa conseguir chegar aqui de qualquer forma.
 */
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  EnvelopeSimple,
  GoogleLogo,
  LockSimple,
  Trash,
  User,
  WindowsLogo,
} from '@/shared/components/icons/regular.generated'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Input from '@/shared/components/ui/Input.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import DeleteAccountModal from '../components/DeleteAccountModal.vue'
import { useDeleteAccount } from '../composables/useDeleteAccount'
import { useSsoAccounts } from '../composables/useSsoAccounts'
import { useUpdateProfileForm } from '../composables/useUpdateProfileForm'
import type { UpdateProfileFormValues } from '../schemas/updateProfileFormSchema'
import type { SsoProvider } from '../types/ssoAccount.type'

const { t } = useI18n()

const { errors, isSubmitting, submit, values } = useUpdateProfileForm()
const ssoAccounts = useSsoAccounts()
const { confirmDelete, isDeleting } = useDeleteAccount()

onMounted(ssoAccounts.load)

function fieldError(key: keyof UpdateProfileFormValues): string | undefined {
  return errors.value[key]
}

const PROVIDER_ICON: Record<SsoProvider, typeof GoogleLogo> = {
  google: GoogleLogo,
  microsoft: WindowsLogo,
}

function providerLabel(provider: SsoProvider): string {
  return provider === 'google'
    ? t('identity.account.sso.google')
    : t('identity.account.sso.microsoft')
}

const isDeleteModalOpen = ref(false)

async function handleDeleteConfirm(password: string): Promise<void> {
  const succeeded = await confirmDelete(password)
  if (succeeded) {
    isDeleteModalOpen.value = false
  }
}
</script>

<template>
  <div class="account-view">
    <h1 class="account-view__title">{{ $t('identity.account.title') }}</h1>

    <div class="account-view__grid">
      <section class="account-view__section">
        <h2 class="account-view__section-title">{{ $t('identity.account.profile.title') }}</h2>

        <form class="account-view__form" @submit.prevent="submit">
          <FormGroup :error="fieldError('name')" :label="$t('identity.account.fields.name')">
            <Input
              v-model="values.name"
              :icon-before="User"
              :invalid="Boolean(fieldError('name'))"
            />
          </FormGroup>

          <FormGroup :error="fieldError('email')" :label="$t('identity.account.fields.email')">
            <Input
              v-model="values.email"
              :icon-before="EnvelopeSimple"
              :invalid="Boolean(fieldError('email'))"
              type="email"
            />
          </FormGroup>

          <FormGroup :error="fieldError('password')" :label="$t('identity.account.fields.password')">
            <Input
              v-model="values.password"
              :icon-before="LockSimple"
              :invalid="Boolean(fieldError('password'))"
              :placeholder="$t('identity.account.placeholders.password')"
              type="password"
            />
          </FormGroup>

          <FormGroup
            :error="fieldError('passwordConfirmation')"
            :label="$t('identity.account.fields.passwordConfirmation')"
          >
            <Input
              v-model="values.passwordConfirmation"
              :icon-before="LockSimple"
              :invalid="Boolean(fieldError('passwordConfirmation'))"
              :placeholder="$t('identity.account.placeholders.passwordConfirmation')"
              type="password"
            />
          </FormGroup>

          <Button :disabled="isSubmitting" type="submit" variant="primary">
            {{ $t('identity.account.profile.save') }}
          </Button>
        </form>
      </section>

      <div class="account-view__side">
        <section class="account-view__section">
          <h2 class="account-view__section-title">{{ $t('identity.account.sso.title') }}</h2>

          <div v-if="ssoAccounts.isLoading.value" class="account-view__sso-loading">
            <Spinner :size="20" />
          </div>

          <p v-else-if="ssoAccounts.accounts.value.length === 0" class="account-view__sso-empty">
            {{ $t('identity.account.sso.empty') }}
          </p>

          <ul v-else class="account-view__sso-list">
            <li
              v-for="account in ssoAccounts.accounts.value"
              :key="account.id"
              class="account-view__sso-item"
            >
              <span class="account-view__sso-provider">
                <Icon :icon="PROVIDER_ICON[account.provider]" :size="20" />
                {{ providerLabel(account.provider) }}
              </span>

              <Button
                :disabled="ssoAccounts.disconnectingId.value === account.id"
                variant="outline"
                @click="ssoAccounts.disconnect(account.id)"
              >
                {{ $t('identity.account.sso.disconnect') }}
              </Button>
            </li>
          </ul>
        </section>

        <section class="account-view__section account-view__section--danger">
          <h2 class="account-view__section-title">{{ $t('identity.account.dangerZone.title') }}</h2>
          <p class="account-view__danger-description">
            {{ $t('identity.account.dangerZone.description') }}
          </p>

          <Button :icon-before="Trash" variant="outline" @click="isDeleteModalOpen = true">
            {{ $t('identity.account.dangerZone.deleteCta') }}
          </Button>
        </section>
      </div>
    </div>

    <DeleteAccountModal
      v-model="isDeleteModalOpen"
      :is-submitting="isDeleting"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.account-view {
  max-width: 1200px;
  padding: $spacing-24;
}

.account-view__title {
  margin-bottom: $spacing-24;
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// 2 colunas lado a lado (formulário de perfil, mais longo, contra
// contas conectadas + zona de risco empilhadas) em vez de 3 seções
// sempre em pilha vertical — pedido direto do usuário, 2026-08-31,
// aproveitar a largura sobrando na tela. `auto-fit`/`minmax` colapsa pra
// 1 coluna sozinho em viewport estreito, mesma técnica já usada no grid
// de planos (`ChoosePlanView.vue`) — sem media query extra.
.account-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: start;
  gap: $spacing-24;
}

.account-view__side {
  display: flex;
  flex-direction: column;
  gap: $spacing-24;
}

.account-view__section {
  padding: $spacing-24;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

.account-view__section--danger {
  border-color: $color-accent-red;
}

.account-view__section-title {
  margin-bottom: $spacing-16;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.account-view__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.account-view__sso-loading {
  display: flex;
  justify-content: center;
  padding: $spacing-16 0;
}

.account-view__sso-empty {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.account-view__sso-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;
  padding: 0;
  margin: 0;
  list-style: none;
}

.account-view__sso-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-12;
  background-color: $color-bg-2;
  border-radius: $radius-8;
}

.account-view__sso-provider {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink;
}

.account-view__danger-description {
  margin-bottom: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
