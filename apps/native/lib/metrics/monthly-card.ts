import type { Database } from "../db/database";
import type { Set, Workout } from "../db/schema";

export interface MonthlyTopPr {
  exerciseId: string;
  weight: number;
  reps: number;
  estimated1RM: number;
}

export interface MonthlyPerformance {
  monthKey: string;
  year: number;
  month: number;
  workoutCount: number;
  trainingDays: number;
  totalSets: number;
  workingSets: number;
  volume: number;
  workingVolume: number;
  topPrs: MonthlyTopPr[];
}

export class MonthlyCardService {
  constructor(private readonly db: Database) {}

  async forMonth(year: number, month: number): Promise<MonthlyPerformance> {
    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month + 1, 1).getTime();

    const workouts = await this.db.findAll<Workout>("workout");
    const sets = await this.db.findAll<Set>("set");

    const monthWorkouts = workouts.filter(
      (w) => w.startedAt >= monthStart && w.startedAt < monthEnd,
    );
    const monthWorkoutIds = new Set(monthWorkouts.map((w) => w.id));
    const monthSets = sets.filter((s) => monthWorkoutIds.has(s.workoutId));

    const trainingDays = new Set(monthWorkouts.map((w) => Math.floor(w.startedAt / 86_400_000))).size;
    const working = monthSets.filter((s) => !s.isWarmup);
    const volume = monthSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
    const workingVolume = working.reduce((sum, s) => sum + s.weight * s.reps, 0);

    const byExercise = new Map<string, Set[]>();
    for (const set of working) {
      const list = byExercise.get(set.exerciseId) ?? [];
      list.push(set);
      byExercise.set(set.exerciseId, list);
    }

    const topPrs: MonthlyTopPr[] = [];
    for (const [exerciseId, exerciseSets] of byExercise) {
      const topWeight = Math.max(...exerciseSets.map((s) => s.weight));
      const bestReps = exerciseSets
        .filter((s) => s.weight === topWeight)
        .reduce((max, s) => Math.max(max, s.reps), 0);
      topPrs.push({
        exerciseId,
        weight: topWeight,
        reps: bestReps,
        estimated1RM: topWeight * (1 + bestReps / 30),
      });
    }
    topPrs.sort((a, b) => b.estimated1RM - a.estimated1RM);

    return {
      monthKey: `${year}-${String(month + 1).padStart(2, "0")}`,
      year,
      month,
      workoutCount: monthWorkouts.length,
      trainingDays,
      totalSets: monthSets.length,
      workingSets: working.length,
      volume,
      workingVolume,
      topPrs,
    };
  }
}
