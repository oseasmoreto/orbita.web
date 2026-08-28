<script setup lang="ts">
/**
 * Grounded na captura real do usuário — copyright à esquerda + links de
 * navegação à direita, mesma barra horizontal já usada por `AppHeader.vue`
 * (padding, `border`, tratamento de link idêntico ao `Breadcrumb.vue`:
 * `{colors.ink-40}` apagado, hover `{colors.ink}` + `{colors.ink-4}` de
 * fundo). A captura mostrava duas variantes lado a lado (fundo claro e
 * fundo quase preto) — não são dois "variant" fixos: são o mesmo
 * componente sob tema claro/escuro (mesmo espírito de "Modo escuro já
 * está cabeado... um componente novo não precisa de nenhum código
 * condicional de tema, só use as variáveis SCSS normalmente", seção
 * Iteration Guide de design-system.md). `{colors.bg-2}` já resolve pro
 * cinza quase-preto (`#333333`) sob `[data-theme='dark']` sem nenhum prop
 * novo — não foi criado um `variant="dark"` de propósito, pra não competir
 * com o token semântico que já faz o mesmo trabalho.
 *
 * Não montado em `AppLayout.vue` ainda — nenhuma tela do plano atual
 * define o conteúdo real de "Support"/"Contact Us" (nem se existem como
 * rota), mesmo critério de "casca pronta" já usado no `DatePicker`/
 * `TagsInput` (Tier 11/12 do catálogo).
 */
import dayjs from 'dayjs'
import type { FooterLink } from './types/footer.type'

withDefaults(
  defineProps<{
    copyright?: string
    links?: FooterLink[]
  }>(),
  {
    copyright: `© ${dayjs().year()} Orbita`,
    links: () => [],
  },
)
</script>

<template>
  <footer class="app-footer">
    <span class="app-footer__copyright">{{ copyright }}</span>
    <nav v-if="links.length" aria-label="Links do rodapé" class="app-footer__nav">
      <RouterLink v-for="link in links" :key="link.label" class="app-footer__link" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </nav>
  </footer>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-16 $spacing-24;
  background-color: $color-bg-2;
  border-top: 1px solid $color-ink-10;
}

.app-footer__copyright {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.app-footer__nav {
  display: flex;
  gap: $spacing-8;
}

// Mesmo tratamento de link apagado/hover já usado no `Breadcrumb.vue`
// (`{colors.ink-40}` → `{colors.ink}` + `{colors.ink-4}` de fundo).
.app-footer__link {
  padding: $spacing-4 $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
  text-decoration: none;
  border-radius: $radius-8;

  &:hover {
    color: $color-ink;
    background-color: $color-ink-4;
  }
}
</style>
