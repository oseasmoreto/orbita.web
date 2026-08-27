import { defineComponent, h, useAttrs } from 'vue'
import type { IconElement } from './types/icon.type'

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
    // `inheritAttrs: false` bloqueia o fallthrough automático de propósito
    // (o `Icon.vue` sempre manda `stroke-width`, que só faz sentido pro
    // @lucide/vue — não queremos isso vazando pro <svg> gerado aqui). Mas
    // isso também bloquearia `class`/`style`, que são esperados (ex.:
    // Spinner.vue precisa aplicar uma classe de animação) — por isso
    // `useAttrs()` abaixo repassa só os dois manualmente, achado real ao
    // construir Spinner.vue (a classe simplesmente não chegava no DOM).
    inheritAttrs: false,
    props: {
      size: { default: 20, type: [Number, String] },
    },
    setup(props) {
      const attrs = useAttrs()

      return () => {
        const height = typeof props.size === 'number' ? props.size : Number.parseFloat(props.size)
        const width = height * aspectRatio

        return h(
          'svg',
          {
            class: attrs.class,
            fill: 'none',
            height,
            style: attrs.style,
            viewBox,
            width,
            xmlns: 'http://www.w3.org/2000/svg',
          },
          elements.map(([tag, elementAttrs]) => h(tag, { fill: 'currentColor', ...elementAttrs })),
        )
      }
    },
  })
}
