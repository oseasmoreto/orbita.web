import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  images: ['public/favicon.svg'],
  preset: {
    ...minimal2023Preset,
    // minimal2023Preset defaults to a white padding background for the
    // maskable icon — override to the DS canvas color so the safe-zone
    // padding matches the app instead of showing a white ring.
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background: '#0d0c0c' },
    },
  },
})
