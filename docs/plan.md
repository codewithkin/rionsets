# Iron Sets — Feature → Todo Plan

> **Workflow rule:** For every feature, split it into smaller todos (1–20 per feature). Complete each todo, verify (lint / check-types / build), and create **exactly ONE commit per todo**. Mark each todo `[x]` here as it completes and reflect progress after each commit. All progress is tracked here and in the in-session todo list.

**Target:** `apps/native` (the product). **Not target:** `apps/web` (marketing/policy only).

---

## Feature 0 — Project foundations

- [ ] 0.1 Document the feature → todos → one-commit-per-todo rule in `AGENTS.md` and this plan.
- [ ] 0.2 Verify native app scaffolding (expo-router) runs and `pnpm check-types` passes.

---

## Feature 1 — Local-first data layer (SQLite)

- [ ] 1.1 Install & configure a local SQLite/ORM dependency for the native app.
- [ ] 1.2 Define core entity schemas: Exercise, Routine, Workout, Set (with set-level metadata).
- [ ] 1.3 Define migration/applied-schema bootstrap (create tables on first launch).
- [ ] 1.4 Implement the database access layer / repository functions (CRUD).

---

## Feature 2 — Workout logging core (logging session UI)

- [ ] 2.1 Logging screen layout: exercise list + inline set rows (weight, reps).
- [ ] 2.2 Inline stepper controls (-5/+5 and -1/+1) for weight & reps.
- [ ] 2.3 OS number keypad fallback for direct input.
- [ ] 2.4 Real-time local persistence on every set tap (background-safe).
- [ ] 2.5 Add-set / remove-set interactions per exercise.
- [ ] 2.6 Inline history context (previous weight/reps/date beneath each active field).

---

## Feature 3 — Set-level metadata & flexible math

- [ ] 3.1 Set flags: warmup, drop set, failure tag.
- [ ] 3.2 RPE / RIR inputs per set.
- [ ] 3.3 Micro-notes per set.
- [ ] 3.4 Equipment & math: per-hand vs total weight toggle (dumbbells).
- [ ] 3.5 Bodyweight + added belt weight (dips/pull-ups).
- [ ] 3.6 Custom machine ratio tags.

---

## Feature 4 — Exercise management

- [ ] 4.1 Exercise library (built-in exercises, search, add).
- [ ] 4.2 Custom exercise creation.
- [ ] 4.3 Mid-session exercise swap without breaking history links.

---

## Feature 5 — Superset layout

- [ ] 5.1 Paired exercise support in logging view.
- [ ] 5.2 Side-by-side compact superset rendering.

---

## Feature 6 — Rest timers

- [ ] 6.1 Per-set-type rest timer engine (warmup/heavy/drop).
- [ ] 6.2 Timer UI + notification/haptic on completion.
- [ ] 6.3 Configurable per-set durations.

---

## Feature 7 — Plate calculator (two-way)

- [ ] 7.1 Target weight → plate configuration computation.
- [ ] 7.2 Virtual plate tap → total barbell weight (reverse direction).
- [ ] 7.3 Plates UI component.

---

## Feature 8 — Data export

- [ ] 8.1 CSV export of workout data.
- [ ] 8.2 JSON export of workout data.
- [ ] 8.3 Share/save export flow.

---

## Feature 9 — Dashboard & consistency heatmap

- [ ] 9.1 Dashboard screen with workout stats.
- [ ] 9.2 52-week GitHub-style consistency heatmap.
- [ ] 9.3 Volume/intensity rendering for the grid.

---

## Feature 10 — Progression engine

- [ ] 10.1 "Beat Last Time" progressive-overload target engine.
- [ ] 10.2 Auto-populate targets into active sets.
- [ ] 10.3 Multi-tier micro-PR detection (3-rep, 5-rep, volume, rep-at-weight).
- [ ] 10.4 PR celebration UI (haptics + badges).

---

## Feature 11 — Metrics: recovery & lifetime volume

- [ ] 11.1 Muscle recovery / readiness time-decay calculation.
- [ ] 11.2 Recovery status UI on dashboard.
- [ ] 11.3 Lifetime volume accumulation.
- [ ] 11.4 Real-world milestone translations (e.g., "equivalent to X elephants").
- [ ] 11.5 "Days since last trained" routine counters.

---

## Feature 12 — Routines & notifications

- [ ] 12.1 Routine CRUD plus split frequency.
- [ ] 12.2 Routine cards with elapsed-time "overdue" indicators.
- [ ] 12.3 Smart local workout reminders (expo notifications) around routine intervals/rest days.

---

## Feature 13 — Monthly performance cards

- [ ] 13.1 Monthly summary aggregation (volume, frequency, top PRs).
- [ ] 13.2 Performance card graphic/rendering.
- [ ] 13.3 Export/share the monthly card.

---

## Feature 14 — Warmup volume filtering

- [ ] 14.1 Exclude warmup sets from 1RM trend & total volume calculations.
- [ ] 14.2 Retain warmup fatigue data for recovery math.
- [ ] 14.3 Surface filtered-vs-total stats where relevant.
