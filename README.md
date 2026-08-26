# Orbita — Frontend

Frontend (Vue 3 + TypeScript) da plataforma de precificação para marketplace. Consome a API do repositório `orbita.api`.

Convenções, arquitetura e regras de negócio: ver `CLAUDE.md` e `docs/`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o Vite dev server |
| `npm run build` | Typecheck + build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | Typecheck isolado (`vue-tsc -b`) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Biome (formatação) |
| `npm run check` | Biome check (lint + format) com fix |
| `npm run check:ci` | Biome CI (sem fix) + typecheck — usado no pipeline |
| `npm run test` | Vitest em modo watch |
| `npm run test:run` | Vitest single-run (CI) |
| `npm run test:coverage` | Vitest com cobertura |
| `npm run test:e2e` | Playwright |
| `npm run generate:api-types` | Gera `src/core/api/schema.d.ts` a partir do OpenAPI do backend |
| `npm run generate:pwa-assets` | Gera os ícones de PWA a partir de `public/favicon.svg` |
