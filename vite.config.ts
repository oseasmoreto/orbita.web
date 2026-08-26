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
