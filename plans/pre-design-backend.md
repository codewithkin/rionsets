# Iron Sets — Pre-Design Backend Plan (Non-UI Features)

> **Context:** UI designs are not ready yet. This plan lists the **non-UI features** that can be fully implemented before designs land — core data model, persistence, pure-math helpers, aggregation services, and export logic. Everything here is testable/verifiable via `check-types` and unit checks with no reliance on the visual design.
>
> Each item is one todo → one commit, per the rule in `AGENTS.md`. Track progress with `[x]`.
>
> **Target:** `apps/native` (the product). UI/design-dependent work (steppers, superset layout, heatmap grid, PR celebration UI, screens, cards) is intentionally **out of scope** for this file.

---

## Tier 1 — Trivial: standalone pure-math utilities (no deps)

Smallest, fully self-contained helpers. Zero external input; ideal first wins for warm-up.

- [x] 1.1 Plate calculator math — `target weight → plate set` (from a configurable plate inventory).
- [x] 1.2 Reverse plate math — `plate stack → total barbell weight`.
- [x] 1.3 Weight unit helpers — lb/kg conversions, rounding rules per plate/bar, `per-hand ↔ total` conversion.
- [x] 1.4 Bodyweight + added belt/vest weight sum helper (dips/pull-ups).

---

## Tier 2 — Easy: small self-contained logic modules

Single-purpose, no cross-entity complexity. Pure computation on inputs.

- [x] 2.1 Set math — volume (sets × reps × weight), 1RM / e1RM estimator (e.g., Epley / Brzycki), intensity calc.
- [x] 2.2 Warmup filtering logic — detect warmup sets, exclude from volume/1RM while keeping fatigue data for recovery.
- [x] 2.3 Machine ratio — apply custom ratio tag to weight/volume (weighted-machine conversion).
- [x] 2.4 Rest timer engine (state machine: idle → running → completed, countdown logic, per-set-type defaults).
- [x] 2.5 Exercise swap safety — history-link integrity check (replace machine id without orphaning past logs).
- [x] 2.6 Lifetime volume milestone translations — cumulative kg/lb → real-world equivalents (e.g., "X African Elephants") with unit table.

---

## Tier 3 — Medium: data model + persistence (domain foundations)

The local-first storage layer. Depends on Tier 1/2 pure helpers but is its own vertical.

- [ ] 3.1 Core entity schemas (zod): Exercise, Routine, Workout, Set (with set-level metadata: warmup/drop/failure/RPE/RIR/note, equipment type, added weight, machine ratio, per-hand flag).
- [ ] 3.2 Migration / applied-schema bootstrap (create tables on first launch).
- [ ] 3.3 Exercise repository (CRUD + library seed data).
- [ ] 3.4 Workout + Set repositories (CRUD, atomic set append for real-time persistence).
- [ ] 3.5 Routine repository (CRUD + split frequency metadata).
- [ ] 3.6 Persistence abstraction layer (DB interface) so the UI later talks to repositories, not the raw DB.

---

## Tier 4 — Harder: aggregation & stats services (read across data)

Compute meaningful outputs by reading multiple stored entities. Depends on Tier 2/3.

- [ ] 4.1 Session summary service — total volume (excluding warmups), set counts, duration, per-exercise breakdown.
- [ ] 4.2 Exercise history context service — previous weights/reps/date per exercise for "Beat Last Time" and inline history.
- [ ] 4.3 "Beat Last Time" progressive-overload target engine — recommend next target from prior best set.
- [ ] 4.4 Multi-tier micro-PR detection — 3-rep PR, 5-rep PR, volume PR, rep-at-weight record (emit event; UI/haptics later).
- [ ] 4.5 Muscle recovery / readiness service — time-decay algorithm from elapsed hours + training volume (returns % per muscle group).
- [ ] 4.6 Workout frequency / consistency stats — training days, streak length, "days since last trained" per routine.

---

## Tier 5 — Hardest: cross-cutting engines & export (coordinate everything)

These tie several services together and/or produce portable outputs. Highest complexity.

- [ ] 5.1 Heatmap data aggregator — 52-week per-day workout count/volume-intensity grid data (pure data; rendering is UI).
- [ ] 5.2 Monthly performance card data service — volume, frequency, top PRs (per month) → summary object (the graphic is UI).
- [ ] 5.3 CSV export — serialization of workouts/sets/exercises/routines across repositories.
- [ ] 5.4 JSON export — lossless full-dataset serialization + import shape.
- [ ] 5.5 Export orchestration + share/save primitive — package exports into files/URIs (wiring UI later).
- [ ] 5.6 Scheduled-notification planning logic — derive reminder times/rest days from routine intervals (scheduling; the notification UI later).

---

## Explicitly deferred (UI/design-dependent — NOT in this plan)
- Stepper controls, inline set rows / logging screen layout.
- Superset side-by-side layout.
- GitHub-style heatmap grid rendering.
- PR celebration UI, haptics, badges.
- Dashboard / screens / routing.
- Rest timer UI + countdown display.
- Monthly performance card graphic.
- Notification display / permission prompts.
- Plate calculator UI (the math is 1.1–1.2; the interactive two-way UI waits on design).
