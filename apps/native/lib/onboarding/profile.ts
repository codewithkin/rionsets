import * as SecureStore from "expo-secure-store";
import type { WeightUnit } from "../math/units";

export const ONBOARDING_PROFILE_KEY = "iron-sets.onboarding.profile.v1";

export type FitnessGoal = "strength" | "hypertrophy" | "endurance";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface OnboardingProfile {
  unit: WeightUnit;
  goals: FitnessGoal[];
  level: ExperienceLevel;
  completedAt: number | null;
}

export function emptyProfile(): OnboardingProfile {
  return {
    unit: "kg",
    goals: [],
    level: "beginner",
    completedAt: null,
  };
}

export function isOnboardingComplete(profile: OnboardingProfile | null): boolean {
  return profile != null && profile.completedAt != null;
}

export async function loadProfile(): Promise<OnboardingProfile | null> {
  const raw = await SecureStore.getItemAsync(ONBOARDING_PROFILE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingProfile>;
    return {
      unit: parsed.unit === "lb" ? "lb" : "kg",
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      level: parsed.level ?? "beginner",
      completedAt: typeof parsed.completedAt === "number" ? parsed.completedAt : null,
    };
  } catch {
    return null;
  }
}

export async function saveProfile(profile: OnboardingProfile): Promise<void> {
  await SecureStore.setItemAsync(ONBOARDING_PROFILE_KEY, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(ONBOARDING_PROFILE_KEY);
}
