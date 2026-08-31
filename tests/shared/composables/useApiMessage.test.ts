import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'

const CATALOG = {
  errors: {
    unknown: 'Ocorreu um erro inesperado. Tente novamente.',
    validation: {
      byField: {
        ean: { closure_validation_rule: 'EAN inválido.' },
      },
      required: 'Campo obrigatório.',
    },
  },
}

function withComponent<T>(run: (api: ReturnType<typeof useApiMessage>) => T): T {
  let result!: T

  const i18n = createI18n({
    legacy: false,
    locale: 'pt-BR',
    messages: { 'pt-BR': CATALOG },
  })

  const TestComponent = defineComponent({
    setup() {
      result = run(useApiMessage())
      return () => h('div')
    },
  })

  mount(TestComponent, { global: { plugins: [i18n] } })

  return result
}

function resolveViaComponent(key: string): string {
  return withComponent(({ resolveMessage }) => resolveMessage(key))
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

describe('resolveFieldError', () => {
  /**
   * Achado real, 2026-08-31: o backend manda a chave do campo de erro
   * chaveada pela RULE NAME (`Str::snake(class_basename($rule))`,
   * `bootstrap/app.php`), não uma frase pronta — `required`/`min`/`max`/
   * `closure_validation_rule`... Sem essa resolução, o usuário via a
   * chave crua embaixo do campo (ex.: "closure_validation_rule" sob o
   * EAN inválido).
   */
  it('resolves a generic rule key catalogued under errors.validation', () => {
    const result = withComponent(({ resolveFieldError }) => resolveFieldError('name', 'required'))
    expect(result).toBe('Campo obrigatório.')
  })

  it('prefers a field-specific override over the generic rule message', () => {
    // "closure_validation_rule" é ambíguo por natureza (qualquer regra
    // Closure custom colapsa pro mesmo nome de classe genérico) — só um
    // dicionário POR CAMPO consegue diferenciar "EAN inválido" de "NCM
    // inválido" de "CPF/CNPJ inválido".
    const result = withComponent(({ resolveFieldError }) =>
      resolveFieldError('ean', 'closure_validation_rule'),
    )
    expect(result).toBe('EAN inválido.')
  })

  it('falls back to the raw rule name when neither the field-specific nor the generic key is catalogued', () => {
    const result = withComponent(({ resolveFieldError }) =>
      resolveFieldError('ncm', 'closure_validation_rule'),
    )
    expect(result).toBe('closure_validation_rule')
  })

  it('falls back to the raw message when it is free text, not a catalogued rule key', () => {
    // Nem toda mensagem de campo vem como rule name — uma `Rule` custom
    // pode devolver uma frase pronta via `$fail()`; sem entrada no
    // dicionário, mostra a frase como veio, mesma régua de `resolveMessage`.
    const result = withComponent(({ resolveFieldError }) =>
      resolveFieldError('sku', 'This field looks fine already.'),
    )
    expect(result).toBe('This field looks fine already.')
  })
})
