<script setup lang="ts">
/**
 * Grounded na instância "Avatar-Name-Text" usada dentro da seção
 * "Notifications" do `RightBar` do Figma (`#4113:42432`) — não é o mesmo
 * componente "Notification" (`State=Failure/Successful`, `Size=Big/Small`)
 * que a Tier 9 original citava: aquele é um toast flutuante (fundo escuro
 * + blur, `vue-sonner` já cobre isso), estrutura completamente diferente
 * do item de lista real usado dentro do painel. Mesma classe de correção
 * já feita pro `Search.vue`/`DropdownMenu.vue` — grounding contra o frame
 * certo, não contra o nome mais parecido na lista de componentes.
 */
import IconTile from '@/shared/components/ui/IconTile.vue'
import type { NotificationItemData } from '../types/notification.type'

defineProps<{
  notification: NotificationItemData
}>()
</script>

<template>
  <div class="notification-item">
    <IconTile :icon="notification.icon" :tint="notification.tint" />
    <div class="notification-item__body">
      <p
        :class="[
          'notification-item__title',
          { 'notification-item__title--unread': !notification.read },
        ]"
      >
        {{ notification.title }}
      </p>
      <p class="notification-item__timestamp">{{ notification.timestamp }}</p>
    </div>
    <span
      v-if="!notification.read"
      aria-label="Não lida"
      class="notification-item__unread-dot"
      role="status"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-8;
  padding: $spacing-4;
  border-radius: $radius-8;

  &:hover {
    background-color: $color-ink-4;
  }
}

.notification-item__body {
  min-width: 0;
}

.notification-item__title {
  font-size: $font-size-md;
  color: $color-ink;
}

// Emphasis é sempre um salto de peso (400→600), nunca de cor/tamanho
// sozinho — mesma regra já usada no resto do design system.
.notification-item__title--unread {
  font-weight: $font-weight-semibold;
}

.notification-item__timestamp {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

// Ponto de "não lida" — grounded no padrão "Badge-Dot" do Figma (visto
// sobreposto a ícone de botão, ex.: sino de notificação), aqui adaptado
// pra linha de lista (dot ao lado do conteúdo, não sobreposto a ícone).
// Cor exata do "Dot" do Figma não foi resolvível no dump em cache (rate
// limit) — `{colors.accent-red}` é uma aproximação razoável e documentada,
// mesma convenção de "precisa de atenção" já usada nesse tom em outros
// produtos.
.notification-item__unread-dot {
  flex-shrink: 0;
  // Sem token de tamanho abaixo de $size-12 (escala começa em 12px) — usa
  // $spacing-8 (já existente) em vez de inventar um valor de pixel novo.
  width: $spacing-8;
  height: $spacing-8;
  margin-top: $spacing-4;
  background-color: $color-accent-red;
  border-radius: $radius-80;
}
</style>
