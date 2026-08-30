import { kgToLb } from "../math/units";

export interface Milestone {
  id: string;
  label: string;
  equivalentKg: number;
}

export const LIFETIME_MILESTONES: Milestone[] = [
  { id: "elephant", label: "African Elephant", equivalentKg: 6300 },
  { id: "rhino", label: "White Rhino", equivalentKg: 2300 },
  { id: "piano", label: "Concert Grand Piano", equivalentKg: 480 },
  { id: "car", label: "Compact Car", equivalentKg: 1300 },
  { id: "refrigerator", label: "Refrigerator", equivalentKg: 90 },
  { id: "grizzly", label: "Grizzly Bear", equivalentKg: 350 },
];

export interface MilestoneStat {
  milestone: Milestone;
  count: number;
}

export interface LifetimeVolumeResult {
  totalVolume: number;
  unit: "kg" | "lb";
  bestMilestones: MilestoneStat[];
}

export function equivalentUnits(totalVolumeKg: number, milestoneEquivalentKg: number): number {
  if (milestoneEquivalentKg <= 0) return 0;
  return totalVolumeKg / milestoneEquivalentKg;
}

export function largestMilestoneExceeded(
  totalVolumeKg: number,
  milestones: Milestone[] = LIFETIME_MILESTONES,
): Milestone | null {
  let best: Milestone | null = null;
  for (const m of milestones) {
    if (totalVolumeKg >= m.equivalentKg && (best === null || m.equivalentKg > best.equivalentKg)) {
      best = m;
    }
  }
  return best;
}

export function formatVolume(currentTotalKg: number, unit: "kg" | "lb" = "kg"): LifetimeVolumeResult {
  const inUnit = unit === "kg" ? currentTotalKg : kgToLb(currentTotalKg);
  const sorted = [...LIFETIME_MILESTONES].sort((a, b) => a.equivalentKg - b.equivalentKg);

  const bestMilestones: MilestoneStat[] = [];
  let remaining = inUnit;
  for (const m of sorted) {
    if (remaining < m.equivalentKg) continue;
    const count = Math.floor(remaining / m.equivalentKg);
    bestMilestones.push({ milestone: m, count });
  }
  return {
    totalVolume: inUnit,
    unit,
    bestMilestones,
  };
}

export function milestoneSentence(kg: number, unit: "kg" | "lb" = "kg"): string {
  const result = formatVolume(kg, unit);
  if (result.bestMilestones.length === 0) return "No milestone reached yet.";
  const top = result.bestMilestones[result.bestMilestones.length - 1];
  return `${Math.round(result.totalVolume).toLocaleString()} ${unit} lifted \u2014 equivalent to ${top.count.toLocaleString()} ${top.milestone.label}${top.count > 1 ? "s" : ""}.`;
}
