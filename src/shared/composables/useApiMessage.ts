import { useI18n } from 'vue-i18n'

/**
 * Resolve uma ApiMessageKey/NotificationMessageKey catalogada pra texto
 * pt-BR, ou devolve o texto como veio quando a chave é desconhecida (texto
 * livre vindo do backend) — docs/infra/convencoes-frontend-infra.md seção 6.3.
 * Nunca usar `$t`/switch manual direto no componente, sempre por aqui.
 */
export function useApiMessage() {
  const { t, te } = useI18n()

  function resolveMessage(key: string): string {
    return te(key) ? t(key) : key
  }

  return { resolveMessage }
}
