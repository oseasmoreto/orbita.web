/**
 * Catálogo pt-BR — resolve ApiMessageKey/NotificationMessageKey → texto
 * (docs/infra/convencoes-frontend-infra.md seção 6.3). Única locale no MVP.
 * Preenchido progressivamente conforme cada módulo integra um endpoint novo;
 * chave sem entrada aqui é tratada como texto livre pelo useApiMessage
 * (shared/composables/useApiMessage.ts) — nunca falha por chave ausente.
 */
export default {
  errors: {
    unknown: 'Ocorreu um erro inesperado. Tente novamente.',
  },
} as const
