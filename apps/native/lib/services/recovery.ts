import type { Database } from "../db/database";
import type { Exercise, Set, Workout } from "../db/schema";

export interface RecoveryInput {
  elapsedHours: number;
  loadVolume: number;
  peakVolumeHours: number;
}

const BASE_RECOVERY_HOURS = 48;
const HALF_LIFE_HOURS = 24;
const VOLUME_PENALTY_PER_1000_KG = 4;

export function computeRecovery({
  elapsedHours,
  loadVolume,
  peakVolumeHours,
}: RecoveryInput): number {
  const timeFactor = Math.pow(0.5, elapsedHours / HALF_LIFE_HOURS);
  const volumeFactor = VOLUME_PENALTY_PER_1000_KG * (loadVolume / 1000);

  let raw = 50 * (2 - timeFactor) - volumeFactor * (1 - timeFactor);
  raw = Math.max(0, raw);
  if (elapsedHours < peakVolumeHours) {
    raw *= Math.max(0, elapsedHours / peakVolumeHours);
  }
  return Math.min(100, Math.round(raw));
}

export interface MuscleRecovery {
  muscleGroup: string;
  recoveryPercent: number;
  elapsedHours: number;
}

export class MuscleRecoveryService {
  constructor(private readonly db: Database) {}

  async forMuscleGroups(now = Date.now()): Promise<MuscleRecovery[]> {
    const exercises = await this.db.findAll<Exercise>("exercise");
    const workouts = await this.db.findAll<Workout>("workout");
    const sets = await this.db.findAll<Set>("set");

    const workoutsById = new Map(workouts.map((w) => [w.id, w]));
    const muscleGroups = new Set<string>();
    for (const ex of exercises) {
      if (ex.muscleGroup) muscleGroups.add(ex.muscleGroup);
    }

    const results: MuscleRecovery[] = [];
    for (const muscleGroup of muscleGroups) {
      const groupExerciseIds = new Set(
        exercises.filter((e) => e.muscleGroup === muscleGroup).map((e) => e.id),
      );
      const groupSets = sets.filter((s) => groupExerciseIds.has(s.exerciseId) && !s.isWarmup);

      if (groupSets.length === 0) {
        results.push({ muscleGroup, recoveryPercent: 100, elapsedHours: 0 });
        continue;
      }

      const lastSet = groupSets.reduce((a, b) => {
        const aT = workoutsById.get(a.workoutId)?.startedAt ?? 0;
        const bT = workoutsById.get(b.workoutId)?.startedAt ?? 0;
        return bT > aT ? b : a;
      });
      const lastWorkoutStart = workoutsById.get(lastSet.workoutId)?.startedAt ?? now;
      const elapsedHours = Math.max(0, (now - lastWorkoutStart) / 3_600_000);

      const loadVolume = groupSets.reduce((sum, s) => sum + s.weight * s.reps, 0);

      results.push({
        muscleGroup,
        elapsedHours,
        recoveryPercent: computeRecovery({
          elapsedHours,
          loadVolume,
          peakVolumeHours: 12,
        }),
      });
    }

    results.sort((a, b) => a.recoveryPercent - b.recoveryPercent);
    return results;
  }
}
