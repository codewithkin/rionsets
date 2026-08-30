# Iron Sets — Agent Workflow Rules

Project context:
- **apps/native** = the actual product (React Native / Expo mobile app, local-first strength logger).
- **apps/web** = marketing site + policy/TOS pages for app store submissions (NOT the product).

## Mandatory workflow rule: feature → todos → one commit per todo

For EVERY feature (from the PRD in `docs/PRD.md` and the breakdown in `docs/plan.md`):

1. Split the feature into smaller todos/tasks. A single feature can be broken into **1–20 todos**.
2. Work through the todos one at a time.
3. After completing **each todo**, run the relevant verification (lint / check-types / build) and **create exactly ONE commit for that todo**.

> One todo = one commit. Never bundle multiple todos into a single commit, and never leave a completed todo uncommitted.

### Commit message convention
Use a clear, scoped conventional message that identifies the feature and todo, e.g.:
`feat(logging): add stepper weight controls for set entry`

### Where todos are tracked
- `docs/plan.md` — the live feature → todo breakdown. Mark each todo as it is completed (`[x]`).
- Progress is still marked in the in-session todo list during work, and reflected back into `docs/plan.md` after each commit.
