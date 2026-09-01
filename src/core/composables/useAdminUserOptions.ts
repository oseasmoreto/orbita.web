import { ref } from 'vue'
import { listAdminUsers } from '@/modules/identity/services/identityApi'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

/**
 * Lista de usuários pra popular `Select`/filtro de "quem" (usuário
 * específico) — cruza 3 módulos (Billing: assinaturas/transações admin;
 * Support: chamados admin; Platform: notificar 1 usuário), por isso mora
 * em `core/` e não em `modules/identity/` (mesmo critério de promoção já
 * usado pra `AdminUser`/`toFavoriteItem` — sobe quando um SEGUNDO
 * consumidor real precisa, aqui já nasce com 3). `core/` importando de
 * `modules/identity/services/` é o mesmo padrão já usado em
 * `core/router/guards.ts` (`fetchCurrentUser`) — a regra de fronteira
 * (`docs/infra/convencoes-frontend-infra.md` seção 2) proíbe módulo→
 * módulo, nunca core→módulo.
 *
 * `perPage: 100` — mesmo critério de "sem paginação de verdade ainda"
 * já usado em `listPlans`/outros pickers do projeto: MVP não tem volume
 * de usuário que justifique um Combobox com busca server-side.
 */
export function useAdminUserOptions() {
  const options = ref<SelectOption[]>([])
  const isLoading = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      const result = await listAdminUsers({ perPage: 100, sort: 'name' })
      options.value = result.items.map((user) => ({ label: user.name, value: user.id }))
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, load, options }
}
