import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { useTheme } from "@contexts/theme";
import { CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { sampleCoaches } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function CoachList() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCoachPress = (coach: CoachSimpleType) => {
    router.push({
      pathname: "/home/academy/coach/[id]",
      params: { id: coach.uuid },
    });
  };

  useEffect(() => {
    setCoaches(sampleCoaches);
  }, []);

  return (
    <View style={styles.container}>
      {coaches.map((coach) => (
        <TouchableOpacity
          key={coach.uuid}
          onPress={() => handleCoachPress(coach)}
          testID={`coach-${coach.uuid}`}
        >
          <CoachSimple coach={coach} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
      backgroundColor: theme.background,
    },
  });
