import type { Database } from "../db/database";
import type { Set, Workout } from "../db/schema";

export interface HistoryEntry {
  workoutId: string;
  workoutName: string;
  date: number;
  topWeight: number;
  bestRepsAtTopWeight: number;
  estimated1RM: number;
  setCount: number;
}

export interface HistoryContext {
  exerciseId: string;
  lastEntry: HistoryEntry | null;
  bestByWeight: HistoryEntry | null;
  bestBy1RM: HistoryEntry | null;
  entries: HistoryEntry[];
}

export class ExerciseHistoryService {
  constructor(private readonly db: Database) {}

  async forExercise(exerciseId: string): Promise<HistoryContext> {
    const sets = await this.db.findBy<Set>("set", (s) => s.exerciseId === exerciseId);

    const byWorkout = new Map<string, Set[]>();
    for (const set of sets) {
      if (set.isWarmup) continue;
      const list = byWorkout.get(set.workoutId) ?? [];
      list.push(set);
      byWorkout.set(set.workoutId, list);
    }

    const workoutIds = [...byWorkout.keys()];
    const workouts = new Map<string, Workout>();
    for (const id of workoutIds) {
      const workout = await this.db.findById<Workout>("workout", id);
      if (workout) workouts.set(id, workout);
    }

    const entries: HistoryEntry[] = [];
    for (const [workoutId, workoutSets] of byWorkout) {
      const topWeight = Math.max(...workoutSets.map((s) => s.weight));
      const bestWeightSets = workoutSets.filter((s) => s.weight === topWeight);
      const bestRepsAtTopWeight = Math.max(...bestWeightSets.map((s) => s.reps));
      const estimated1RM = Math.max(
        ...workoutSets.map((s) => s.weight * (1 + s.reps / 30)),
      );
      entries.push({
        workoutId,
        workoutName: workouts.get(workoutId)?.name ?? "",
        date: workouts.get(workoutId)?.startedAt ?? 0,
        topWeight,
        bestRepsAtTopWeight,
        estimated1RM,
        setCount: workoutSets.length,
      });
    }

    entries.sort((a, b) => a.date - b.date);
    const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;

    const bestByWeight = entries.length > 0 ? entries.reduce((a, b) => (b.topWeight > a.topWeight ? b : a)) : null;
    const bestBy1RM = entries.length > 0 ? entries.reduce((a, b) => (b.estimated1RM > a.estimated1RM ? b : a)) : null;

    return { exerciseId, lastEntry, bestByWeight, bestBy1RM, entries };
  }
}
