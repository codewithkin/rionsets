export type EquipmentType =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "bodyweight"
  | "cable";

export interface BodyweightLoad {
  bodyweight: number;
  addedWeight: number;
  unit: "kg" | "lb";
}

export function bodyweightTotal(bodyweight: number, addedWeight = 0): number {
  return bodyweight + addedWeight;
}

export interface BodyweightLoadResult {
  total: number;
  assisted: boolean;
}

export function resolveBodyweightLoad(load: BodyweightLoad): BodyweightLoadResult {
  const total = load.bodyweight + load.addedWeight;
  return {
    total,
    assisted: load.addedWeight < 0,
  };
}

export interface MachineRatioInput {
  setWeight: number;
  ratio: number;
}

export interface MachineRatioResult {
  effectiveWeight: number;
  ratio: number;
  direction: "machine-to-loaded" | "loaded-to-machine";
}

export function applyMachineRatio(
  setWeight: number,
  ratio: number,
  direction: MachineRatioResult["direction"] = "machine-to-loaded",
): MachineRatioResult {
  if (ratio <= 0) {
    return { effectiveWeight: setWeight, ratio, direction };
  }
  const effectiveWeight =
    direction === "machine-to-loaded" ? setWeight * ratio : setWeight / ratio;
  return { effectiveWeight, ratio, direction };
}
