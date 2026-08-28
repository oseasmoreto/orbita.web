import { useConfirmAction } from '@/shared/composables/useConfirmAction'

interface Product {
  id: string
  name: string
}

describe('useConfirmAction', () => {
  it('starts closed with no target', () => {
    const confirmAction = useConfirmAction<Product>()

    expect(confirmAction.isOpen.value).toBe(false)
    expect(confirmAction.target.value).toBeNull()
  })

  it('request opens the confirmation with the given target', () => {
    const confirmAction = useConfirmAction<Product>()
    const product: Product = { id: '1', name: 'Camiseta azul' }

    confirmAction.request(product)

    expect(confirmAction.isOpen.value).toBe(true)
    expect(confirmAction.target.value).toBe(product)
  })

  it('cancel closes and clears the target', () => {
    const confirmAction = useConfirmAction<Product>()
    confirmAction.request({ id: '1', name: 'Camiseta azul' })

    confirmAction.cancel()

    expect(confirmAction.isOpen.value).toBe(false)
    expect(confirmAction.target.value).toBeNull()
  })

  it('confirm calls the handler with the target, then closes and clears it', async () => {
    const confirmAction = useConfirmAction<Product>()
    const product: Product = { id: '2', name: 'Tênis esportivo' }
    const handler = vi.fn().mockResolvedValue(undefined)
    confirmAction.request(product)

    await confirmAction.confirm(handler)

    expect(handler).toHaveBeenCalledWith(product)
    expect(confirmAction.isOpen.value).toBe(false)
    expect(confirmAction.target.value).toBeNull()
  })

  it('confirm is a no-op when there is no pending target', async () => {
    const confirmAction = useConfirmAction<Product>()
    const handler = vi.fn()

    await confirmAction.confirm(handler)

    expect(handler).not.toHaveBeenCalled()
  })

  it('confirm keeps the dialog open if the handler throws', async () => {
    const confirmAction = useConfirmAction<Product>()
    const product: Product = { id: '3', name: 'Fone de ouvido' }
    confirmAction.request(product)
    const handler = vi.fn().mockRejectedValue(new Error('delete failed'))

    await expect(confirmAction.confirm(handler)).rejects.toThrow('delete failed')
    expect(confirmAction.isOpen.value).toBe(true)
    expect(confirmAction.target.value).toBe(product)
  })
})
