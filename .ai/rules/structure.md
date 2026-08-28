---
paths:
  - src/**/*.ts
  - src/**/*.vue
---

# Structure

## No loose composable/service/store/type/schema file — ever, even when a folder would only have one
Explicit, repeated instruction from the project owner (2026-08-28) after finding real violations: `core/layouts/useAppShell.ts`, `core/layouts/useBreadcrumb.ts`, and `core/pwa/useAppUpdatePrompt.ts` all sat directly inside a feature folder (`layouts/`, `pwa/`) instead of a `composables/` subfolder — `core/layouts/navigation.ts` (static nav data, not a composable) had the same problem. `docs/infra/convencoes-frontend-infra.md` §2 already prescribed `composables/`/`services/`/`types/`/`schemas/` subfolders for `modules/<contexto>/` and `shared/`, but `core/layouts/` grew ad hoc without anyone applying the same rule to it.

The rule, made explicit: every `.ts` file that is a composable, service, store, schema, or type declaration lives inside a subfolder named after its role (`composables/`, `services/`, `types/`, `schemas/`) — never directly inside a folder that describes a feature/domain instead of a role. This holds **even when that subfolder would contain only one file** — `core/pwa/useAppUpdatePrompt.ts` moved to `core/pwa/composables/useAppUpdatePrompt.ts` despite being the only file in `core/pwa/`.

Two things that look like exceptions but aren't real violations:
1. A folder whose own name already **is** the role (`core/api/client.ts`, `core/store/useAuthStore.ts`, `core/router/index.ts`) — the file is already inside the correctly-named parent, it doesn't need a redundant `store/store/useAuthStore.ts`.
2. A `.vue` component living directly inside its feature folder (`core/layouts/AppHeader.vue`, `modules/<contexto>/components/PricingRuleForm.vue`) — components are governed by a separate, already-established rule (§3.3: solto é aceitável enquanto o módulo for pequeno), this rule is only about composable/service/store/schema/type files.

Fix pattern when a violation is found: `git mv` (preserve history) into the correctly-named subfolder, then fix every import across `src/` and `tests/` referencing the old relative/`@/` path — `grep -rln` the bare filename first to find every consumer before moving, moving without that sweep leaves stale imports that only `vue-tsc`/tests catch after the fact.
