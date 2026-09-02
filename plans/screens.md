# Iron Sets — Screen Spec (Layout / Feel / Design)

> **Audience:** Designer. This document maps every screen in the Iron Sets mobile app, its layout, feel, and design direction. It combines **as-built onboarding screens** (in the code) with **intended design directions for the main app** (many still pending final designs — marked `PENDING`).
>
> Workflow note: this file is the living reference. As screens are designed and built, update per-screen sections here so the docs and the product stay in sync.

---

## 1. What the app is

**Iron Sets** is a fast, distraction-free **strength-training logger** for iOS / Android.

- **Local-first & offline.** All workout data lives on-device; no account, no server, no ads, no paywalls. Users own their data and can export it (CSV/JSON) any time.
- **For the gym floor.** The whole UX is built around logging sets with as little friction as possible.
- **Main job:** record every set (exercise, weight, reps) in seconds, then use that history to drive progression — beat last time, spot PRs, track recovery, and stay consistent.
- **Core personality:** calm, confident, zero clutter. It should feel like a sharp tool, not a social feed.

**One line:** *Log every set. Watch the strength come.*

---

## 2. Global design language & feel

These are the shared rules that apply to every screen. Details are intentionally left at the level a designer can run with.

- **Mood:** confident, minimal, gym-floor-practical. No decoration for its own sake. Dark, high-contrast aesthetic (dark theme is the default personality).
- **Stacks / tooling in use:** Expo + `expo-router`; UI components from `heroui-native`; styling via `uniwind` (Tailwind-style utility classes); `react-native-reanimated` for motion; `@expo/vector-icons` (`Ionicons`) for icons.
- **Color:** driven by a small theme token set — `background`, `foreground`, `surface`(levels), `muted`, `accent`, `success`, `warning`, `danger`. One bold **accent** used sparingly for action and pride moments (PRs, completed states, primary CTAs). Everything else stays in neutrals. *(Note: the current token list has no `primary` — use `accent` for brand/action color.)*
- **Typography:** strong, semibold/bold display type for values and headlines; clean small type for metadata. Numbers (weights, reps, timers) are the heroes — they should read instantly.
- **Spacing & shape:** generous touch targets (gym-gloved fingers), rounded (but not pill-gimmicky) surfaces, consistent `Surface` layers for cards.
- **Motion:** light, fast. Subtle press feedback, smooth screen transitions, satisfying little confirms (checkmark pop) on completed actions. Haptics on key milestones.
- **Data urgency:** previous-log context, steppers, and number keypads live as close to the input as possible — never buried in a submenu (see PRD friction table).

---

## 3. Navigation map

```
Root Stack (guarded)
├── onboarding (shown until onboarding complete; secure-store flag)
│   ├── index          → Welcome
│   ├── profile        → Goals / Experience / Units
│   ├── first-workout  → Log your first lift (AHA moment)
│   └── done           → Confirmation → enter app
│
├── (drawer)  (shown once onboarding complete)
│   ├── index          → Home / Dashboard        ← PENDING redesign
│   └── (tabs)
│       ├── index      → Home tab                ← scaffold only
│       └── two        → secondary tab           ← scaffold only
│
├── modal               → generic modal (scaffold, dialogs/confirmations)
└── +not-found
```

**Guard:** `app/_layout.tsx` uses `Stack.Protected` — while onboarding is incomplete the app is locked to `/onboarding`; on completion it swaps to `(drawer)` and returning users skip onboarding entirely.

---

## 4. Onboarding screens (`as built`)

Onboarding's job is to get a new user to their first completed set as fast and confidently as possible, then hand them into the app. Follows the classic arc: **sell the outcome → personalize → reach the AHA moment (log a lift) → confirm**.

### 4.1 Welcome — `app/onboarding/index.tsx`
- **Purpose:** sell the outcome, not the features.
- **Layout (as built):** safe-area padded, single full-height column:
  1. Top-left wordmark: `barbell` icon + **IRON SETS** (tracked-wide).
  2. Big display headline: **"Log every set. Watch the strength come."**
  3. One short subhead line.
  4. Three benefit rows (icon in a rounded `Surface` tile + title + one-line body): *Beat your last set / Set-by-set guidance / Strength that compounds*.
  5. Bottom: full-width **Get started** primary button.
- **Feel:** open, calm, confident. Lots of negative space. One action, nothing else to tap.
- **Motion:** none required; keep simple.

### 4.2 Profile / personalize — `app/onboarding/profile.tsx`
- **Purpose:** make it feel tailored ("shape it around you").
- **Layout (as built):** scrollable column with a small step label (`Step 2 of 3`), then three stacked groups:
  - **Your goals** — multi-select rows: *Build raw strength / Gain muscle / Improve endurance* (icons, check indicator on right; at least one required).
  - **Your experience** — single-select rows: *New to lifting / Some experience / Experienced*.
  - **Weights** — a segmented kg/​lb toggle.
  - Bottom primary button (disabled until a goal is chosen).
- **Feel:** tappable rows are the mental model; selected state = accent fill + check. Familiar, low-thought.
- **Future design hook:** goal/level selection could become cards or chips; keep multi-select affordance obvious.

### 4.3 First workout / AHA — `app/onboarding/first-workout.tsx`
- **Purpose:** the core of onboarding — let the user experience the app's **main feature** (logging a set) stripped down to nothing else. This is the "this app is for me" moment.
- **Layout (as built):** scrollable column (`Your first set` step label):
  1. **Pick an exercise** — wrap of pill chips (curated subset of the library: Bench, Squat, Overhead Press, Row; names shown short).
  2. **Enter your set** — two inline fields: `Weight (kg/lb)` + `Reps` (OS numeric keypad).
  3. **Add set** primary button.
  4. Live **logged-sets list** in a `Surface` card: numbered circle per set + `weight × reps`, checkmark on each.
  5. **Finish workout** (secondary) — active once ≥1 set exists.
- **Feel:** the payoff is immediately visible — you add a set and *see it logged*. Encouraging, simple, focused on the one action. Supports the product's stepper-first principle (steppers are the up-level direction; here plain keypad entry is acceptable for the first taste).
- **Data note:** this logs a real workout through the domain layer, but the DB is currently in-memory, so the first workout is a demonstration of the act (persistence is a later tier).

### 4.4 Done / confirmation — `app/onboarding/done.tsx`
- **Purpose:** celebrate the completed first workout and hand over to the app.
- **Layout (as built):** centered full-height column: large circular check badge → **"You just logged your first workout."** → short message ("set by set, rep by rep…") → full-width **Enter the app** button.
- **Action:** marks onboarding complete (secure store) and routes into `(drawer)`.
- **Feel:** warm, finished, confident. A mini success/PR-style celebration that previews the app's reward language.
- **Future design hook:** make this a taste of the actual "workout complete" screen in the main app for consistency.

---

## 5. Main app screens

> The screens below are the **vision**. Most are `PENDING` — not yet designed or built (routes exist only as scaffold in `(drawer)`/`(tabs)`). Direction is drawn from the PRD and the plan backlog. Designer should flesh out each.

### 5.1 Home / Dashboard — `(drawer)/index.tsx`  `PENDING redesign` (currently broken scaffold)
- **Vision:** the at-a-glance training cockpit once you open the app.
  - Primary action button to **start a workout** (huge, obvious).
  - **Consistency heatmap**: 52-week GitHub-style grid of activity (Feature 9).
  - **"Beat Last Time"** summary: your last targets vs. today (Feature 10).
  - **Recovery / readiness** status with time-decay % (Feature 11).
  - **Lifetime volume milestone** translated into a relatable real-world object (Feature 11).
  - Optional **monthly performance card** entry point (Feature 13).
- **Feel:** dense-but-scan-able; numbers and green/accent "on-track" states do the talking. Dashboard is a report, not a feed.

### 5.2 Workout logging session — `NOT YET ROUTED`  `PENDING`
- **Purpose:** the heart of the product — log sets fast on the gym floor.
- **Vision (from PRD/plan, Features 2–7):**
  - Exercise list + inline set rows (weight, reps).
  - **Inline steppers** (-5/+5, -1/+1) for weight/rep — primary input method.
  - OS **number keypad** fallback for direct entry.
  - **Inline history context**: previous weight/reps/date directly beneath the active field.
  - Per-set metadata: warmup / drop / failure flags, RPE/RIR, micro-notes (Feature 3).
  - Per-hand vs total weight toggle (dumbbells), bodyweight+added weight (dips/pull-ups), machine ratio (Feature 3).
  - **Superset layout**: paired exercises side-by-side, compact (Feature 5).
  - **Rest timer** per set type with haptics/notification (Feature 6).
  - **Two-way plate calculator** UI (Feature 7).
- **Feel:** maximum speed, one-hand-friendly, thumb-reachable steppers, data race-proof (each set writes instantly to local storage).

### 5.3 Exercise library — `PENDING` (Feature 4)
- **Vision:** searchable built-in exercise list; add custom exercises; mid-session exercise swap without breaking history.

### 5.4 Routines — `PENDING` (Feature 12)
- **Vision:** routine CRUD with split frequency; **routine cards with "days since last trained" / overdue indicators** (visual elapsed time); smart local reminder hooks.

### 5.5 History / Progress — `PENDING`
- **Vision:** past workouts browse; per-exercise progression trend lines; PR history (multi-tier micro-PRs: 3-rep, 5-rep, volume, rep-at-weight); volume benchmarks (Features 10–11).

### 5.6 Export — `PENDING` (Feature 8)
- **Vision:** one-tap CSV/JSON export of all data, with native share/save flow. Ownership should feel open and default.

### 5.7 Modal + 404 — `as built` (scaffold)
- **Modal** (`app/modal.tsx`): generic card-in-card dialog/confirmation surface — pattern for confirmations, dialogs.
- **+not-found**: default missing-route fallback; keep on-brand when styled.

---

## 6. Current status summary

| Area | Status |
| --- | --- |
| Onboarding (welcome → profile → first lift → done) | ✅ Built, compiles, committed |
| Router guard (onboarding vs main app) | ✅ Built |
| Main-app `(drawer)` / `(tabs)` screens | 🧬 Scaffold only — need design + build |
| Workout logging session | 🔨 Backend logic done; UI pending |
| Dashboard / heatmap / recovery / exports / routines | 🔨 Backend logic done; UI pending |
| Local SQLite persistence | ⏳ In-memory now; SQLite is the next backend tier |

---

*Keep this file updated alongside `docs/plan.md` as features roll out.*
