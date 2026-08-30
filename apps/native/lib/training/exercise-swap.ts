export interface WorkoutSetRef {
  id: string;
  exerciseId: string;
}

export interface SwapRequest {
  workoutSets: WorkoutSetRef[];
  oldExerciseId: string;
  newExerciseId: string;
  newExerciseExists?: boolean;
}

export type SwapIntegrity =
  | { ok: true; affectedSets: string[] }
  | { ok: false; reason: "unknown-new-exercise" | "no-matching-sets"; affectedSets: string[] };

export function validateSwap(request: SwapRequest): SwapIntegrity {
  const affectedSets = request.workoutSets
    .filter((set) => set.exerciseId === request.oldExerciseId)
    .map((set) => set.id);

  const newExerciseExists = request.newExerciseExists ?? false;
  if (!newExerciseExists) {
    return { ok: false, reason: "unknown-new-exercise", affectedSets };
  }
  if (affectedSets.length === 0) {
    return { ok: false, reason: "no-matching-sets", affectedSets };
  }
  return { ok: true, affectedSets };
}

export interface SwapResult {
  oldExerciseId: string;
  newExerciseId: string;
  swappedSets: WorkoutSetRef[];
  affectedSetIds: string[];
}

export function applySwap(workoutSets: WorkoutSetRef[], swap: SwapRequest): SwapResult {
  const integrity = validateSwap(swap);
  const swappedSets = workoutSets
    .filter((set) => set.exerciseId === swap.oldExerciseId)
    .map((set) => ({ ...set, exerciseId: swap.newExerciseId }));
  return {
    oldExerciseId: swap.oldExerciseId,
    newExerciseId: swap.newExerciseId,
    swappedSets,
    affectedSetIds: integrity.affectedSets,
  };
}
