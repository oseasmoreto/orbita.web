<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useAppUpdatePrompt } from './core/pwa/useAppUpdatePrompt'

useAppUpdatePrompt()
</script>

<template>
  <Toaster rich-colors position="top-right" />
</template>
