import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import { useOnboarding } from "@/contexts/onboarding-context";

export default function Done() {
  const insets = useSafeAreaInsets();
  const { profile, completeOnboarding } = useOnboarding();
  const accent = useThemeColor("accent");
  const [busy, setBusy] = useState(false);

  const enter = async () => {
    if (busy) return;
    setBusy(true);
    await completeOnboarding();
    router.replace("/(drawer)");
  };

  return (
    <Container isScrollable={false} className="px-6">
      <View
        className="flex-1 items-center justify-center"
        style={{ paddingTop: insets.top + 24, paddingBottom: 24 }}
      >
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: `${accent}1A` }}
        >
          <Ionicons name="checkmark" size={48} color={accent} />
        </View>

        <Text className="text-foreground text-3xl font-bold text-center leading-tight">
          You just logged{"\n"}your first workout.
        </Text>
        <Text className="text-muted text-base mt-3 text-center leading-relaxed">
          That's how Iron Sets works — set by set, rep by rep. Every session from
          here gets you a little stronger.
        </Text>

        <View className="w-full mt-10">
          <Button size="lg" onPress={enter}>
            Enter the app
          </Button>
        </View>
      </View>
    </Container>
  );
}
