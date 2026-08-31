import { reactive } from 'vue'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'

interface Values {
  quantity: number
  weight: number | null
  [key: string]: unknown
}

describe('useNumberFieldModel', () => {
  it('reads the current numeric value as a string', () => {
    const values = reactive<Values>({ quantity: 3, weight: null })
    const model = useNumberFieldModel(values, 'quantity')

    expect(model.value).toBe('3')
  })

  it('writes back a parsed number on the source object', () => {
    const values = reactive<Values>({ quantity: 3, weight: null })
    const model = useNumberFieldModel(values, 'quantity')

    model.value = '10'

    expect(values.quantity).toBe(10)
  })

  it('defaults an empty string to 0 when not nullable', () => {
    const values = reactive<Values>({ quantity: 3, weight: null })
    const model = useNumberFieldModel(values, 'quantity')

    model.value = ''

    expect(values.quantity).toBe(0)
  })

  it('reads null as an empty string when nullable', () => {
    const values = reactive<Values>({ quantity: 3, weight: null })
    const model = useNumberFieldModel(values, 'weight', { nullable: true })

    expect(model.value).toBe('')
  })

  it('defaults an empty string to null when nullable', () => {
    const values = reactive<Values>({ quantity: 3, weight: 12 })
    const model = useNumberFieldModel(values, 'weight', { nullable: true })

    model.value = ''

    expect(values.weight).toBeNull()
  })

  it('writes back a parsed number on a nullable field', () => {
    const values = reactive<Values>({ quantity: 3, weight: null })
    const model = useNumberFieldModel(values, 'weight', { nullable: true })

    model.value = '7.5'

    expect(values.weight).toBe(7.5)
  })
})
