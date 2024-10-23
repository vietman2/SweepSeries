import { ActivityIndicator, StyleSheet } from "react-native";

export function LoadingComponent() {
  // TODO: theme color
  return <ActivityIndicator animating color="#14863E" style={styles.loading} />;
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});
