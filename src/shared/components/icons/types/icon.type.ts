/**
 * Um elemento de ícone gerado (`regular.generated.ts`/`duotone.generated.ts`/
 * `snow-ui.generated.ts`) — tag SVG (`path`, `circle`...) + atributos.
 * `fill` só aparece aqui quando o SVG de origem usava uma cor diferente do
 * placeholder padrão do export (`#1C1C1C` → sempre vira `currentColor`,
 * nunca guardado) — ex.: o cutout branco de um checkbox marcado preserva
 * `fill: 'white'` de propósito (ver scripts/generate-icons.mjs).
 */
export type IconElement = [tag: string, attrs: Record<string, string>]
