<script setup lang="ts">
/**
 * Grounded na instância "Pagination" do Figma (`#4113:42236`, ao lado do
 * frame "Table") — seta anterior/próxima + até 5 botões de número de
 * página, o atual destacado (`{colors.ink-4}`, aproximação de "Black/5%").
 * Lógica de janela (quais 5 números mostrar) e navegação são estado de
 * bloco de verdade (seção 3.2/11.2 de docs/infra/convencoes-frontend-infra.md
 * — "emite update:page ao clicar próximo" é o exemplo canônico de
 * test-first pra blocks), cobertos em
 * tests/shared/components/blocks/PaginationNav.test.ts.
 *
 * Nunca decide o total de páginas/dado real — só recebe `totalPages` e
 * emite a página desejada, quem busca a página nova é o composable do
 * módulo consumidor.
 */
import { computed } from 'vue'
import { ArrowLineLeft, ArrowLineRight } from '@/shared/components/icons/regular.generated'
import Button from '../ui/Button.vue'

const WINDOW_SIZE = 5

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const visiblePages = computed(() => {
  const { currentPage, totalPages } = props

  if (totalPages <= WINDOW_SIZE) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const half = Math.floor(WINDOW_SIZE / 2)
  let start = currentPage - half
  let end = currentPage + half

  if (start < 1) {
    end += 1 - start
    start = 1
  }
  if (end > totalPages) {
    start -= end - totalPages
    end = totalPages
  }
  start = Math.max(1, start)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function goTo(page: number): void {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return
  }
  emit('update:currentPage', page)
}
</script>

<template>
  <nav aria-label="Paginação" class="ui-pagination">
    <Button
      aria-label="Página anterior"
      data-testid="pagination-prev"
      :disabled="currentPage <= 1"
      :icon-before="ArrowLineLeft"
      variant="ghost"
      @click="goTo(currentPage - 1)"
    />

    <Button
      v-for="page in visiblePages"
      :key="page"
      :aria-current="page === currentPage ? 'page' : undefined"
      data-testid="pagination-page"
      :variant="page === currentPage ? 'secondary' : 'ghost'"
      @click="goTo(page)"
    >
      {{ page }}
    </Button>

    <Button
      aria-label="Próxima página"
      data-testid="pagination-next"
      :disabled="currentPage >= totalPages"
      :icon-before="ArrowLineRight"
      variant="ghost"
      @click="goTo(currentPage + 1)"
    />
  </nav>
</template>

<style scoped lang="scss">

.ui-pagination {
  display: flex;
  align-items: center;
  gap: $spacing-8;
}
</style>
