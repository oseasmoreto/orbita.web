import type { Component } from 'vue'

export interface NotificationItemData {
  icon: Component
  /** Espelha `USER_NOTIFICATION.read` (docs/negocio/contexto-plataforma-precificacao.md
   * seção 2.5) — "lida"/"não lida" mora na entrega, nunca na notificação em si. */
  read: boolean
  /** Já formatado ("Just now", "2 hours ago"...) — formatação de data fica no composable do módulo, não aqui. */
  timestamp: string
  /** Cor de fundo do tile do ícone — grounded nos 2 tons vistos no Figma. */
  tint: 'blue' | 'purple'
  title: string
}
