import { ref, shallowRef } from 'vue'

/**
 * Estado genérico de "confirmar antes de fazer algo destrutivo" (excluir
 * produto, desconectar marketplace, cancelar assinatura...) — mesma
 * família de `useResourceList.ts`/`useCrudDrawer.ts`, pedida pelo
 * usuário como padrão reutilizável entre CRUDs. Combina naturalmente com
 * `ConfirmDialog.vue` (`v-model:open="isOpen"`, `@confirm="..."`).
 *
 * `confirm()` propaga o erro do `handler` (nunca engole) e SÓ fecha o
 * diálogo/limpa o alvo depois do handler resolver com sucesso — se a
 * exclusão falhar (rede, 422, etc.), o diálogo continua aberto com o
 * mesmo alvo, pra quem chamou decidir o que fazer (toast de erro,
 * permitir tentar de novo) sem perder o contexto de qual item era.
 */
export function useConfirmAction<T>() {
  const isOpen = ref(false)
  // shallowRef, não ref — mesmo motivo de `useCrudDrawer.ts`: `T` é uma
  // entidade de domínio externa, o composable só segura a referência.
  const target = shallowRef<T | null>(null)

  function request(item: T): void {
    target.value = item
    isOpen.value = true
  }

  function cancel(): void {
    isOpen.value = false
    target.value = null
  }

  async function confirm(handler: (item: T) => Promise<void> | void): Promise<void> {
    if (!target.value) {
      return
    }

    await handler(target.value)
    isOpen.value = false
    target.value = null
  }

  return { cancel, confirm, isOpen, request, target }
}
