import { createI18n } from 'vue-i18n'
import ptBR from './messages/pt-BR'

export const i18n = createI18n({
  fallbackLocale: 'pt-BR',
  legacy: false,
  locale: 'pt-BR',
  messages: { 'pt-BR': ptBR },
})
