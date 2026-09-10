import { ref } from 'vue'
import { simulateProductMarketplacePricing } from '../services/pricingApi'
import type { PricingEvaluation } from '../types/productMarketplacePricing.type'

/**
 * `GET .../simulate` (2026-09-11, pedido direto do usuário — "testar um
 * preço praticado hipotético antes de aplicar de verdade, sem risco de
 * esquecer de reverter") só faz sentido pra um preço candidato REAL —
 * mesma trava do backend (`min:0.01`, não `min:0`): `null` (campo vazio/
 * ainda não digitado) e valores `<= 0` nunca chamam a API, evitam um
 * `422` previsível e um preview sem sentido nenhum ("simular limpar o
 * preço"/"simular preço negativo").
 */
export function shouldSimulatePracticedPrice(practicedPrice: number | null): boolean {
  return practicedPrice !== null && practicedPrice > 0
}

/**
 * Estado do preview debounced de `UpdatePracticedPriceModal.vue` —
 * `simulate()` é chamado pelo consumidor a cada mudança já debounced do
 * campo (`refDebounced`, `@vueuse/core`, seção 4 de
 * `docs/infra/convencoes-frontend-infra.md` — debounce mora em quem
 * consome, nunca embutido no composable). Erro de rede/`422` limpa o
 * preview em silêncio (sem toast) — é só um preview, o usuário já vê o
 * campo de preço normalmente; o erro de verdade (se houver) aparece no
 * `submit()` de `useUpdatePracticedPriceForm.ts` quando ele de fato
 * tentar aplicar.
 */
export function usePracticedPriceSimulation() {
  const preview = ref<PricingEvaluation | null>(null)
  const isSimulating = ref(false)

  let latestRequestId = 0

  async function simulate(
    productId: string,
    productMarketplaceId: string,
    practicedPrice: number | null,
  ): Promise<void> {
    latestRequestId += 1
    const requestId = latestRequestId

    if (!shouldSimulatePracticedPrice(practicedPrice)) {
      preview.value = null
      isSimulating.value = false
      return
    }

    isSimulating.value = true

    try {
      const result = await simulateProductMarketplacePricing(
        productId,
        productMarketplaceId,
        practicedPrice as number,
      )

      if (requestId === latestRequestId) {
        preview.value = result
      }
    } catch {
      if (requestId === latestRequestId) {
        preview.value = null
      }
    } finally {
      if (requestId === latestRequestId) {
        isSimulating.value = false
      }
    }
  }

  function reset(): void {
    latestRequestId += 1
    preview.value = null
    isSimulating.value = false
  }

  return { isSimulating, preview, reset, simulate }
}
