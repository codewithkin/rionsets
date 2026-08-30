import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import { useOnboarding } from "@/contexts/onboarding-context";
import { createDatabase, type Exercise } from "@/lib/db";
import { ExerciseRepository } from "@/lib/repositories/exercise-repo";
import { SetRepository, WorkoutRepository } from "@/lib/repositories/workout-repo";
import type { WeightUnit } from "@/lib/math/units";

const CURATED_EXERCISES = [
  "Barbell Bench Press",
  "Barbell Back Squat",
  "Overhead Press",
  "Barbell Row",
];

type LoggedSet = { id: string; weight: number; reps: number };

export default function FirstWorkout() {
  const insets = useSafeAreaInsets();
  const { profile } = useOnboarding();
  const unit: WeightUnit = profile?.unit ?? "kg";
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");
  const fieldBorder = useThemeColor("field-border");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState<LoggedSet[]>([]);
  const [busy, setBusy] = useState(false);

  const workoutId = useRef<string | null>(null);
  const setRepo = useRef<SetRepository | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const db = await createDatabase();
      const exerciseRepo = new ExerciseRepository(db);
      await exerciseRepo.seedLibrary();
      const all = await exerciseRepo.findAll();
      const curated = all.filter((e) => CURATED_EXERCISES.includes(e.name));
      const defaultExercise = curated[0] ?? undefined;
      setRepo.current = new SetRepository(db);
      if (active) {
        setExercises(curated);
        if (defaultExercise) setExercise(defaultExercise);
      }
      const workoutRepo = new WorkoutRepository(db);
      const workout = await workoutRepo.create({ name: "My first workout" });
      workoutId.current = workout.id;
    })();
    return () => {
      active = false;
    };
  }, []);

  const parsedWeight = Number.parseFloat(weight);
  const parsedReps = Number.parseInt(reps, 10);
  const canAddSet =
    exercise != null && !Number.isNaN(parsedWeight) && parsedWeight > 0 && !Number.isNaN(parsedReps) && parsedReps > 0;
  const canFinish = sets.length > 0;

  const addSet = async () => {
    if (!exercise || !canAddSet || !workoutId.current || !setRepo.current) return;
    const set = await setRepo.current.append(workoutId.current, {
      exerciseId: exercise.id,
      weight: parsedWeight,
      reps: parsedReps,
    });
    setSets((prev) => [...prev, { id: set.id, weight: set.weight, reps: set.reps }]);
    setWeight("");
    setReps("");
  };

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    router.replace("/onboarding/done");
  };

  return (
    <Container className="px-6" scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}>
      <View style={{ paddingTop: insets.top + 16, paddingBottom: 24 }}>
        <Text className="text-muted text-sm font-medium uppercase tracking-widest mb-2">
          Your first set
        </Text>
        <Text className="text-foreground text-3xl font-bold">Let's log a lift</Text>
        <Text className="text-muted text-base mt-2">
          This is it — the whole app is about the seconds between sets.
        </Text>

        <Text className="text-foreground font-semibold text-lg mt-8 mb-3">Pick an exercise</Text>
        <View className="flex-row flex-wrap gap-2">
          {exercises.map((ex) => {
            const selected = exercise?.id === ex.id;
            return (
              <Pressable
                key={ex.id}
                onPress={() => setExercise(ex)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: selected ? accent : undefined,
                  borderWidth: 1,
                  borderColor: selected ? accent : `${muted}40`,
                }}
              >
                <Text
                  className="font-medium text-sm"
                  style={{ color: selected ? "#fff" : muted }}
                >
                  {ex.name.replace("Barbell ", "")}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-foreground font-semibold text-lg mt-8 mb-3">
          Enter your set
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-muted text-xs mb-1.5 uppercase tracking-wider">Weight ({unit})</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="0"
              placeholderTextColor={muted}
              keyboardType="numeric"
              className="rounded-xl px-4 py-3 text-foreground text-lg"
              style={{ borderWidth: 1, borderColor: fieldBorder, backgroundColor: "transparent" }}
            />
          </View>
          <View className="w-28">
            <Text className="text-muted text-xs mb-1.5 uppercase tracking-wider">Reps</Text>
            <TextInput
              value={reps}
              onChangeText={setReps}
              placeholder="0"
              placeholderTextColor={muted}
              keyboardType="number-pad"
              className="rounded-xl px-4 py-3 text-foreground text-lg"
              style={{ borderWidth: 1, borderColor: fieldBorder, backgroundColor: "transparent" }}
            />
          </View>
        </View>

        <Button size="lg" className="mt-3" isDisabled={!canAddSet} onPress={addSet}>
          Add set
        </Button>

        {sets.length > 0 && (
          <Surface variant="secondary" className="mt-6 rounded-xl p-4">
            <Text className="text-foreground font-semibold mb-3">
              {exercise?.name} · {sets.length} set{sets.length > 1 ? "s" : ""}
            </Text>
            {sets.map((s, i) => (
              <View key={s.id} className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: accent }}
                  >
                    <Text className="text-white text-xs font-bold">{i + 1}</Text>
                  </View>
                  <Text className="text-foreground font-medium">
                    {s.weight} {unit} × {s.reps}
                  </Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={accent} />
              </View>
            ))}
          </Surface>
        )}

        <View className="h-4" />

        <Button
          size="lg"
          variant="secondary"
          isDisabled={!canFinish || busy}
          onPress={finish}
        >
          {sets.length > 0 ? "Finish workout" : "Add a set to finish"}
        </Button>
      </View>
    </Container>
  );
}
