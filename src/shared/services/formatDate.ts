import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

/**
 * Auto-contido de propósito — registra o plugin (`dayjs.extend`) e a
 * locale aqui, em vez de depender só do `dayjs.locale('pt-br')` de
 * `main.ts` (que não roda no ambiente de teste, Vitest nunca importa o
 * bootstrap da app). `dayjs.locale()` é idempotente (mesma locale
 * chamada 2x não conflita), então isso convive sem problema com a
 * chamada já existente em `main.ts` pro resto do app.
 */
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function formatRelativeTime(value: string | null): string {
  return value ? dayjs(value).fromNow() : '—'
}
