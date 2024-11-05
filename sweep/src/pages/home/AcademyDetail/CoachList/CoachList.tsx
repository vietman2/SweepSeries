import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { sampleCoaches } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function CoachList() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setCoaches(sampleCoaches);
  }, []);

  return (
    <View style={styles.container}>
      {coaches.map((coach) => (
        <CoachSimple key={coach.uuid} coach={coach} />
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
