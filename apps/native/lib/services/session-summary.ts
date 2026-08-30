import type { Database } from "../db/database";
import { setVolume } from "../math/set";
import { warmupFilteredVolume } from "../training/warmup";
import type { Set, Workout } from "../db/schema";

export interface ExerciseBreakdown {
  exerciseId: string;
  sets: number;
  workingSets: number;
  volume: number;
  workingVolume: number;
  topWeight: number;
}

export interface SessionSummary {
  workoutId: string;
  startedAt: number;
  durationMs: number | null;
  totalSets: number;
  workingSets: number;
  warmupSets: number;
  totalVolume: number;
  workingVolume: number;
  warmupVolume: number;
  perExercise: ExerciseBreakdown[];
}

export class SessionSummaryService {
  constructor(private readonly db: Database) {}

  async summarize(workoutId: string): Promise<SessionSummary | null> {
    const workout = await this.db.findById<Workout>("workout", workoutId);
    if (!workout) return null;

    const ordered = await this.db.findBy<Set>("set", (s) => s.workoutId === workoutId);
    ordered.sort((a, b) => a.orderIndex - b.orderIndex);

    const volume = warmupFilteredVolume(ordered);

    const byExercise = new Map<string, Set[]>();
    for (const set of ordered) {
      const list = byExercise.get(set.exerciseId) ?? [];
      list.push(set);
      byExercise.set(set.exerciseId, list);
    }

    const perExercise: ExerciseBreakdown[] = [];
    for (const [exerciseId, exerciseSets] of byExercise) {
      const working = exerciseSets.filter((s) => !s.isWarmup);
      const workingVolume = working.reduce((sum, s) => sum + setVolume(s), 0);
      const topWeight = working.reduce((max, s) => Math.max(max, s.weight), 0);
      perExercise.push({
        exerciseId,
        sets: exerciseSets.length,
        workingSets: working.length,
        volume: exerciseSets.reduce((sum, s) => sum + setVolume(s), 0),
        workingVolume,
        topWeight,
      });
    }

    const durationMs =
      workout.completedAt != null ? workout.completedAt - workout.startedAt : null;

    return {
      workoutId,
      startedAt: workout.startedAt,
      durationMs,
      totalSets: ordered.length,
      workingSets: ordered.filter((s) => !s.isWarmup).length,
      warmupSets: ordered.filter((s) => s.isWarmup).length,
      totalVolume: volume.totalVolume,
      workingVolume: volume.workingVolume,
      warmupVolume: volume.warmupVolume,
      perExercise,
    };
  }
}
