import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'

interface Product {
  id: string
  name: string
}

describe('useCrudDrawer', () => {
  it('starts closed, in create mode, with no editing record', () => {
    const drawer = useCrudDrawer<Product>()

    expect(drawer.isOpen.value).toBe(false)
    expect(drawer.mode.value).toBe('create')
    expect(drawer.editingRecord.value).toBeNull()
  })

  it('openCreate opens in create mode with no record, even after an edit', () => {
    const drawer = useCrudDrawer<Product>()
    const product: Product = { id: '1', name: 'Camiseta azul' }

    drawer.openEdit(product)
    drawer.openCreate()

    expect(drawer.isOpen.value).toBe(true)
    expect(drawer.mode.value).toBe('create')
    expect(drawer.editingRecord.value).toBeNull()
  })

  it('openEdit opens in edit mode with the given record', () => {
    const drawer = useCrudDrawer<Product>()
    const product: Product = { id: '2', name: 'Tênis esportivo' }

    drawer.openEdit(product)

    expect(drawer.isOpen.value).toBe(true)
    expect(drawer.mode.value).toBe('edit')
    expect(drawer.editingRecord.value).toBe(product)
  })

  it('close only closes the drawer, keeping mode/record so a closing transition can still show content', () => {
    const drawer = useCrudDrawer<Product>()
    const product: Product = { id: '3', name: 'Fone de ouvido' }

    drawer.openEdit(product)
    drawer.close()

    expect(drawer.isOpen.value).toBe(false)
    expect(drawer.mode.value).toBe('edit')
    expect(drawer.editingRecord.value).toBe(product)
  })
})
