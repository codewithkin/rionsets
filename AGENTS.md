# Iron Sets — Agent Workflow Rules

Project context:
- **apps/native** = the actual product (React Native / Expo mobile app, local-first strength logger).
- **apps/web** = marketing site + policy/TOS pages for app store submissions (NOT the product).
- Monorepo: pnpm workspaces (`apps/*`, `packages/*`) + Turborepo. Package manager **pnpm 11.4** (`package.json` is `type: module`).

## Mandatory workflow rule: feature → todos → one commit per todo

For EVERY feature (from the PRD in `docs/PRD.md` and the breakdown in `docs/plan.md`):

1. Split the feature into smaller todos/tasks. A single feature can be broken into **1–20 todos**.
2. Work through the todos one at a time.
3. After completing **each todo**, run the relevant verification (check-types / build) and **create exactly ONE commit for that todo**.

> One todo = one commit. Never bundle multiple todos into a single commit, and never leave a completed todo uncommitted.

### Commit message convention
Use a clear, scoped conventional message that identifies the feature and todo, e.g.:
`feat(logging): add stepper weight controls for set entry`

### Where todos are tracked
- `docs/plan.md` — the live feature → todo breakdown. Mark each todo as it is completed (`[x]`).
- Progress is still marked in the in-session todo list during work, and reflected back into `docs/plan.md` after each commit.

## Verification (no lint in this repo)

There is **no lint setup** — `turbo.json` declares a `lint` task but no package defines the `lint` script, so `lint` is not runnable. Run type checks instead:

- All packages: `pnpm check-types` (runs `tsc --noEmit` via turbo across all 5 packages).
- One package: `pnpm --filter native check-types` (or `web`, `@iron-sets/ui`).
- Native `dev`: `pnpm dev:native` (alias for `expo start --clear`).

## Architecture & structural notes

- **apps/native** — Expo Router app (`expo-router/entry`, `main` in `apps/native/package.json`). Screens live under `apps/native/app` (file-based routing, incl. `(drawer)` / `(tabs)` groups); styling uses `uniwind` (Tailwind-style) + `heroui-native`.
- **apps/web** — Next.js 16 on port **3001** (`next dev --port 3001`). Subject to Next 16 breaking changes — see `apps/web/AGENTS.md` before editing web code.
- **Shared UI** — `packages/ui` (`@iron-sets/ui`): shadcn-based React components/styles for web; import as `@iron-sets/ui/components/*`, styles as `@iron-sets/ui/globals.css`.
- **packages/env** (`@iron-sets/env`) — env schemas: `./server`, `./web`, `./native` exports.
- Dependency versions for shared libs are pinned in the pnpm **catalog** in `pnpm-workspace.yaml` (used as `dependsOn: "catalog:"`, e.g. `zod`, `dotenv`, `typescript`, `tailwindcss`).

## Known gotchas

- `pnpm check-types` currently FAILS in `apps/native` at baseline: `app/(drawer)/index.tsx` references undefined `isConnected` / `isLoading` (scaffold template leftover, lines ~23–49). Treat as pre-existing; a clean type-check gate requires fixing this before enabling a green check.
- Only commit when the task calls for it, and always as part of the one-commit-per-todo rule above; never commit unrelated scaffolding churn.
