<script setup lang="ts">
/**
 * Grounded na célula "Users" do `COMPONENT_SET "Table Components"` do
 * Figma (avatares sobrepostos + contador "+N" de quem não coube) —
 * composição de 2+ `Avatar.vue` com lógica de apresentação (quantos cabem,
 * quantos sobram), nunca regra de negócio (seção 3.2 de
 * `docs/infra/convencoes-frontend-infra.md`). Quem decide a lista real de
 * pessoas é sempre o consumidor.
 */
import { computed } from 'vue'
import Avatar from '../ui/Avatar.vue'
import type { AvatarGroupPerson } from './types/avatarGroup.type'

const props = withDefaults(
  defineProps<{
    people: AvatarGroupPerson[]
    max?: number
    size?: number
  }>(),
  {
    max: 3,
    size: 24,
  },
)

const visiblePeople = computed(() => props.people.slice(0, props.max))
const overflowCount = computed(() => Math.max(props.people.length - props.max, 0))
</script>

<template>
  <div class="ui-avatar-group">
    <Avatar
      v-for="person in visiblePeople"
      :key="person.name"
      class="ui-avatar-group__item"
      :name="person.name"
      :size="size"
      :src="person.src"
    />
    <span
      v-if="overflowCount > 0"
      class="ui-avatar-group__item ui-avatar-group__overflow"
      :style="{ height: `${size}px`, width: `${size}px` }"
    >
      +{{ overflowCount }}
    </span>
  </div>
</template>

<style scoped lang="scss">

.ui-avatar-group {
  display: inline-flex;
  align-items: center;
}

// Anel via `box-shadow` (não `border`) de propósito — não muda o
// diâmetro real do círculo, só desenha um "contorno" por cima, então o
// `size` passado pro `Avatar`/chip continua sendo o tamanho visual real.
.ui-avatar-group__item {
  flex-shrink: 0;
  box-shadow: 0 0 0 2px $color-bg-1;
  border-radius: $radius-80;

  &:not(:first-child) {
    margin-left: -$spacing-8;
  }
}

.ui-avatar-group__overflow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-2xs;
  color: $color-ink-40;
  background-color: $color-bg-2;
}
</style>
