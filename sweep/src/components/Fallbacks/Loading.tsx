import { ActivityIndicator, StyleSheet } from "react-native";

import { useTheme } from "@contexts/theme";

export function LoadingComponent() {
  const { theme } = useTheme();

  return <ActivityIndicator animating color={theme.primary} style={styles.loading} />;
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});
