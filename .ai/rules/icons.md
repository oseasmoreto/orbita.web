---
paths:
  - src/shared/components/icons/**
---

# Icons (`regular.generated.ts` / `duotone.generated.ts` / `snow-ui.generated.ts`)

## Never import an icon via the namespace — always the generated module directly
`import { Check } from '@/shared/components/icons/regular.generated'` — never `import { IconsRegular } from '@/shared/components/icons'` then `IconsRegular.Check`. `shared/components/icons/index.ts` deliberately does not re-export the icons for this reason: a single namespace access prevents the bundler from tree-shaking the other ~1250 icons in that module, measured to inflate a chunk from ~1kB to ~2.4MB in a real build. This is non-negotiable, not a style preference.

## `createIcon`'s `inheritAttrs: false` blocks `class`/`style` too, not just the props it's meant to block
`Icon.vue` always passes `stroke-width` (a prop that only makes sense for `@lucide/vue`) — `createIcon.ts` sets `inheritAttrs: false` specifically to stop that from leaking onto the generated `<svg>`. Side effect not noticed until `Spinner.vue`: this also silently blocks `class`/`style` fallthrough, so `<Icon class="ui-spinner" .../>` never reached the DOM at all (confirmed via `document.querySelector` returning `null`, no console warning). Fix, inside a generated-icon component that needs `class`/`style` to actually apply: pull them from `useAttrs()` in `setup()` and pass them into the `h('svg', ...)` call manually — `inheritAttrs: false` keeps blocking everything else (`stroke-width` included), only `class`/`style` need the manual passthrough.

## Some `snow-ui` icons (checkbox/toggle/radio "marked" states) have a literal `fill="white"` cutout, not `currentColor`
The Figma export bakes the inner "mark" of a checked/indeterminate checkbox (and the equivalent toggle/radio states) as a literal `fill="white"` path, while the outer shape uses `currentColor`. This is correct in light mode (outer shape resolves to `ink` = black via `currentColor`, white cutout contrasts against it) but breaks the moment `currentColor` resolves to white (dark mode `ink`) — the literal white cutout becomes invisible against an now-also-white outer shape. The source SVGs (`docs/icons-snow-ui/`) are deleted from disk after generation, so this can't be fixed by regenerating — override it at the consumer, not the generated file: `.ui-checkbox :deep(svg path[fill='white']) { fill: $color-paper; }` (a real stylesheet rule beats the SVG's own presentation attribute). `$color-paper` is correct here specifically because it's meant for "content drawn over a solid ink-filled area" — same semantic role, applied via override instead of at the source. This is a live, not-yet-hit risk for `Toggle`/`Radio` too if either ever switches from CSS-drawn state (current `Toggle.vue`) to these baked icon assets — check for the same `fill="white"` pattern before doing so.
