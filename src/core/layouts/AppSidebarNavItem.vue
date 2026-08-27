<script setup lang="ts">
import { computed } from 'vue'
import { CaretDown } from '@/shared/components/icons/regular.generated'
import Icon from '@/shared/components/ui/Icon.vue'
import type { NavItem } from './types/navigation.type'
import { useAppShell } from './useAppShell'

defineOptions({ name: 'AppSidebarNavItem' })

const props = defineProps<{ item: NavItem }>()

const { isItemExpanded, toggleItem } = useAppShell()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const expanded = computed(() => hasChildren.value && isItemExpanded(props.item.id))

function handleClick(): void {
  if (hasChildren.value) {
    toggleItem(props.item.id)
  }
}
</script>

<template>
  <div class="app-sidebar-nav-item">
    <RouterLink
      v-if="item.to && !hasChildren"
      class="app-sidebar-nav-item__link"
      :to="item.to"
    >
      <Icon v-if="item.icon" :icon="item.icon" :size="20" />
      <span>{{ item.label }}</span>
    </RouterLink>

    <button
      v-else
      class="app-sidebar-nav-item__link"
      type="button"
      @click="handleClick"
    >
      <Icon v-if="item.icon" :icon="item.icon" :size="20" />
      <span>{{ item.label }}</span>
      <Icon
        v-if="hasChildren"
        :class="['app-sidebar-nav-item__chevron', { 'app-sidebar-nav-item__chevron--expanded': expanded }]"
        :icon="CaretDown"
        :size="16"
      />
    </button>

    <div v-if="expanded" class="app-sidebar-nav-item__children">
      <AppSidebarNavItem v-for="child in item.children" :key="child.id" :item="child" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.app-sidebar-nav-item__link {
  display: flex;
  align-items: center;
  width: 100%;
  gap: $spacing-12;
  padding: $spacing-12;
  font-size: $font-size-md;
  color: $color-ink;
  text-align: left;
  text-decoration: none;
  border-radius: $radius-8;

  &:hover {
    background-color: $color-ink-4;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &.router-link-active {
    font-weight: $font-weight-semibold;
    background-color: $color-ink-4;
  }
}

.app-sidebar-nav-item__chevron {
  margin-left: auto;
  transition: transform 0.15s ease;

  &--expanded {
    transform: rotate(180deg);
  }
}

.app-sidebar-nav-item__children {
  display: flex;
  flex-direction: column;
  padding-left: $spacing-16;
}
</style>
