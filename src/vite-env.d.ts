/// <reference types="vite/client" />

// Shim de módulo pra import de `.vue` a partir de arquivo `.ts` (ex.:
// core/router importando core/layouts/AppLayout.vue). O `vue-tsc` entende
// `.vue` nativamente sem isso, mas o `tsc`/ESLint type-aware que o
// typescript-eslint usa por baixo não — sem o shim, o import resolve pra
// um tipo `error`, gerando `no-unsafe-assignment` falso-positivo (achado
// real, primeiro `.vue` importado de dentro de um `.ts` neste projeto).
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
