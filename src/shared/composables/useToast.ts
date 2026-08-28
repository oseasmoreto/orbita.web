import type { ExternalToast } from 'vue-sonner'
import { toast } from 'vue-sonner'

/**
 * Wrapper fino sobre `vue-sonner` (seção 15.3 de
 * docs/infra/convencoes-frontend-infra.md: "Base do composable useToast
 * de shared/composables"). Sem lógica de decisão — cada método é um
 * repasse 1:1 pro `toast.*` correspondente, então não é candidato a
 * test-first (mesma régua de "services/utils puros" só vale quando há
 * ramificação real pra testar).
 *
 * Ícones/cores por tipo (`success`/`error`/`warning`/`info`) são
 * configurados uma única vez no `<Toaster :icons="...">` de `App.vue`,
 * não aqui — nunca precisam ser repassados em cada chamada.
 *
 * `message` cobre o tipo "default" do vue-sonner (`toast()` sem sufixo,
 * já usado em `core/pwa/useAppUpdatePrompt.ts`) — sem ícone próprio, é o
 * caso mais neutro.
 */
export function useToast() {
  return {
    error: (message: string, options?: ExternalToast) => toast.error(message, options),
    info: (message: string, options?: ExternalToast) => toast.info(message, options),
    message: (message: string, options?: ExternalToast) => toast(message, options),
    success: (message: string, options?: ExternalToast) => toast.success(message, options),
    warning: (message: string, options?: ExternalToast) => toast.warning(message, options),
  }
}
