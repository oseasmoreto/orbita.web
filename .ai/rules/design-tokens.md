---
paths:
  - src/core/styles/**
---

# Design tokens (`_tokens.scss` / `_variables.scss`)

## Dark-mode selector must be anchored to `:root` — a bare attribute selector matches ANY element
`_tokens.scss` originally had `[data-theme='dark'] { ... }` without `:root` — that selector matches any element in the page carrying that attribute, not just the document root. Discovered integrating `vue-sonner`: `<Toaster theme="dark">` sets `data-theme="dark"` on its own container (the package's own unrelated convention, coincidental name collision) — without the `:root` anchor, this activated Orbita's entire dark palette inside the toaster's subtree only, breaking anything of ours that happened to render there. Fixed to `:root[data-theme='dark']`. Any new selector touching theme tokens must use this anchored form — never a bare `[data-theme='dark']`.

## `--color-bg-2` is translucent in dark mode by design — wrong choice for an isolated portal surface
Dark-mode `--color-bg-2: rgb(255 255 255 / 4%)` is the real Figma source value, correct as transcribed — it's meant to be composed **on top of** an opaque `--color-bg-1` surface within the same Figma layer stack (e.g. the static desktop sidebar column, which sits directly against `body`'s opaque `bg-1` and looks solid by coincidence of context). It is the wrong token for anything rendered in a portal/`position: fixed` with no guaranteed opaque `bg-1` immediately behind it (a `Drawer`/`Modal`/mobile nav drawer) — the composition reads as translucent/see-through there. Use `$color-bg-1` (opaque in both themes) for any isolated overlay surface — this is what `Modal.vue`/`Drawer.vue` already did; `AppSidebar.vue`'s mobile drawer was the one component that had copied `$color-bg-2` from its own desktop sibling without considering the different paint context.

## `$color-ink`/`$color-paper` flip with the theme — wrong choice for a surface that doesn't
`$color-ink`/`$color-paper` are semantic ("high-contrast text" / "text over a solid ink-filled area") and swap literal values between themes (ink: black→white, paper: white→black) — correct for anything that should look consistent as "high contrast on this component's own surface" regardless of theme. Two real cases where this broke things because the SURFACE they sit on does **not** flip with the theme:
- `StatCard.vue`/`IconTile.vue` draw text/icon on `{colors.tint-1}`/`{colors.tint-2}`, which have no dark variant (same pastel value in both themes) — using `$color-ink` for the text made it turn white in dark mode, disappearing against a background that stayed light.
- The `vue-sonner` toast (`main.scss`) is deliberately always-dark regardless of app theme (`theme="dark"` hardcoded on `<Toaster>`) — using `$color-ink`/`$color-paper` for its `--normal-bg`/`--normal-text` meant the "always dark" card turned white the moment the app's own dark mode was toggled on.
- Fix for both: `$color-ink-fixed`/`$color-paper-fixed` (`_tokens.scss`) — defined once in `:root`, **never** redefined inside `:root[data-theme='dark']`, so they always resolve to the SnowUI-Light value no matter what theme is active. Reach for these whenever text/icon color needs to stay correct against a surface that itself doesn't flip with the theme — never `$color-ink`/`$color-paper` in that situation.

## Adding a new color/spacing/radius value that isn't in the scale
Never invent a value outside the documented scale (`docs/design/design-system.md`, "Iteration Guide"). If a component genuinely needs a value not yet in `_tokens.scss`, it already exists in the Figma token export source (`docs/design/tokens/`) — bring the missing value in from there, don't hardcode a hex/px directly in a component's `<style>`.
