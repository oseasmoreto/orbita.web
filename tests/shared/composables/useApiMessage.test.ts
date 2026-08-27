import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'

function resolveViaComponent(key: string): string {
  let resolved = ''

  const i18n = createI18n({
    legacy: false,
    locale: 'pt-BR',
    messages: {
      'pt-BR': {
        errors: { unknown: 'Ocorreu um erro inesperado. Tente novamente.' },
      },
    },
  })

  const TestComponent = defineComponent({
    setup() {
      const { resolveMessage } = useApiMessage()
      resolved = resolveMessage(key)
      return () => h('div')
    },
  })

  mount(TestComponent, { global: { plugins: [i18n] } })

  return resolved
}

describe('useApiMessage', () => {
  it('resolves a catalogued key to its translated text', () => {
    expect(resolveViaComponent('errors.unknown')).toBe(
      'Ocorreu um erro inesperado. Tente novamente.',
    )
  })

  it('returns an unknown key as-is, as free text coming from the backend', () => {
    expect(resolveViaComponent('some.free.text.key')).toBe('some.free.text.key')
  })
})
