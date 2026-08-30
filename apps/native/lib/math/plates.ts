import { roundTo } from "./units";

export interface PlateSet {
  weight: number;
  pairCount: number;
}

export interface PlateInventory {
  availablePlates: number[];
  barWeight: number;
  includesBar: boolean;
}

export interface PlateConfiguration {
  plates: PlateSet[];
  barWeight: number;
  totalWeight: number;
  remainder: number;
  exactMatch: boolean;
}

export const DEFAULT_INVENTORY: PlateInventory = {
  availablePlates: [25, 20, 15, 10, 5, 2.5, 1.25],
  barWeight: 20,
  includesBar: true,
};

export const STANDARD_BAR = 20;
export const WOMENS_BAR = 15;

function sortDesc(plates: number[]): number[] {
  return [...new Set(plates)].sort((a, b) => b - a);
}

export function calculatePlates(
  targetWeight: number,
  inventory: PlateInventory = DEFAULT_INVENTORY,
): PlateConfiguration {
  const { availablePlates, barWeight, includesBar } = inventory;

  const totalPlateTarget = Math.max(0, includesBar ? targetWeight - barWeight : targetWeight);
  const perSideTarget = totalPlateTarget / 2;

  const sorted = sortDesc(availablePlates);
  const perSide: number[] = [];
  let remaining = perSideTarget;

  for (const plate of sorted) {
    while (remaining >= plate - 1e-9) {
      perSide.push(plate);
      remaining -= plate;
    }
  }

  const platePairs: Record<number, number> = {};
  for (const p of perSide) {
    platePairs[p] = (platePairs[p] ?? 0) + 1;
  }

  const plates: PlateSet[] = Object.entries(platePairs)
    .map(([key, count]) => ({ weight: Number(key), pairCount: count }))
    .sort((a, b) => b.weight - a.weight);

  const loaded = perSide.reduce((sum, p) => sum + p, 0) * 2;
  const total = includesBar ? barWeight + loaded : loaded;

  return {
    plates,
    barWeight: includesBar ? barWeight : 0,
    totalWeight: total,
    remainder: roundTo(Math.max(0, remaining) * 2, 2.5),
    exactMatch: remaining < 1e-9,
  };
}

export function calculateTotalFromPlates(
  plateSet: PlateSet[],
  inventory: PlateInventory = DEFAULT_INVENTORY,
): number {
  const loaded = plateSet.reduce((sum, p) => sum + p.weight * p.pairCount * 2, 0);
  const { includesBar, barWeight } = inventory;
  return includesBar ? barWeight + loaded : loaded;
}

export function remainingToTarget(targetWeight: number, loadedTotal: number): number {
  return roundTo(Math.max(0, targetWeight - loadedTotal), 2.5);
}
