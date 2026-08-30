export interface SetLike {
  weight: number;
  reps: number;
  isWarmup?: boolean;
}

export interface WarmupPartition {
  working: SetLike[];
  warmup: SetLike[];
}

export function isWarmupSet(set: SetLike): boolean {
  return set.isWarmup === true;
}

export function partitionWarmups(sets: SetLike[]): WarmupPartition {
  const working: SetLike[] = [];
  const warmup: SetLike[] = [];
  for (const set of sets) {
    if (isWarmupSet(set)) {
      warmup.push(set);
    } else {
      working.push(set);
    }
  }
  return { working, warmup };
}

export function totalVolume(sets: SetLike[]): number {
  return sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
}

export interface WarmupFilteredVolume {
  totalVolume: number;
  workingVolume: number;
  warmupVolume: number;
}

export function warmupFilteredVolume(sets: SetLike[]): WarmupFilteredVolume {
  const { working, warmup } = partitionWarmups(sets);
  return {
    totalVolume: totalVolume(sets),
    workingVolume: totalVolume(working),
    warmupVolume: totalVolume(warmup),
  };
}
