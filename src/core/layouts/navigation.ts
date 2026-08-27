import { ChartPieSlice } from '@/shared/components/icons/regular.generated'
import type { NavGroup } from './types/navigation.type'

/**
 * Nav real do Orbita — só "Dashboard" por enquanto. Mais grupos/itens
 * entram aqui conforme cada fase de docs/planejamento/plano-implementacao.md
 * ganhar rota real; nunca link morto pra rota que ainda não existe.
 */
export const navGroups: NavGroup[] = [
  {
    items: [{ icon: ChartPieSlice, id: 'dashboard', label: 'Dashboard', to: { name: 'home' } }],
  },
]
