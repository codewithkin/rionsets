# Iron Sets — Product Requirements & Specification

## Product
- **Name:** Iron Sets
- **Platform Target:** Cross-Platform Mobile (iOS / Android)
- **Architecture:** Local-First, Offline-Capable, Zero-Bloat Utility

## 1. Executive Summary & Vision

Iron Sets is a fast, distraction-free strength tracking mobile application engineered to eliminate the friction lifters face on the gym floor. While mainstream strength applications suffer from forced social feeds, restrictive template paywalls, intrusive subscription popups, slow system keypad inputs, and cluttered interfaces, Iron Sets prioritizes raw speed, high-efficiency data entry, deep progression tracking, and complete data ownership.

Iron Sets operates on a local-first philosophy: users fully own their workout data, can export it at any time, and log workouts seamlessly without requiring internet connectivity or wearable devices.

## 2. Core UX Principles & Friction Solutions

| Gym-Floor Friction Point | Iron Sets Solution |
| --- | --- |
| Tedious Keypad Entry | Full OS number keypads pop up for every set. |
| Fast Stepper Controls | Inline -5/+5 and -1/+1 stepper buttons allow single-tap weight/rep adjustments without opening system keyboards. |
| Hidden Historical Stats | Previous session logs buried behind multi-tap submenus. |
| Inline History Context | Previous weights, reps, and dates appear directly beneath active input fields for immediate reference. |
| Background Memory Crashes | OS backgrounding wipes un-saved sets mid-workout. |
| Real-Time Local Persistence | Every set tap automatically writes instantly to local storage to prevent data loss. |
| Rigid Global Rest Timers | Same rest time forced across all warmup and heavy sets. |
| Set-Granular Rest Timers | Customizable timer durations per set type (e.g., 60s for warmups, 180s for heavy working sets). |
| Warm-Up Data Pollution | Warmup volume distorts total session stats and 1RM progress. |
| Warmup Volume Filtering | Warmup sets are distinctly flagged and excluded from 1RM trend calculations while retaining overall fatigue data. |
| One-Way Plate Calculators | Users must enter target weight to calculate plates. |
| Two-Way Plate Calculation | Enter target weight to calculate required plates OR tap virtual plates on a bar to sum total barbell weight. |
| Data Hostage Behind Paywalls | Export options locked behind monthly subscriptions. |
| Open Export Standard | Full, unrestricted CSV and JSON data export capabilities out of the box. |

## 3. Feature Architecture & MVP Scope

### 3.1 High-Efficiency Workout Logging
- **Set-Level Metadata:** RPE, RIR, drop sets, failure tags, set-level micro-notes.
- **Flexible Equipment & Math:** Per-hand vs. total weight toggles for dumbbells, bodyweight plus added belt weight for dips/pull-ups, custom machine ratio tags.
- **Mid-Session Exercise Swaps:** Seamless replacement of occupied machines without breaking exercise history links.
- **Superset Layout:** Compact view showing paired exercises side-by-side.

### 3.2 Progression & Retention Engine
- **GitHub-Style Consistency Heatmap:** 52-week activity grid on the dashboard.
- **Dynamic "Beat Last Time" Targets:** Auto-populates active sets with progressive overload targets.
- **Multi-Tier Micro-PR Celebrations:** 3-rep PRs, 5-rep PRs, volume PRs, rep-at-weight records (haptics + badges).
- **Muscle Recovery & Readiness Status:** Time-decay recovery percentage.
- **Lifetime Volume Benchmarks:** Translate cumulative weight moved into relatable real-world milestones.
- **"Days Since Last Trained" Routine Counters:** Visual elapsed-time indicators on routine cards.
- **Smart Local Notifications:** Contextual, non-invasive workout reminders.
- **Auto-Generated Monthly Performance Cards:** Visual summary graphics (volume, frequency, top PRs) for export/sharing.

## 4. Out-of-Scope for Initial MVP
- Smartwatch / Wearable automatic tracking and companion apps.
- Automated motion detection or camera-based rep counting.
- Global social feeds, public profile timelines, or community messaging.

## 5. Target Audience & Community Launch Strategy

Targeted at intermediate to advanced lifters, strength enthusiasts, and tech-conscious fitness practitioners who reject bloated subscription apps.

Primary subreddit channels: r/Fitness, r/bodyweightfitness, r/androidapps, r/iosapps, r/ReactNative, r/FlutterDev.
