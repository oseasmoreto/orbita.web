<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { Check, Info, Warning, WarningCircle } from '@/shared/components/icons/regular.generated'
import Icon from '@/shared/components/ui/Icon.vue'
import { useAppUpdatePrompt } from './core/pwa/composables/useAppUpdatePrompt'
import NotificationPanel from './modules/platform/components/NotificationPanel.vue'

useAppUpdatePrompt()
</script>

<template>
  <RouterView />
  <!--
    Ícones próprios por tipo, grounded na captura real do usuário
    (2026-08-28) — fundo escuro uniforme pros 5 tipos (via `--normal-bg`
    em `core/styles/main.scss`, não o `rich-colors` do vue-sonner, que
    pintaria o fundo inteiro por tipo em vez de só o ícone), só o ícone
    muda de cor/forma. `error` (`Warning`, triângulo) e `warning`
    (`WarningCircle`) usam formas diferentes de propósito — a captura só
    mostrava o triângulo pro caso "Operation Failed"/erro; um triângulo
    idêntico só trocando de cor pro "warning" dificultaria diferenciar os
    dois por daltonismo/leitura rápida. `default` (`toast()` sem sufixo,
    já usado em `core/pwa/composables/useAppUpdatePrompt.ts`) fica sem ícone — não
    tem slot próprio, é o caso mais neutro.

    **Achado real**: a prop `icons` do `<Toaster>` (`ToasterProps.icons`)
    NÃO alimenta o ícone por tipo apesar do nome/tipagem sugerirem isso —
    só o `icons.close` é usado assim; `success`/`error`/`warning`/`info`
    só existem via slot nomeado (`#success-icon` etc.), confirmado lendo
    o código-fonte do pacote (`toastType.value === 'success' ?
    renderSlot($slots, 'success-icon') : ...`). Tentativa inicial com a
    prop `icons` renderizava o ícone padrão do próprio pacote, não o
    nosso — trocado pra slots, que é o caminho de verdade.
  -->
  <Toaster position="top-right" theme="dark">
    <template #success-icon>
      <Icon :icon="Check" :size="16" style="color: var(--color-accent-green)" />
    </template>
    <template #error-icon>
      <Icon :icon="Warning" :size="16" style="color: var(--color-accent-red)" />
    </template>
    <template #warning-icon>
      <Icon :icon="WarningCircle" :size="16" style="color: var(--color-accent-yellow)" />
    </template>
    <template #info-icon>
      <Icon :icon="Info" :size="16" style="color: var(--color-accent-blue)" />
    </template>
  </Toaster>
  <NotificationPanel />
</template>
