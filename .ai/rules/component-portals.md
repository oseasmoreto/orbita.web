---
paths:
  - src/shared/components/ui/**
  - src/shared/components/blocks/**
---

# Component portals (Reka UI / vaul-vue)

## Anything teleported (`SelectContent`, `TooltipContent`, `DropdownMenuContent`, `PopoverContent`, `DialogContent`, `DrawerContent`) needs `:global(...)` styles
`Select.vue`, `Tooltip.vue`, `DropdownMenu.vue`, `Modal.vue`, `Drawer.vue`, `DatePicker.vue`/`DateRangePicker.vue` (via `Popover`) all render their floating/overlay content through a Reka UI (or vaul-vue) portal — teleported to the end of `<body>`, outside this component's own DOM subtree. Vue's `scoped` style attribute only reaches elements that are physically inside the component's rendered tree at compile time, so a normal scoped rule silently does nothing to portaled content — wrap every selector targeting it in `:global(...)`.

## Never nest `&[attr]`/`&:pseudo` inside a `:global(...)` block — write the full selector flat instead
Real bug, `Select.vue`: every dropdown option rendered with the "disabled" color even though only some were actually disabled. Cause: `:global(.ui-select-item) { &[data-disabled] { ... } }` — Sass compiles the `&`-nested rule losing the `:global()` wrapper's literal-selector guarantee, producing `.ui-select-item { ... }` **without** the attribute at all, so the "disabled" style applied to every item regardless of state. Confirmed by inspecting the actual compiled rule in `document.styleSheets`. Fix: write the complete selector flat inside `:global(...)` — `:global(.ui-select-item[data-disabled]) { ... }`, never `&[data-disabled]` nested one level in. Applied preemptively (and correctly) to `DatePicker.vue`'s `[data-selected]`/`[data-today]`/`[data-outside-view]`/`[data-disabled]` rules and `DateRangePicker.vue`'s equivalents — write it flat from the start, don't discover this bug again per component.

## A component inside a `<table>` with `table-layout: auto` can collapse to `width: 0`
`DataTable.vue`'s row-selection `Checkbox` measured `width: 0` via `getBoundingClientRect()` even with the `<td>` correctly sized and the SVG's own `width` attribute present — the global reset (`svg { max-width: 100% }`, `_reset.scss`) creates a circular layout dependency inside a table cell with `table-layout: auto` (the cell wants to size to content, the content wants to be 100% of the cell). Not a bug in the child component itself — it renders fine outside a table. Fix, scoped to the table only: `.ui-data-table :deep(svg) { max-width: none; }` — `:deep()` reaches any descendant SVG by DOM position, covering both the table's own icons and anything a consumer puts in a cell slot, without every consumer needing to remember the fix.
