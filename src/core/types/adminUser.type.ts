import type { components } from '@/core/api/schema'
import type { UserRole } from '@/core/store/types/auth.type'

type AdminUserResource = components['schemas']['AdminUserResource']

/**
 * Vive em `core/` (não em `modules/identity/`, onde nasceu na Fase 6) —
 * achado real, 2026-09-01: `AdminAuditLogResource` (Platform) passou a
 * embutir `user`/`impersonator` com esse MESMO shape (pedido direto do
 * usuário, resolvido pela sessão de backend no mesmo dia — antes só
 * vinha `user_id`/`impersonated_by` crus, exibidos como UUID mesmo,
 * achado real registrado na Fase 5). Um módulo nunca importa de outro
 * módulo diretamente (`docs/infra/convencoes-frontend-infra.md` seção
 * 2) — mesmo critério já usado pra `toFavoriteItem`/`ImpersonatedBy`
 * (`core/store/types/auth.type.ts`): o mapper sobe pra `core/`, que
 * `modules/identity/` (dono original) e `modules/platform/` (novo
 * consumidor, `AuditLog.user`/`AuditLog.impersonator`) já podem
 * importar sem cruzar módulos.
 *
 * `role`/`status` chegam como `string` solto do schema gerado (Scramble
 * não carrega o enum do backend pra cá) — mesmo cast seguro já usado em
 * `toAuthUser` (`modules/identity/types/user.type.ts`): `USER.role` só
 * aceita `admin_master`/`user`. `status` tem 3 valores reais no backend
 * (`UserStatus` enum: `active`/`suspended`/`deleted`) — `deleted` nunca
 * chega por este caminho na prática (exclusão é sempre via
 * `DeleteUserAccountAction`, autoatendimento, não pelo
 * `UpdateUserByAdminRequest` que só aceita `active`/`suspended` —
 * decisão de propósito, exclusão passa pelo fluxo dedicado de
 * anonimização, nunca por um PATCH genérico de role/status).
 *
 * **`document` removido em 2026-09-02** (tarefa 63, mudança de contrato
 * do backend) — CPF/CNPJ saiu de `USER` pra virar `COMPANY`, entidade
 * própria (`modules/identity/types/company.type.ts`). `AdminUserResource`
 * não expõe mais esse campo.
 */
export type AdminUserStatus = 'active' | 'suspended' | 'deleted'

export interface AdminUser {
  createdAt: string | null
  email: string
  emailVerifiedAt: string | null
  id: string
  name: string
  role: UserRole
  status: AdminUserStatus
}

export function toAdminUser(resource: AdminUserResource): AdminUser {
  return {
    createdAt: resource.created_at,
    email: resource.email,
    emailVerifiedAt: resource.email_verified_at,
    id: resource.id,
    name: resource.name,
    role: resource.role as UserRole,
    status: resource.status as AdminUserStatus,
  }
}

/**
 * Mapeamento status→cor pro `StatusDot.vue` — mesmo critério de
 * `subscriptionStatusColor`/`transactionStatusColor` (o átomo não sabe o
 * que "suspended" significa, decisão do consumidor).
 */
export function adminUserStatusColor(status: AdminUserStatus): 'gray' | 'green' | 'yellow' {
  switch (status) {
    case 'active':
      return 'green'
    case 'suspended':
      return 'yellow'
    default:
      return 'gray'
  }
}
