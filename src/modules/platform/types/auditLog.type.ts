import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'

type AdminAuditLogResource = components['schemas']['AdminAuditLogResource']

/**
 * Tipo de domínio em cima de `AdminAuditLogResource` gerado (seção 6.1
 * de `docs/infra/convencoes-frontend-infra.md`). `user`/`impersonator` —
 * pedido pra sessão de backend em 2026-09-01 (mesmo dia da Fase 6),
 * resolvido no mesmo dia: achado real registrado antes (`userId`/
 * `impersonatedBy` só vinham como UUID cru, exibidos como tal na tela de
 * auditoria — não tinha como cruzar com `admin-users` sem uma segunda
 * consulta). `userId`/`impersonatedBy` continuam existindo (o backend
 * nunca os removeu, só adicionou os objetos do lado) — mantidos aqui só
 * por completude do mapeamento 1:1 com o resource, mas a UI passa a usar
 * `user.name`/`impersonator?.name` direto, sem cruzamento nenhum.
 */
export interface AuditLog {
  action: string
  createdAt: string | null
  description: string
  id: string
  impersonatedBy: string | null
  impersonator: AdminUser | null
  ipAddress: string
  module: string
  user: AdminUser
  userId: string
}

export function toAuditLog(resource: AdminAuditLogResource): AuditLog {
  return {
    action: resource.action,
    createdAt: resource.created_at,
    description: resource.description,
    id: resource.id,
    impersonatedBy: resource.impersonated_by,
    impersonator: resource.impersonator ? toAdminUser(resource.impersonator) : null,
    ipAddress: resource.ip_address,
    module: resource.module,
    user: toAdminUser(resource.user),
    userId: resource.user_id,
  }
}
