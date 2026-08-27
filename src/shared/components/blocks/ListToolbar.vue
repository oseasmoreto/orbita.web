<script setup lang="ts">
/**
 * Grounded na instância "Function Bar" do Figma (`#4113:42235`, ao lado do
 * frame "Table" — mas o mesmo padrão aparece solto em outras telas, não é
 * exclusivo de tabela, daí o nome genérico em vez de `TableToolbar`).
 * Fundo `{colors.bg-2}` (aproximação de "#F7F9FB", mesmo critério já usado
 * em valores fora da escala sólida), 3 botões ghost em grupo (Adicionar/
 * Filtro/Ordenar — o "Button Group" do Figma não é um primitivo próprio,
 * é só 3 `Button` com gap 8px, confirmado sem borda compartilhada entre
 * eles) + `Search`.
 *
 * Puramente de apresentação — não decide o que "adicionar"/"filtrar"/
 * "ordenar" fazem de verdade, só emite os eventos e repassa o texto de
 * busca via `v-model:search` (seção 3.2 de
 * docs/infra/convencoes-frontend-infra.md, bloco nunca tem regra de
 * negócio).
 */
import { ArrowsDownUp, FunnelSimple, Plus } from '@/shared/components/icons/regular.generated'
import Button from '../ui/Button.vue'
import Search from '../ui/Search.vue'

withDefaults(
  defineProps<{
    searchPlaceholder?: string
  }>(),
  {
    searchPlaceholder: 'Buscar',
  },
)

const emit = defineEmits<{
  add: []
  filter: []
  sort: []
}>()

const search = defineModel<string>('search', { default: '' })
</script>

<template>
  <div class="ui-toolbar">
    <div class="ui-toolbar__actions">
      <Button aria-label="Adicionar" :icon-before="Plus" variant="ghost" @click="emit('add')" />
      <Button
        aria-label="Filtrar"
        :icon-before="FunnelSimple"
        variant="ghost"
        @click="emit('filter')"
      />
      <Button
        aria-label="Ordenar"
        :icon-before="ArrowsDownUp"
        variant="ghost"
        @click="emit('sort')"
      />
    </div>
    <Search v-model="search" :placeholder="searchPlaceholder" />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ui-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-8;
  padding: $spacing-8;
  background-color: $color-bg-2;
  border-radius: $radius-8;
}

.ui-toolbar__actions {
  display: flex;
  align-items: center;
  gap: $spacing-8;
}
</style>
