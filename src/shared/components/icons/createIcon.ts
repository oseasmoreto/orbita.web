import { defineComponent, h } from 'vue'

/**
 * Um `<path>` de um ícone gerado (`regular.generated.ts`/`duotone.generated.ts`).
 * `fill` nunca é armazenado aqui de propósito — todo path recebe
 * `fill: currentColor` no render, é isso que faz a cor do ícone variar por
 * contexto (design system, seção Components). `fill-opacity` é o que
 * diferencia a camada de fundo (10%) da camada de frente (100%) num ícone
 * duotone — ambas a mesma cor, opacidades diferentes.
 */
export interface IconPath {
  d: string
  'fill-opacity'?: string
}

/**
 * Fábrica de componente de ícone — mesmo padrão usado internamente por
 * bibliotecas como `@lucide/vue` (um componente pequeno por ícone, gerado a
 * partir de dados de path, não um arquivo `.vue` por ícone). Consumida só
 * pelos módulos `.generated.ts` (scripts/generate-icons.mjs), nunca chamada
 * à mão fora deles.
 */
export function createIcon(paths: IconPath[], viewBox = '0 0 32 32') {
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
          paths.map((path) => h('path', { fill: 'currentColor', ...path })),
        )
      }
    },
  })
}
