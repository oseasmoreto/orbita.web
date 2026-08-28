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
 * Montado uma vez em `AppLayout.vue` (2026-08-28, pedido direto do
 * usuário: "footer fixo no bottom", espelhando o `AppHeader` — sticky,
 * sempre visível, inclusive por cima do conteúdo ao rolar) — não mais
 * page-local. `links` continua `[]` por padrão: nenhuma tela do plano
 * atual define o conteúdo real de "Support"/"Contact Us" (nem se existem
 * como rota), mesmo critério de "casca pronta" já usado no `DatePicker`/
 * `TagsInput` (Tier 11/12 do catálogo) — só o comportamento de
 * posicionamento mudou, o conteúdo real dos links continua em aberto.
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

// Espelha `.app-header` (`AppHeader.vue`): `position: sticky` sem um
// ancestral com `overflow` próprio gruda no viewport de verdade, não só
// no fim do fluxo — decisão explícita do usuário (opção "sempre visível",
// mesmo por cima da tabela ao rolar, contra a alternativa de só aparecer
// no fim da página). Mesmo `z-index: 20` do header — os dois são chrome
// persistente do shell, não overlay (drawer/modal ficam acima, 40/50/100).
// `min-height: 54px` pedido direto do usuário, 2026-08-28: "deixa da
// mesma altura q o footer da sidebar" — `.app-sidebar-content__footer`
// (`AppSidebarContent.vue`) mede 54px de altura renderizada (medido via
// Playwright, não estimado por token de padding/line-height — a primeira
// tentativa via `padding: $spacing-8` no `__copyright` chutou o box model
// do lado da sidebar e passou de 54px pra 64px, "ficou maior"). Valor fixo
// em px, fora da escala de espaçamento de propósito — mesma categoria de
// exceção já documentada no design system pra Badge (padding vertical de
// 1px) e Search (padding horizontal de 6px): não é um valor de design,
// é um pixel-match contra a altura real de outro elemento do shell.
.app-footer {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-24;
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
