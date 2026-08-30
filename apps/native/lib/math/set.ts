export interface SetLift {
  weight: number;
  reps: number;
}

export interface VolumeInput {
  weight: number;
  reps: number;
}

export function setVolume({ weight, reps }: VolumeInput): number {
  return weight * reps;
}

export type Epley1RM = number;

export function epley1RM(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  return weight * (1 + reps / 30);
}

export function brzycki1RM(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  if (reps >= 36) return weight;
  return (weight * 36) / (37 - reps);
}

export type OneRMFormula = "epley" | "brzycki";

export function estimated1RM(
  weight: number,
  reps: number,
  formula: OneRMFormula = "epley",
): number {
  return formula === "epley" ? epley1RM(weight, reps) : brzycki1RM(weight, reps);
}

export function intensityFrom1RM(weight: number, oneRepMax: number): number {
  if (oneRepMax <= 0) return 0;
  return (weight / oneRepMax) * 100;
}

export interface SetSummary {
  volume: number;
  estimated1RM: number;
}

export function summarizeSet(set: SetLift, formula: OneRMFormula = "epley"): SetSummary {
  return {
    volume: setVolume(set),
    estimated1RM: estimated1RM(set.weight, set.reps, formula),
  };
}
