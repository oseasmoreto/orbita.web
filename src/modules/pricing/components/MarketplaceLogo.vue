<script setup lang="ts">
/**
 * Logo de marketplace com fallback — extraído em 2026-08-31 depois de
 * `MarketplacesView.vue` (card), `AdminMarketplacesView.vue` (coluna
 * "Nome") e `ProductMarketplacesView.vue` (coluna "Marketplace") todos
 * precisarem da MESMA lógica (imagem real quando `logoUrl` existe,
 * `IconTile`/`Storefront` quando não existe OU quando a imagem falha ao
 * carregar — `logo_url` é um link que o admin cadastrou, pode ficar
 * quebrado sem que o cadastro tivesse como validar isso).
 *
 * `size` controla os dois estados igualmente — `iconSize` do fallback é
 * sempre metade de `size` (mesma proporção já usada em
 * `MarketplacesView.vue`: 48/24).
 */
import { ref } from 'vue'
import { Storefront } from '@/shared/components/icons/regular.generated'
import IconTile from '@/shared/components/ui/IconTile.vue'

const props = withDefaults(
  defineProps<{
    logoUrl: string | null
    name: string
    size?: number
  }>(),
  { size: 24 },
)

const hasFailed = ref(false)
</script>

<template>
  <img
    v-if="logoUrl && !hasFailed"
    :alt="name"
    class="marketplace-logo"
    :src="logoUrl"
    :style="{ height: `${size}px`, width: `${size}px` }"
    @error="hasFailed = true"
  />
  <IconTile v-else :icon="Storefront" :icon-size="Math.round(props.size / 2)" :size="size" tint="blue" />
</template>

<style scoped lang="scss">

.marketplace-logo {
  flex-shrink: 0;
  object-fit: cover;
  border-radius: $radius-8;
}
</style>
