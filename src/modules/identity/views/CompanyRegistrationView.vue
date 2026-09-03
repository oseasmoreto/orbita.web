<script setup lang="ts">
/**
 * Passo obrigatório de onboarding (tarefa 63,
 * `docs/api/ordem-de-implementacao.md` no repo `backend`), entre e-mail
 * verificado e escolha de plano (`docs/negocio/jornada-usuario.mmd`, nó
 * `RegisterCompany`) — `core/router/guards.ts` manda pra cá sempre que
 * `authStore.requiresCompany` é `true`. Mesmo shell de `ChoosePlanView.vue`
 * (topbar com marca + logout, fora do `AppLayout`) — é o mesmo tipo de
 * tela: um passo do fluxo, não uma página do app principal.
 *
 * Campos/validação/estado moram em `CompanyForm.vue` (extraído em
 * 2026-09-02 — segundo consumidor real é `AccountView.vue`, que também
 * precisa ver/editar a empresa depois do onboarding) — esta view só é o
 * shell (topbar/header) + a decisão de pra onde ir depois de salvar.
 */
import { useRouter } from 'vue-router'
import { refreshCurrentUser } from '@/core/router/guards'
import { useAuthStore } from '@/core/store/useAuthStore'
import Button from '@/shared/components/ui/Button.vue'
import { SignOut } from '@/shared/components/icons/regular.generated'
import CompanyForm from '../components/CompanyForm.vue'
import { useLogout } from '../composables/useLogout'

const router = useRouter()
const authStore = useAuthStore()
const { isLoggingOut, logout } = useLogout()

async function handleSaved(): Promise<void> {
  // Mesmo achado real de `useSubscribeToPlan.subscribe()`
  // (`core/router/guards.ts`) — sem refazer `/auth/me`,
  // `authStore.requiresCompany` fica preso em `true` e o guard manda de
  // volta pra cá na próxima navegação.
  await refreshCurrentUser()
  await router.push(authStore.requiresSubscription ? { name: 'choose-plan' } : { name: 'home' })
}
</script>

<template>
  <div class="company-registration-view">
    <div class="company-registration-view__topbar">
      <div class="company-registration-view__brand">Orbita</div>
      <Button :disabled="isLoggingOut" :icon-before="SignOut" variant="ghost" @click="logout">
        {{ $t('common.actions.logout') }}
      </Button>
    </div>

    <header class="company-registration-view__header">
      <h1 class="company-registration-view__title">
        {{ $t('identity.companyRegistration.heading') }}
      </h1>
      <p class="company-registration-view__subtitle">
        {{ $t('identity.companyRegistration.description') }}
      </p>
    </header>

    <div class="company-registration-view__card">
      <CompanyForm @saved="handleSaved" />
    </div>
  </div>
</template>

<style scoped lang="scss">

.company-registration-view {
  min-height: 100vh;
  padding: $spacing-24 $spacing-24 $spacing-48;
  background-color: $color-bg-1;
}

.company-registration-view__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.company-registration-view__brand {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.company-registration-view__header {
  max-width: 480px;
  padding: $spacing-48 0 $spacing-24;
  margin: 0 auto;
  text-align: center;
}

.company-registration-view__title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.company-registration-view__subtitle {
  margin-top: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink-40;
}

.company-registration-view__card {
  max-width: 420px;
  padding: $spacing-24;
  margin: $spacing-24 auto 0;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}
</style>
