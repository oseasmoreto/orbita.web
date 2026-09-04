import { ref } from 'vue'
import { listUserMarketplaces } from '@/modules/pricing/services/pricingApi'
import type { UserMarketplace } from '@/modules/pricing/types/userMarketplace.type'

/**
 * `ProductsView.vue` (Catalog) precisa de um atalho pra "Ver
 * precificação" (2026-09-04, pedido direto do usuário), mas a rota de
 * destino (`marketplace-pricing`) é por CONEXÃO
 * (`userMarketplaceId`) — a listagem de produtos não sabe de nenhum
 * marketplace específico ("como vamos chegar aqui sem mktplace, vai ter
 * que pegar a primeira conexão ativa"). Isso cruza módulos (Catalog →
 * Pricing), então mora em `core/` — mesmo critério já usado em
 * `useAdminUserOptions.ts`: `core/` importando de
 * `modules/pricing/services/` é o padrão já estabelecido (módulo→core
 * é permitido, core→módulo também; só módulo→módulo é proibido, seção 2
 * de `docs/infra/convencoes-frontend-infra.md`).
 *
 * "Primeira" = a conexão ATIVA mais antiga (`filter[active]=true`, sem
 * `sort` explícito — ordem default da API, mesmo critério de "sem
 * paginação de verdade ainda" já usado em outros pickers do projeto).
 * `perPage: 1` — só precisamos saber SE existe uma e qual é, não a
 * lista inteira.
 */
export function firstActiveConnectionId(connections: UserMarketplace[]): string | null {
  return connections[0]?.id ?? null
}

export function useFirstActiveMarketplaceConnection() {
  const connectionId = ref<string | null>(null)
  const isLoading = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      const result = await listUserMarketplaces({ active: true, perPage: 1 })
      connectionId.value = firstActiveConnectionId(result.items)
    } finally {
      isLoading.value = false
    }
  }

  return { connectionId, isLoading, load }
}
