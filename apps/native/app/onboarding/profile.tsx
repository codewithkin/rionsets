import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Separator, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import { useOnboarding } from "@/contexts/onboarding-context";
import type { ExperienceLevel, FitnessGoal } from "@/lib/onboarding/profile";
import type { WeightUnit } from "@/lib/math/units";

const GOALS: { value: FitnessGoal; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "strength", label: "Build raw strength", icon: "barbell" },
  { value: "hypertrophy", label: "Gain muscle", icon: "fitness" },
  { value: "endurance", label: "Improve endurance", icon: "timer" },
];

const LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: "New to lifting" },
  { value: "intermediate", label: "Some experience" },
  { value: "advanced", label: "Experienced" },
];

type OptionProps = {
  checked: boolean;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function OptionRow({ checked, title, subtitle, icon, onPress }: OptionProps) {
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-xl px-4 py-4"
      style={{
        backgroundColor: checked ? `${accent}1A` : undefined,
        borderWidth: 1,
        borderColor: checked ? accent : `${muted}40`,
      }}
    >
      {icon ? (
        <View className="w-8 items-center mr-3">
          <Ionicons name={icon} size={20} color={checked ? accent : muted} />
        </View>
      ) : null}
      <View className="flex-1">
        <Text className="text-foreground font-medium text-base">{title}</Text>
        {subtitle ? <Text className="text-muted text-sm mt-0.5">{subtitle}</Text> : null}
      </View>
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={22}
        color={checked ? accent : muted}
      />
    </Pressable>
  );
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { profile, toggleGoal, setLevel, updateUnit } = useOnboarding();
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");

  const anyGoalSelected = (profile?.goals.length ?? 0) > 0;

  return (
    <Container className="px-6">
      <View style={{ paddingTop: insets.top + 16, paddingBottom: 24 }}>
        <Text className="text-muted text-sm font-medium uppercase tracking-widest mb-2">
          Step 2 of 3
        </Text>
        <Text className="text-foreground text-3xl font-bold">Shape it around you</Text>
        <Text className="text-muted text-base mt-2">
          We'll tailor Iron Sets to your training.
        </Text>

        <Text className="text-foreground font-semibold text-lg mt-8 mb-3">
          Your goals
        </Text>
        <View className="gap-3">
          {GOALS.map((g) => (
            <OptionRow
              key={g.value}
              checked={profile?.goals.includes(g.value) ?? false}
              title={g.label}
              icon={g.icon}
              onPress={() => toggleGoal(g.value)}
            />
          ))}
        </View>

        <Text className="text-foreground font-semibold text-lg mt-8 mb-3">
          Your experience
        </Text>
        <View className="gap-3">
          {LEVELS.map((l) => (
            <OptionRow
              key={l.value}
              checked={profile?.level === l.value}
              title={l.label}
              onPress={() => setLevel(l.value)}
            />
          ))}
        </View>

        <Text className="text-foreground font-semibold text-lg mt-8 mb-3">
          Weights
        </Text>
        <View className="flex-row rounded-xl overflow-hidden" style={{ borderWidth: 1, borderColor: `${muted}40` }}>
          {(["kg", "lb"] as WeightUnit[]).map((unit, i) => {
            const selected = profile?.unit === unit;
            return (
              <Pressable
                key={unit}
                onPress={() => updateUnit(unit)}
                className="flex-1 items-center py-3"
                style={{
                  backgroundColor: selected ? accent : undefined,
                  borderLeftWidth: i === 0 ? 0 : 1,
                  borderLeftColor: `${muted}40`,
                }}
              >
                <Text
                  className="font-semibold text-base uppercase"
                  style={{ color: selected ? "#fff" : muted }}
                >
                  {unit}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Separator className="my-8" />

        <Button
          size="lg"
          isDisabled={!anyGoalSelected}
          onPress={() => router.push("/onboarding/first-workout")}
        >
          {anyGoalSelected ? "Continue" : "Select at least one goal"}
        </Button>
      </View>
    </Container>
  );
}
