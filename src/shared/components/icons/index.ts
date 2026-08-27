/**
 * Ícones do design system (docs/design/design-system.md), gerados a partir
 * de docs/icons-regular/, docs/icons-duotone/ e docs/icons-snow-ui/ via
 * `npm run generate:icons` (scripts/generate-icons.mjs). Cor sempre
 * `currentColor` (herda do elemento pai via CSS `color`) — nunca uma cor
 * fixa por ícone, exceto quando o SVG de origem já tinha uma cor literal
 * diferente do placeholder padrão (ex.: cutout branco de um checkbox
 * marcado em `snow-ui.generated.ts` — preservado de propósito).
 *
 * **Sempre importe o ícone direto do módulo gerado, nunca por namespace
 * daqui** — achado real (ver docs/planejamento/plano-implementacao.md):
 * mesmo com `/* @__PURE__ *\/` nos 1248 `createIcon(...)` de cada módulo,
 * um import por namespace (`import { IconsRegular } from '.../icons'` +
 * `IconsRegular.Check`) impede o bundler de eliminar os outros 1247 —
 * chunk salta de ~1kB pra ~2.4MB. Este arquivo não reexporta os ícones de
 * propósito, só o necessário pro `generate-icons.mjs`.
 *
 * Uso correto:
 * `import { Check } from '@/shared/components/icons/regular.generated'`
 * `<Icon :icon="Check" />`
 */

export type { IconElement } from './createIcon'
export { createIcon } from './createIcon'
