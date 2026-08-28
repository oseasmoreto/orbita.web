import { ref, shallowRef } from 'vue'

export type CrudDrawerMode = 'create' | 'edit'

/**
 * Estado genérico de "criar/editar num painel lateral" — mesmo padrão
 * pedido pelo usuário em `useResourceList.ts`: um composable por
 * PREOCUPAÇÃO reutilizável entre CRUDs, não por entidade. `T` genérico
 * (o registro sendo editado); `modules/catalog`'s `ProductsView.vue` é o
 * primeiro consumidor concreto (`Drawer.vue` + `ProductForm.vue` — o
 * mesmo componente de formulário serve criação e edição, diferenciado
 * por `mode`).
 */
export function useCrudDrawer<T>() {
  const isOpen = ref(false)
  const mode = ref<CrudDrawerMode>('create')
  // shallowRef, não ref: `T` é uma entidade de domínio externa (ex.:
  // `Product`) — o composable só precisa segurar a REFERÊNCIA, não
  // torná-la profundamente reativa. `ref()` envolveria o objeto num
  // Proxy reativo, quebrando igualdade de referência com o objeto
  // original (confirmado via teste: `toBe(product)` falhava mesmo
  // segurando o mesmo objeto).
  const editingRecord = shallowRef<T | null>(null)

  function openCreate(): void {
    mode.value = 'create'
    editingRecord.value = null
    isOpen.value = true
  }

  function openEdit(record: T): void {
    mode.value = 'edit'
    editingRecord.value = record
    isOpen.value = true
  }

  /**
   * Só fecha — não reseta `mode`/`editingRecord` de propósito, pra uma
   * transição de fechamento do `Drawer` (`vaul-vue`, animado) continuar
   * mostrando o conteúdo certo enquanto desliza pra fora, em vez de
   * trocar pro estado "create" no meio da animação.
   */
  function close(): void {
    isOpen.value = false
  }

  return { close, editingRecord, isOpen, mode, openCreate, openEdit }
}
