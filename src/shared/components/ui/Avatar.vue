<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    src?: string
    size?: number
  }>(),
  {
    size: 32,
    src: undefined,
  },
)

/**
 * O modelo de dados do Orbita não tem campo de foto de perfil (`USER` em
 * docs/negocio/contexto-plataforma-precificacao.md não define avatar) — o
 * fallback de iniciais é o caminho normal hoje, não uma exceção rara.
 * `AvatarImage`/`AvatarFallback` do Reka UI já resolvem "mostra a imagem se
 * carregar, cai pro fallback se não tiver `src` ou falhar" sozinhos.
 */
const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts.at(-1)?.[0] : ''
  return `${first}${last ?? ''}`.toUpperCase()
})
</script>

<template>
  <AvatarRoot class="ui-avatar" :style="{ height: `${size}px`, width: `${size}px` }">
    <AvatarImage v-if="src" :alt="name" class="ui-avatar__image" :src="src" />
    <AvatarFallback class="ui-avatar__fallback">{{ initials }}</AvatarFallback>
  </AvatarRoot>
</template>

<style scoped lang="scss">

.ui-avatar {
  position: relative;
  display: inline-flex;
  overflow: hidden;
  border-radius: $radius-80;
}

.ui-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ui-avatar__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink;
  background-color: $color-bg-2;
}
</style>
