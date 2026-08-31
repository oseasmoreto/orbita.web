import { z } from 'zod'
import { useResourceForm } from '@/shared/composables/useResourceForm'

vi.mock('@/shared/composables/useToast', () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn() }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, te: () => false }),
}))

interface WidgetFormValues {
  name: string
  [key: string]: unknown
}

interface Widget {
  id: string
  name: string
}

const schema = z.object({ name: z.string().min(1, 'name required') })

function buildOptions(overrides: Partial<Parameters<typeof useResourceForm>[0]> = {}) {
  return {
    create: vi.fn(
      async (payload: { name: string }): Promise<Widget> => ({
        id: 'new-id',
        name: payload.name,
      }),
    ),
    emptyValues: (): WidgetFormValues => ({ name: '' }),
    schema,
    successMessage: (mode: 'create' | 'edit') => `success-${mode}`,
    toFormValues: (widget: Widget): WidgetFormValues => ({ name: widget.name }),
    toRequestPayload: (values: WidgetFormValues) => ({ name: values.name }),
    update: vi.fn(
      async (existing: Widget, payload: { name: string }): Promise<Widget> => ({
        id: existing.id,
        name: payload.name,
      }),
    ),
    ...overrides,
  }
}

describe('useResourceForm', () => {
  it('starts with empty values and no error', () => {
    const form = useResourceForm(buildOptions())

    expect(form.values.name).toBe('')
    expect(form.errors.value).toEqual({})
    expect(form.isSubmitting.value).toBe(false)
  })

  it('reset() with no argument restores empty values', () => {
    const form = useResourceForm(buildOptions())
    form.values.name = 'changed'

    form.reset()

    expect(form.values.name).toBe('')
  })

  it('reset(resource) populates values via toFormValues', () => {
    const form = useResourceForm(buildOptions())

    form.reset({ id: '1', name: 'Widget A' })

    expect(form.values.name).toBe('Widget A')
  })

  it('submit() does not call create/update when validation fails', async () => {
    const options = buildOptions()
    const form = useResourceForm(options)

    const result = await form.submit()

    expect(result).toBeNull()
    expect(options.create).not.toHaveBeenCalled()
    expect(form.errors.value.name).toBe('name required')
  })

  it('submit() with no existing resource calls create and returns the new resource', async () => {
    const options = buildOptions()
    const form = useResourceForm(options)
    form.values.name = 'Widget A'

    const result = await form.submit()

    expect(options.create).toHaveBeenCalledWith({ name: 'Widget A' })
    expect(options.update).not.toHaveBeenCalled()
    expect(result).toEqual({ id: 'new-id', name: 'Widget A' })
  })

  it('submit(existing) calls update instead of create', async () => {
    const options = buildOptions()
    const form = useResourceForm(options)
    form.values.name = 'Widget B'
    const existing: Widget = { id: '42', name: 'Widget old' }

    const result = await form.submit(existing)

    expect(options.update).toHaveBeenCalledWith(existing, { name: 'Widget B' })
    expect(options.create).not.toHaveBeenCalled()
    expect(result).toEqual({ id: '42', name: 'Widget B' })
  })

  it('submit() sets isSubmitting true during the call and false after', async () => {
    let sawSubmitting = false
    const options = buildOptions({
      create: vi.fn(async (payload: { name: string }) => {
        sawSubmitting = form.isSubmitting.value
        return { id: 'x', name: payload.name }
      }),
    })
    const form = useResourceForm(options)
    form.values.name = 'Widget A'

    await form.submit()

    expect(sawSubmitting).toBe(true)
    expect(form.isSubmitting.value).toBe(false)
  })

  it('submit() on API failure returns null, keeps isSubmitting false, and does not throw', async () => {
    const options = buildOptions({
      create: vi.fn().mockRejectedValue(new Error('network error')),
    })
    const form = useResourceForm(options)
    form.values.name = 'Widget A'

    const result = await form.submit()

    expect(result).toBeNull()
    expect(form.isSubmitting.value).toBe(false)
  })
})
