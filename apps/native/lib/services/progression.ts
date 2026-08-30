import type { HistoryEntry } from "./history-context";
import { roundWeight, type WeightUnit } from "../math/units";

export interface BeatLastTimeInput {
  lastWeight: number;
  lastReps: number;
  unit: WeightUnit;
  minReps?: number;
}

export type ProgressionKind = "add-rep" | "add-weight" | "none";

export interface BeatLastTimeTarget {
  kind: ProgressionKind;
  targetWeight: number;
  targetReps: number;
  note: string;
  beats: boolean;
}

export function nextBeatLastTimeTarget(input: BeatLastTimeInput): BeatLastTimeTarget {
  const { lastWeight, lastReps, unit } = input;
  const minReps = input.minReps ?? 3;

  if (lastWeight <= 0 || lastReps <= 0) {
    return {
      kind: "none",
      targetWeight: 0,
      targetReps: 0,
      note: "No prior set to beat.",
      beats: false,
    };
  }

  if (lastReps < 6) {
    const nextWeight = roundWeight(lastWeight + (unit === "kg" ? 2.5 : 5), unit);
    return {
      kind: "add-weight",
      targetWeight: nextWeight,
      targetReps: lastReps,
      note: `Beat last time: ${lastWeight} ${unit} \u00d7 ${lastReps} \u2192 ${nextWeight} ${unit} \u00d7 ${lastReps}`,
      beats: true,
    };
  }

  return {
    kind: "add-rep",
    targetWeight: lastWeight,
    targetReps: lastReps + 1,
    note: `Beat last time: ${lastWeight} ${unit} \u00d7 ${lastReps} \u2192 ${lastWeight} ${unit} \u00d7 ${lastReps + 1}`,
    beats: lastReps + 1 >= minReps,
  };
}

export function targetFromHistoryEntry(entry: HistoryEntry, unit: WeightUnit): BeatLastTimeTarget {
  return nextBeatLastTimeTarget({
    lastWeight: entry.topWeight,
    lastReps: entry.bestRepsAtTopWeight,
    unit,
  });
}
