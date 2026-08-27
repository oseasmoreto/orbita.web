<script setup lang="ts">
/**
 * Grounded no frame "Dropdown" do Figma (`COMPONENT_SET #4113:42552`) —
 * mas só a variante mais simples ("Type=Fewer Items"): item = ícone +
 * texto, separador entre grupos. As variantes "More Items" (busca dentro
 * do menu, submenu com `ArrowLineRight`, item com toggle, item com
 * Badge-Tag de valor) existem no Figma mas são pensadas pra um menu de
 * gerenciamento de coluna de planilha — fora do que o Orbita precisa hoje
 * (Tier 7 do catálogo é literalmente "menu de ação de linha" do
 * `DataTable`: Editar/Baixar/Excluir). Escopo revisitável se um caso de
 * uso real pedir submenu/busca.
 *
 * **Correção sobre a decisão original do catálogo**: a linha "Form →
 * Type=Select-A/B, Dropdown" da Tier 1 tratava "Dropdown" como sinônimo
 * do combobox `Select.vue` — só depois de examinar o frame "Dropdown" de
 * verdade (que tem `_Dropdown Item`, separador, sem valor selecionado)
 * ficou claro que é um menu de ação (Reka UI `DropdownMenu*`), estrutura
 * diferente de um combobox de formulário. Mesma classe de correção já
 * feita pro `Search.vue` (Tier 4).
 */
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import Icon from './Icon.vue'
import type { DropdownMenuOption } from './types/dropdownMenu.type'

defineProps<{
  options: DropdownMenuOption[]
}>()

const emit = defineEmits<{
  select: [key: string]
}>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent align="end" class="ui-dropdown-menu-content" :side-offset="4">
        <template v-for="option in options" :key="option.key">
          <DropdownMenuSeparator v-if="option.separatorBefore" class="ui-dropdown-menu-separator" />
          <DropdownMenuItem class="ui-dropdown-menu-item" @select="emit('select', option.key)">
            <Icon v-if="option.icon" :icon="option.icon" :size="16" />
            <span>{{ option.label }}</span>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

// `DropdownMenuPortal` teletransporta pro fim do <body>, mesmo achado já
// documentado pro Select/Tooltip/Modal — seletores sempre "planos" dentro
// do `:global(...)`, nunca `&` aninhado (bug real já corrigido no Select).
:global(.ui-dropdown-menu-content) {
  z-index: 50;
  min-width: 174px;
  padding: $spacing-8;
  background-color: $color-bg-1;
  // O Figma usa um efeito "BG blur 40" atrás do menu — não existe token
  // de blur na escala, valor abaixo é aproximado (mesmo critério já usado
  // no Tooltip), não uma medida exata do componente de origem.
  backdrop-filter: blur(8px);
  border-radius: $radius-8;
}

:global(.ui-dropdown-menu-item) {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;
  border-radius: $radius-8;
}

:global(.ui-dropdown-menu-item[data-highlighted]) {
  outline: none;
  background-color: $color-ink-4;
}

:global(.ui-dropdown-menu-separator) {
  height: 1px;
  margin: $spacing-4 0;
  background-color: $color-ink-4;
}
</style>
