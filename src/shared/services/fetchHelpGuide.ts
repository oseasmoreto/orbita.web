import type { HelpGuide } from '../types/help.type'

/**
 * Não usa `core/api/client.ts` (a instância axios do backend) de
 * propósito — o guia de ajuda é um arquivo JSON ESTÁTICO servido pelo
 * próprio frontend (`public/guides/onboarding/*.json`, build da Vite),
 * não um endpoint da API: sem sessão/CSRF, sem `VITE_API_BASE_URL`. A
 * régua de "nunca `fetch()` direto fora de `services/`" continua valendo
 * (isolar a chamada de rede da camada de apresentação) — só a exceção do
 * cliente axios não se aplica aqui, é um caso genuinamente diferente de
 * "chamada à API do backend".
 *
 * **`public/guides/`, nunca `public/help/`** — bug real de produção,
 * 2026-09-03: o mesmo nome da rota `/help` colidia com a pasta estática
 * equivalente (`dist/help/` depois do build) e quebrava o F5 no nginx
 * (ver comentário completo em `HelpView.vue`).
 */
export async function fetchHelpGuide(path: string): Promise<HelpGuide> {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Failed to load help guide at ${path} (status ${response.status})`)
  }

  return response.json() as Promise<HelpGuide>
}
