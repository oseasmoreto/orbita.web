import { defineComponent, h } from 'vue'

/**
 * Um elemento de ícone gerado (`regular.generated.ts`/`duotone.generated.ts`/
 * `snow-ui.generated.ts`) — tag SVG (`path`, `circle`...) + atributos.
 * `fill` só aparece aqui quando o SVG de origem usava uma cor diferente do
 * placeholder padrão do export (`#1C1C1C` → sempre vira `currentColor`,
 * nunca guardado) — ex.: o cutout branco de um checkbox marcado preserva
 * `fill: 'white'` de propósito (ver scripts/generate-icons.mjs).
 */
export type IconElement = [tag: string, attrs: Record<string, string>]

/**
 * Fábrica de componente de ícone — mesmo padrão usado internamente por
 * bibliotecas como `@lucide/vue` (um componente pequeno por ícone, gerado a
 * partir de dados de elemento, não um arquivo `.vue` por ícone). Consumida só
 * pelos módulos `.generated.ts` (scripts/generate-icons.mjs), nunca chamada
 * à mão fora deles.
 */
export function createIcon(elements: IconElement[], viewBox = '0 0 32 32') {
  const [, , vbWidthRaw, vbHeightRaw] = viewBox.split(' ')
  const vbWidth = Number(vbWidthRaw)
  const vbHeight = Number(vbHeightRaw)
  const aspectRatio = vbWidth / vbHeight

  return defineComponent({
    inheritAttrs: false,
    props: {
      size: { default: 20, type: [Number, String] },
    },
    setup(props) {
      return () => {
        const height = typeof props.size === 'number' ? props.size : Number.parseFloat(props.size)
        const width = height * aspectRatio

        return h(
          'svg',
          {
            fill: 'none',
            height,
            viewBox,
            width,
            xmlns: 'http://www.w3.org/2000/svg',
          },
          elements.map(([tag, attrs]) => h(tag, { fill: 'currentColor', ...attrs })),
        )
      }
    },
  })
}
