import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/composables/useToast'

/**
 * Anexo de imagem em mensagem de chamado (`TICKET_MESSAGE.attachments`,
 * pedido direto do usuário em 2026-09-08 — "possibilidade de subir
 * imagens a cada nova mensagem", com aviso de que precisa persistir em
 * produção). Backend implementado (aviso cross-session da sessão de
 * backend, mesmo dia): upload em base64 no corpo do request — mesmo
 * padrão já usado pro logo de marketplace (`AdminMarketplaceForm.vue`),
 * hospedado no disco `public` do Laravel (o mesmo volume persistente já
 * configurado pra logo — `docker-compose.prod.yml`, `storage-public` —
 * cobre isso também, nenhuma infra nova precisa ser pedida). Até 5
 * imagens por mensagem, 2MB cada, png/jpeg/webp/svg — os 2 limites
 * abaixo espelham exatamente o que o backend valida (`max:5` em
 * `attachments`, mensagem 422 idêntica se algum item não for um data URI
 * de imagem válido), checados aqui só pra dar feedback imediato ao
 * vendedor sem esperar o roundtrip do 422.
 */
export const MAX_TICKET_ATTACHMENTS = 5
export const MAX_TICKET_ATTACHMENT_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED_ATTACHMENT_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

/**
 * Regra de negócio pura, testada isoladamente (seção 11.2 de
 * `docs/infra/convencoes-frontend-infra.md`) — devolve a CHAVE i18n do
 * erro (nunca a mensagem já traduzida, mesmo padrão de `fieldError` do
 * resto do projeto) ou `null` quando o arquivo é aceitável.
 */
export function validateAttachmentFile(file: File): string | null {
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
    return 'support.tickets.attachments.errors.invalidType'
  }

  if (file.size > MAX_TICKET_ATTACHMENT_SIZE_BYTES) {
    return 'support.tickets.attachments.errors.tooLarge'
  }

  return null
}

/**
 * Regra pura — se dá pra adicionar mais 1 anexo dado o total já
 * selecionado.
 */
export function canAddAttachment(currentCount: number): boolean {
  return currentCount < MAX_TICKET_ATTACHMENTS
}

export interface TicketAttachmentDraft {
  dataUrl: string
  id: string
  name: string
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('FileReader did not return a data URL'))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'))
    reader.readAsDataURL(file)
  })
}

/**
 * Estado dos anexos ainda não enviados, num composer de mensagem —
 * encanamento fino em cima das 2 regras puras acima (conversão via
 * `FileReader`, mesma técnica já usada em `AdminMarketplaceForm.vue`,
 * não precisa de teste próprio). Reaproveitado pelos 3 pontos que
 * compõem mensagem de chamado (`CreateTicketForm.vue`,
 * `TicketThreadPanel.vue`, `AdminTicketThreadPanel.vue`) — fica em
 * `modules/support/composables/` (não `shared/`) porque os 3
 * consumidores são deste módulo; sobe pra `shared/` só se um segundo
 * módulo precisar do mesmo picker de imagem.
 */
export function useTicketAttachments() {
  const { t } = useI18n()
  const toast = useToast()

  const drafts = ref<TicketAttachmentDraft[]>([])

  /**
   * 2 fases de propósito — não é só pra passar no lint
   * (`lint/performance/noAwaitInLoops` do Biome, achado real no
   * pre-commit): decidir QUAIS arquivos entram (contagem contra o teto
   * de 5 + validação de tipo/tamanho) é síncrono, então roda num loop
   * comum sem `await`; só a CONVERSÃO pra base64 é assíncrona, e como
   * cada arquivo já foi aceito de forma independente, dá pra converter
   * todos em paralelo (`Promise.all`) em vez de um de cada vez — mais
   * rápido pro vendedor, sem mudar o resultado (a ordem de seleção é
   * preservada, `Promise.all` sempre resolve na ordem do array de
   * entrada, não na ordem de conclusão).
   */
  async function addFiles(files: FileList | File[]): Promise<void> {
    const acceptedFiles: File[] = []
    let projectedCount = drafts.value.length

    for (const file of Array.from(files)) {
      if (!canAddAttachment(projectedCount)) {
        toast.error(t('support.tickets.attachments.errors.tooMany'))
        break
      }

      const errorKey = validateAttachmentFile(file)

      if (errorKey) {
        toast.error(t(errorKey))
        continue
      }

      acceptedFiles.push(file)
      projectedCount += 1
    }

    const newDrafts = await Promise.all(
      acceptedFiles.map(async (file) => ({
        dataUrl: await readFileAsDataUrl(file),
        id: crypto.randomUUID(),
        name: file.name,
      })),
    )

    drafts.value.push(...newDrafts)
  }

  function removeAttachment(id: string): void {
    drafts.value = drafts.value.filter((draft) => draft.id !== id)
  }

  function reset(): void {
    drafts.value = []
  }

  return { addFiles, drafts, removeAttachment, reset }
}
