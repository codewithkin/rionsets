import type { Database } from "../db/database";
import type { Routine, Workout } from "../db/schema";

export interface RoutineRecency {
  routineId: string;
  routineName: string;
  lastTrainedAt: number | null;
  daysSinceLast: number | null;
  overdue: boolean;
  split: Routine["split"];
  daysPerWeek: number;
}

export interface FrequencyStats {
  trainingDays: number[];
  totalTrainingDays: number;
  currentStreak: number;
  longestStreak: number;
  daysSinceLastWorkout: number | null;
  routes: RoutineRecency[];
}

const DAY_MS = 86_400_000;

function startOfDay(ts: number): number {
  return Math.floor(ts / DAY_MS) * DAY_MS;
}

export class FrequencyService {
  constructor(private readonly db: Database) {}

  async compute(now = Date.now()): Promise<FrequencyStats> {
    const workouts = await this.db.findAll<Workout>("workout");
    const routines = await this.db.findAll<Routine>("routine");

    const trainingDays = [...new Set(workouts.map((w) => startOfDay(w.startedAt)))].sort(
      (a, b) => a - b,
    );

    const currentStreak = computeCurrentStreak(trainingDays, now);
    const longestStreak = computeLongestStreak(trainingDays);

    const lastDay = trainingDays[trainingDays.length - 1] ?? null;
    const daysSinceLastWorkout = lastDay == null ? null : Math.floor((now - lastDay) / DAY_MS);

    const routes: RoutineRecency[] = routines
      .map((routine) => {
        const routineWorkouts = workouts
          .filter((w) => w.routineId === routine.id)
          .map((w) => w.startedAt)
          .sort((a, b) => a - b);
        const lastTrainedAt = routineWorkouts[routineWorkouts.length - 1] ?? null;
        const daysSinceLast = lastTrainedAt == null ? null : Math.floor((now - lastTrainedAt) / DAY_MS);
        return {
          routineId: routine.id,
          routineName: routine.name,
          lastTrainedAt,
          daysSinceLast,
          overdue:
            daysSinceLast != null && daysSinceLast >= Math.ceil(7 / routine.daysPerWeek),
          split: routine.split,
          daysPerWeek: routine.daysPerWeek,
        };
      })
      .sort((a, b) => (a.daysSinceLast ?? Infinity) - (b.daysSinceLast ?? Infinity));

    return {
      trainingDays,
      totalTrainingDays: trainingDays.length,
      currentStreak,
      longestStreak,
      daysSinceLastWorkout,
      routes,
    };
  }
}

export function computeCurrentStreak(trainingDays: number[], now: number): number {
  if (trainingDays.length === 0) return 0;
  const today = startOfDay(now);
  const yesterday = today - DAY_MS;
  let cursor = trainingDays[trainingDays.length - 1];
  if (cursor !== today && cursor !== yesterday) return 0;
  let streak = 0;
  const set = new Set(trainingDays);
  while (set.has(cursor)) {
    streak++;
    cursor -= DAY_MS;
  }
  return streak;
}

export function computeLongestStreak(trainingDays: number[]): number {
  if (trainingDays.length === 0) return 0;
  const set = new Set(trainingDays);
  let longest = 0;
  for (const day of trainingDays) {
    if (set.has(day - DAY_MS)) continue;
    let length = 1;
    let cursor = day + DAY_MS;
    while (set.has(cursor)) {
      length++;
      cursor += DAY_MS;
    }
    longest = Math.max(longest, length);
  }
  return longest;
}
