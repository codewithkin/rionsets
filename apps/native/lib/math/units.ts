export type WeightUnit = "kg" | "lb";

export interface WeightValue {
  value: number;
  unit: WeightUnit;
}

const KG_PER_LB = 0.45359237;
const LB_PER_KG = 1 / KG_PER_LB;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return value;
  return from === "kg" ? kgToLb(value) : lbToKg(value);
}

export function roundTo(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export interface RoundingConfig {
  kgStep: number;
  lbStep: number;
}

export const DEFAULT_ROUNDING: RoundingConfig = {
  kgStep: 2.5,
  lbStep: 5,
};

export function roundWeight(value: number, unit: WeightUnit, config: RoundingConfig = DEFAULT_ROUNDING): number {
  const step = unit === "kg" ? config.kgStep : config.lbStep;
  return roundTo(value, step);
}

export function perHandToTotal(perHand: number, factor = 2): number {
  return perHand * factor;
}

export function totalToPerHand(total: number, factor = 2): number {
  return total / factor;
}
