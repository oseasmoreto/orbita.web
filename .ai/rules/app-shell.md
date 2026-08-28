---
paths:
  - src/core/layouts/**
---

# App shell (`AppLayout`/`AppHeader`/`AppSidebar`/`useAppShell`)

## `router.back()` can escape the app entirely — always guard with `window.history.state?.back`
`router.back()` calls `window.history.go(-1)` under the hood, which operates on the browser's real session history, not a history scoped to the SPA's own navigation. On a tab with no prior in-app navigation (a fresh tab, or right after a full reload), "back" falls through to whatever the browser's real previous entry was — including a different origin/port entirely (confirmed: landed on a stale `localhost:5175` from an earlier dev-server session). `window.history.state?.back` is written by Vue Router's own `createWebHistory` on every SPA navigation (`{ back, current, forward, ... }`) and is `null`/falsy when there's no real in-app back-target — check it before calling `router.back()`; otherwise make the action a no-op rather than ever risking leaving the app.

## `position: sticky` only pins the axis you set — it does not protect against horizontal scroll desync
`AppHeader.vue`'s `position: sticky; top: 0;` only fixes the vertical axis. If the page has ANY horizontal scroll (even a few px, from something as unrelated as a third-party fixed element overflowing the viewport — see `.ai/rules/vue-sonner.md`) and the user has scrolled right even slightly, the sticky header shifts left along with that scroll while sibling `position: fixed` elements (the mobile drawer, its overlay) stay pinned to the viewport regardless — producing a visible seam/misalignment gap. The real fix is eliminating page-level horizontal scroll entirely (`overflow-x: hidden` on `html, body`, see `.ai/rules/vue-sonner.md`), not trying to make the header horizontally sticky too (`left: 0; right: 0;` would still leave visual artifacts if scroll position itself is nonzero when the drawer opens).

## `useAppShell()` is a module-level singleton, not per-call state — never re-declare its refs locally
`isMobileNavOpen`/`expandedItemIds`/`isNotificationPanelOpen`/`hasUnreadNotifications`/`isDesktopSidebarCollapsed` are declared once at module scope in `composables/useAppShell.ts`, outside the exported function — this is intentional (there's exactly one shell per app, and `AppHeader`'s hamburger button and `AppSidebar`'s drawer must observe the exact same open/closed state, not independent copies). Any new piece of shell-wide UI state (not domain state — this is UI-only, Pinia is for domain state, see `docs/infra/convencoes-frontend-infra.md` §5) goes here the same way, as a module-level `ref` plus an idempotent-safe mutator when a component might call it from `onMounted` on every remount (see `expandItem` vs `toggleItem` — `expandItem` intentionally never collapses, because a component set to "expand by default" would otherwise fight a user who already collapsed it and triggered a remount).

## The nav tree (`config/navigation.ts`) doubles as the breadcrumb's data source — don't hand-maintain a second copy
`composables/useBreadcrumb.ts` derives the header breadcrumb by searching the same `navGroups` tree that feeds the sidebar (`config/navigation.ts`), matching the current route by `to.name` — it does not read a separate `meta.breadcrumb` field or a hand-written trail. Adding a new sidebar item automatically gives it a correct breadcrumb for free as long as its `to` is set; a route with no matching entry in `navGroups` falls back to `route.meta.title` alone, so this never hard-fails for routes the nav tree doesn't know about yet.
