import type { Set } from "../db/schema";
import { setVolume } from "../math/set";
import type { HistoryEntry } from "./history-context";

export type PrTag =
  | "weight"
  | "volume"
  | "rep-at-weight";

export interface PrDetection {
  exerciseId: string;
  isPr: boolean;
  tags: PrTag[];
  previousTopWeight: number | null;
}

export interface PrDetectionContext {
  completedSetsForWorkout: Set[];
  historyBestByWeight: HistoryEntry | null;
  historyBestVolume: number;
}

export function detectPrs(
  exerciseId: string,
  context: PrDetectionContext,
): PrDetection {
  const sets = context.completedSetsForWorkout.filter((s) => !s.isWarmup);
  const tags: PrTag[] = [];

  const currentTopWeight = sets.reduce((max, s) => Math.max(max, s.weight), 0);
  const currentVolume = sets.reduce((sum, s) => sum + setVolume(s), 0);

  const previousTopWeight = context.historyBestByWeight?.topWeight ?? null;
  if (currentTopWeight > 0 && (previousTopWeight == null || currentTopWeight > previousTopWeight)) {
    tags.push("weight");
  }

  if (currentVolume > 0 && currentVolume > context.historyBestVolume) {
    tags.push("volume");
  }

  for (const set of sets) {
    if (set.reps <= 0 || set.weight <= 0) continue;
    if (previousTopWeight == null) {
      tags.push("rep-at-weight");
      break;
    }
    if (set.weight === previousTopWeight && set.reps > (context.historyBestByWeight?.bestRepsAtTopWeight ?? 0)) {
      tags.push("rep-at-weight");
      break;
    }
    if (set.weight > previousTopWeight) {
      tags.push("rep-at-weight");
      break;
    }
  }

  const unique = [...new Set(tags)];
  return {
    exerciseId,
    isPr: unique.length > 0,
    tags: unique,
    previousTopWeight,
  };
}
