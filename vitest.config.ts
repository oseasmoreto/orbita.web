import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Mesma config de `vite.config.ts` (arquivos separados de propósito,
  // seção 10 de `docs/infra/convencoes-frontend-infra.md` — "config de
  // ferramenta sempre um arquivo por ferramenta", já duplicava
  // `resolve.alias` antes disso) — sem isso, montar um componente aqui
  // (`@vue/test-utils`) falharia a compilar SCSS por variável/mixin
  // indefinida, já que o Vitest não herda o `css` do Vite.
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/core/styles/variables' as *;\n@use '@/core/styles/mixins' as *;\n`,
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
