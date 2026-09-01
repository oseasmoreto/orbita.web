import type { components } from '@/core/api/schema'

type SettingResource = components['schemas']['SettingResource']

export type SettingType = components['schemas']['SettingType']

/**
 * Tipo de domínio em cima de `SettingResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`) — Fase 6. `hash` é o
 * identificador estável (`docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.5, ex.: `"billing.trial_days"`), PK própria, imutável depois de
 * criado — `UpdateSettingRequest` de propósito não aceita esse campo
 * (pra trocar, exclui e cria de novo com o hash certo).
 */
export interface Setting {
  createdAt: string | null
  hash: string
  name: string
  type: SettingType
  value: string
}

export function toSetting(resource: SettingResource): Setting {
  return {
    createdAt: resource.created_at,
    hash: resource.hash,
    name: resource.name,
    type: resource.type,
    value: resource.value,
  }
}
