# Iron Sets â€” Pre-Design Backend Plan (Non-UI Features)

> **Context:** UI designs are not ready yet. This plan lists the **non-UI features** that can be fully implemented before designs land â€” core data model, persistence, pure-math helpers, aggregation services, and export logic. Everything here is testable/verifiable via `check-types` and unit checks with no reliance on the visual design.
>
> Each item is one todo â†’ one commit, per the rule in `AGENTS.md`. Track progress with `[x]`.
>
> **Target:** `apps/native` (the product). UI/design-dependent work (steppers, superset layout, heatmap grid, PR celebration UI, screens, cards) is intentionally **out of scope** for this file.

---

## Tier 1 â€” Trivial: standalone pure-math utilities (no deps)

Smallest, fully self-contained helpers. Zero external input; ideal first wins for warm-up.

- [x] 1.1 Plate calculator math â€” `target weight â†’ plate set` (from a configurable plate inventory).
- [x] 1.2 Reverse plate math â€” `plate stack â†’ total barbell weight`.
- [x] 1.3 Weight unit helpers â€” lb/kg conversions, rounding rules per plate/bar, `per-hand â†” total` conversion.
- [x] 1.4 Bodyweight + added belt/vest weight sum helper (dips/pull-ups).

---

## Tier 2 â€” Easy: small self-contained logic modules

Single-purpose, no cross-entity complexity. Pure computation on inputs.

- [x] 2.1 Set math â€” volume (sets Ã— reps Ã— weight), 1RM / e1RM estimator (e.g., Epley / Brzycki), intensity calc.
- [x] 2.2 Warmup filtering logic â€” detect warmup sets, exclude from volume/1RM while keeping fatigue data for recovery.
- [x] 2.3 Machine ratio â€” apply custom ratio tag to weight/volume (weighted-machine conversion).
- [x] 2.4 Rest timer engine (state machine: idle â†’ running â†’ completed, countdown logic, per-set-type defaults).
- [x] 2.5 Exercise swap safety â€” history-link integrity check (replace machine id without orphaning past logs).
- [x] 2.6 Lifetime volume milestone translations â€” cumulative kg/lb â†’ real-world equivalents (e.g., "X African Elephants") with unit table.

---

## Tier 3 â€” Medium: data model + persistence (domain foundations)

The local-first storage layer. Depends on Tier 1/2 pure helpers but is its own vertical.

- [x] 3.1 Core entity schemas (zod): Exercise, Routine, Workout, Set (with set-level metadata: warmup/drop/failure/RPE/RIR/note, equipment type, added weight, machine ratio, per-hand flag).
- [x] 3.2 Migration / applied-schema bootstrap (create tables on first launch).
- [x] 3.3 Exercise repository (CRUD + library seed data).
- [x] 3.4 Workout + Set repositories (CRUD, atomic set append for real-time persistence).
- [x] 3.5 Routine repository (CRUD + split frequency metadata).
- [x] 3.6 Persistence abstraction layer (DB interface) so the UI later talks to repositories, not the raw DB.

---

## Tier 4 â€” Harder: aggregation & stats services (read across data)

Compute meaningful outputs by reading multiple stored entities. Depends on Tier 2/3.

- [x] 4.1 Session summary service â€” total volume (excluding warmups), set counts, duration, per-exercise breakdown.
- [x] 4.2 Exercise history context service â€” previous weights/reps/date per exercise for "Beat Last Time" and inline history.
- [x] 4.3 "Beat Last Time" progressive-overload target engine â€” recommend next target from prior best set.
- [x] 4.4 Multi-tier micro-PR detection â€” 3-rep PR, 5-rep PR, volume PR, rep-at-weight record (emit event; UI/haptics later).
- [x] 4.5 Muscle recovery / readiness service â€” time-decay algorithm from elapsed hours + training volume (returns % per muscle group).
- [x] 4.6 Workout frequency / consistency stats â€” training days, streak length, "days since last trained" per routine.

---

## Tier 5 â€” Hardest: cross-cutting engines & export (coordinate everything)

These tie several services together and/or produce portable outputs. Highest complexity.

- [ ] 5.1 Heatmap data aggregator â€” 52-week per-day workout count/volume-intensity grid data (pure data; rendering is UI).
- [ ] 5.2 Monthly performance card data service â€” volume, frequency, top PRs (per month) â†’ summary object (the graphic is UI).
- [ ] 5.3 CSV export â€” serialization of workouts/sets/exercises/routines across repositories.
- [ ] 5.4 JSON export â€” lossless full-dataset serialization + import shape.
- [ ] 5.5 Export orchestration + share/save primitive â€” package exports into files/URIs (wiring UI later).
- [ ] 5.6 Scheduled-notification planning logic â€” derive reminder times/rest days from routine intervals (scheduling; the notification UI later).

---

## Explicitly deferred (UI/design-dependent â€” NOT in this plan)
- Stepper controls, inline set rows / logging screen layout.
- Superset side-by-side layout.
- GitHub-style heatmap grid rendering.
- PR celebration UI, haptics, badges.
- Dashboard / screens / routing.
- Rest timer UI + countdown display.
- Monthly performance card graphic.
- Notification display / permission prompts.
- Plate calculator UI (the math is 1.1â€“1.2; the interactive two-way UI waits on design).

