<script setup lang="ts">
import AppSidebarNavItem from './AppSidebarNavItem.vue'
import { navGroups } from './navigation'
</script>

<template>
  <div class="app-sidebar-content">
    <div class="app-sidebar-content__brand">Orbita</div>

    <nav
      v-for="(group, index) in navGroups"
      :key="index"
      class="app-sidebar-content__group"
    >
      <p v-if="group.title" class="app-sidebar-content__group-title">{{ group.title }}</p>
      <AppSidebarNavItem v-for="item in group.items" :key="item.id" :item="item" />
    </nav>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.app-sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $spacing-16;
}

.app-sidebar-content__brand {
  padding: $spacing-8;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.app-sidebar-content__group {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  margin-top: $spacing-16;
}

.app-sidebar-content__group-title {
  padding: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
