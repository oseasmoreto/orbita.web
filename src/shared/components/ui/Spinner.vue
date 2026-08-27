<script setup lang="ts">
import { Loading } from '@/shared/components/icons/snow-ui.generated'
import Icon from './Icon.vue'

withDefaults(defineProps<{ size?: number }>(), { size: 20 })
</script>

<template>
  <Icon class="ui-spinner" :icon="Loading" :size="size" />
</template>

<style scoped lang="scss">
.ui-spinner {
  animation: ui-spinner-spin 0.8s linear infinite;
}

@keyframes ui-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
