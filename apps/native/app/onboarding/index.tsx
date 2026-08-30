import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";

const BENEFITS = [
  {
    icon: "trending-up" as const,
    title: "Beat your last set",
    body: "Every lift is the next one's target.",
  },
  {
    icon: "flash" as const,
    title: "Set-by-set guidance",
    body: "Know exactly what to load next.",
  },
  {
    icon: "barbell" as const,
    title: "Strength that compounds",
    body: "Progress you can see, week after week.",
  },
];

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const accent = useThemeColor("accent");

  return (
    <Container isScrollable={false} className="px-6">
      <View
        className="flex-1 justify-between"
        style={{ paddingTop: insets.top + 24, paddingBottom: 24 }}
      >
        <View>
          <View className="flex-row items-center gap-2 mb-10">
            <Ionicons name="barbell-outline" size={22} color={accent} />
            <Text className="text-foreground text-base font-semibold tracking-widest">
              IRON SETS
            </Text>
          </View>

          <Text className="text-foreground text-4xl font-bold leading-tight">
            Log every set.{"\n"}Watch the strength come.
          </Text>
          <Text className="text-muted text-base mt-3 leading-relaxed">
            Your own coach in your pocket. Track each set, see your best, and push
            further every session.
          </Text>

          <View className="mt-10 gap-5">
            {BENEFITS.map((b) => (
              <View key={b.title} className="flex-row items-start gap-4">
                <Surface variant="transparent" className="w-10 h-10 rounded-xl items-center justify-center">
                  <Ionicons name={b.icon} size={20} color={accent} />
                </Surface>
                <View className="flex-1">
                  <Text className="text-foreground font-medium text-base">{b.title}</Text>
                  <Text className="text-muted text-sm mt-0.5">{b.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Button size="lg" onPress={() => router.push("/onboarding/profile")}>
          Get started
        </Button>
      </View>
    </Container>
  );
}
