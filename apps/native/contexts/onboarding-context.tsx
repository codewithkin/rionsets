import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  emptyProfile,
  isOnboardingComplete,
  loadProfile,
  saveProfile,
  type FitnessGoal,
  type OnboardingProfile,
} from "@/lib/onboarding/profile";
import type { WeightUnit } from "@/lib/math/units";

type OnboardingContextType = {
  profile: OnboardingProfile | null;
  isLoading: boolean;
  isComplete: boolean;
  updateUnit: (unit: WeightUnit) => Promise<void>;
  toggleGoal: (goal: FitnessGoal) => Promise<void>;
  setLevel: (level: OnboardingProfile["level"]) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadProfile()
      .then((loaded) => {
        if (active) setProfile(loaded ?? emptyProfile());
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (next: OnboardingProfile) => {
    setProfile(next);
    await saveProfile(next);
  }, []);

  const updateUnit = useCallback(
    async (unit: WeightUnit) => {
      if (!profile) return;
      await persist({ ...profile, unit });
    },
    [profile, persist],
  );

  const toggleGoal = useCallback(
    async (goal: FitnessGoal) => {
      if (!profile) return;
      const goals = profile.goals.includes(goal)
        ? profile.goals.filter((g) => g !== goal)
        : [...profile.goals, goal];
      await persist({ ...profile, goals });
    },
    [profile, persist],
  );

  const setLevel = useCallback(
    async (level: OnboardingProfile["level"]) => {
      if (!profile) return;
      await persist({ ...profile, level });
    },
    [profile, persist],
  );

  const completeOnboarding = useCallback(async () => {
    if (!profile) return;
    await persist({ ...profile, completedAt: Date.now() });
  }, [profile, persist]);

  const resetOnboarding = useCallback(async () => {
    setProfile(emptyProfile());
    await saveProfile(emptyProfile());
  }, []);

  const value = useMemo<OnboardingContextType>(
    () => ({
      profile,
      isLoading,
      isComplete: isOnboardingComplete(profile),
      updateUnit,
      toggleGoal,
      setLevel,
      completeOnboarding,
      resetOnboarding,
    }),
    [profile, isLoading, updateUnit, toggleGoal, setLevel, completeOnboarding, resetOnboarding],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
