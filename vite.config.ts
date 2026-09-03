import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => ({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION') {
          return
        }
        warn(warning)
      },
    },
  },
  css: {
    preprocessorOptions: {
      // Pedido direto do usuário, 2026-09-03: todo componente repetia
      // `@use '@/core/styles/variables' as *;`/`@use '@/core/styles/mixins'
      // as *;` no topo do próprio `<style scoped lang="scss">` — `additionalData`
      // prepende isso automaticamente em TODO bloco `lang="scss"` (SFC ou
      // `.scss` solto), então nenhum componente precisa mais escrever essas
      // 2 linhas. Só `variables`/`mixins` entram aqui (nenhum dos dois emite
      // CSS de verdade sozinho — só `$var`s e `@mixin`/`@function`s — então
      // injetar em toda parte, inclusive dentro de `main.scss`, nunca duplica
      // CSS real no output). `tokens`/`reset` continuam de fora de propósito:
      // os dois têm CSS de verdade (`:root {...}`/reset de elemento), e
      // `docs/infra/convencoes-frontend-infra.md` seção 7 já proíbe `@use`
      // desses dois fora de `main.scss` — duplicar isso aqui repetiria esse
      // CSS em CADA componente compilado.
      scss: {
        additionalData: `@use '@/core/styles/variables' as *;\n@use '@/core/styles/mixins' as *;\n`,
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      devOptions: { enabled: true, type: 'module' },
      filename: 'sw.ts',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
      injectRegister: false,
      manifest: {
        background_color: '#0d0c0c',
        description: 'Precificação inteligente para vendedores multicanal em marketplaces.',
        display: 'standalone',
        icons: [
          { sizes: '64x64', src: 'pwa-64x64.png', type: 'image/png' },
          { sizes: '192x192', src: 'pwa-192x192.png', type: 'image/png' },
          { sizes: '512x512', src: 'pwa-512x512.png', type: 'image/png' },
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'maskable-icon-512x512.png',
            type: 'image/png',
          },
        ],
        lang: 'pt-BR',
        name: 'Orbita',
        orientation: 'portrait',
        scope: '/',
        short_name: 'Orbita',
        start_url: '/',
        theme_color: '#0d0c0c',
      },
      registerType: 'prompt',
      srcDir: 'src',
      strategies: 'injectManifest',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
}))
