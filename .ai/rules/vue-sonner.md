---
paths:
  - src/App.vue
  - src/core/styles/main.scss
  - src/shared/composables/useToast.ts
---

# vue-sonner (toast)

## `vue-sonner/style.css` must be imported explicitly — importing the `<Toaster>` component alone does nothing
`import { Toaster } from 'vue-sonner'` does not pull in the package's CSS — it's a separate export (`vue-sonner/style.css`). Without it, the toast renders with `position: static`, no background/radius/z-index, effectively invisible in the normal page flow. This was true in this project from the moment `useAppUpdatePrompt.ts`'s update-prompt toast was first wired up — nobody had actually looked at it rendered in a real browser until much later. Import it once, in `main.ts`, alongside `main.scss`.

## Overriding vue-sonner's own CSS variables needs `!important` — its own rule is more specific than a plain `[data-sonner-toaster]` selector
The package defines its dark-theme variables via `[data-sonner-toaster][data-sonner-theme='dark'] { --normal-bg: ...; }` — two attribute selectors, specificity 0-0-2-0. A project override written as a single `[data-sonner-toaster] { --normal-bg: ...; }` (0-0-1-0) always loses regardless of source order. Every property overridden in `main.scss`'s `[data-sonner-toaster]` block needs `!important`, not just the ones that look like they need it — confirmed via `getComputedStyle` before the fix (background/border/radius all resolving to the package's own generic values, not the project's tokens).

## The `icons` prop on `<Toaster>` does not wire per-type icons — only `icons.close` is read that way
`ToasterProps.icons` looks like it should map `success`/`error`/`warning`/`info` icons by name, but reading the package's compiled source shows only `icons.close` is actually consumed this way. Per-type icons are configured through named slots instead — `#success-icon`, `#error-icon`, `#warning-icon`, `#info-icon` on `<Toaster>` — each rendered once in `App.vue`, never passed per-`toast()` call.

## The toast is deliberately always-dark regardless of app theme — never `$color-ink`/`$color-paper` for its colors
See `.ai/rules/design-tokens.md` — `theme="dark"` is hardcoded on `<Toaster>` on purpose (matches the reference screenshot's fixed dark card in both light and dark app screenshots), so its `--normal-bg`/`--normal-text` must use `$color-ink-fixed`/`$color-paper-fixed`, not the theme-flipping `$color-ink`/`$color-paper` — the latter turns the "always dark" card white the instant the app's own dark mode is on.

## The toaster's own mobile CSS makes it 16px wider than the viewport — a `position: fixed` element that does this leaks into page-level horizontal scroll even with zero toasts visible
`node_modules/vue-sonner/lib/index.css`'s `@media (max-width: 600px)` rule sets `left`/`right` (both from `--mobile-offset-*`) **and** `width: 100%` on the same `position: fixed` container — over-constrained; per the CSS spec, `right` is ignored once `left`+`width` already close the box, so the element ends up exactly `--mobile-offset-right` wider than the viewport. A `position: fixed` element that overflows the viewport contributes to `document.body.scrollWidth` regardless of whether it's visible (no toast needs to be showing) — this alone was enough to make the whole page horizontally scrollable on mobile. Do not attempt to patch vue-sonner's own width/positioning math (the toast items' own width formula depends on the toaster's nominal 100% width in a way that's easy to break by "fixing" only the container). The correct, general fix lives in `core/styles/_reset.scss`: `html, body { overflow-x: hidden; }` — this also defends against any other stray fixed/absolute element (ours or a future dependency's) doing the same thing, without touching vue-sonner. `overflow-x: auto` containers with their own intentional horizontal scroll (`DataTable.vue`'s wrapper) are unaffected — only the document-level scroll is blocked.
