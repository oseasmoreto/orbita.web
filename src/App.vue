<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useAppUpdatePrompt } from './core/pwa/useAppUpdatePrompt'
import NotificationPanel from './modules/platform/components/NotificationPanel.vue'

useAppUpdatePrompt()
</script>

<template>
  <RouterView />
  <Toaster rich-colors position="top-right" />
  <NotificationPanel />
</template>
