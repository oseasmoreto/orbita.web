import { useRouter } from 'vue-router'

/**
 * Extraído de `core/layouts/AppHeader.vue` em 2026-09-08 — 2º consumidor
 * real (`ProductMarketplacePricingView.vue`, botão "Voltar" que até
 * então navegava pra uma rota fixa de marketplace em vez de voltar pra
 * onde o usuário realmente veio, ex.: a listagem de produtos), mesmo
 * critério de promoção pra `shared/` já usado no resto do projeto — sobe
 * quando um segundo consumidor precisa de verdade, nunca antecipado.
 *
 * `router.back()` sozinho chama `window.history.go(-1)` por baixo, que
 * opera sobre o histórico de BROWSER inteiro, não só sobre a navegação
 * da SPA — achado real já documentado no `AppHeader.vue`: numa aba sem
 * navegação interna ainda (aba nova, ou depois de um reload), "voltar"
 * escapava pra fora do app inteiro (inclusive origem/porta diferente).
 * `window.history.state?.back` é o próprio Vue Router quem escreve
 * (`createWebHistory` grava `{ back, current, forward, ... }` a cada
 * navegação DA SPA) — a guarda só chama `router.back()` quando existe
 * uma entrada de verdade dentro da navegação da SPA; sem isso, "Voltar"
 * vira um no-op, nunca escapa pra fora do app.
 */
export function useGoBack() {
  const router = useRouter()

  function goBack(): void {
    // `History.state` é tipado `any` pelo DOM nativo — achado real,
    // pego só agora que a lógica saiu de dentro de um `.vue` (onde a
    // regra type-aware do ESLint fica desligada de propósito, seção 10
    // de `docs/infra/convencoes-frontend-infra.md`) pra um `.ts` puro
    // (onde ela roda de verdade): cast explícito pro shape que o Vue
    // Router realmente escreve, em vez de acesso "unsafe" a `any`.
    const state = window.history.state as { back?: string | null } | null

    if (state?.back) {
      router.back()
    }
  }

  return { goBack }
}
