import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onRefresh?: () => void;
}

export function ErrorPage({ onRefresh }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <Text style={styles.headlineText}>오류가 발생했습니다.</Text>
      <Text style={styles.mediumText}>잠시 후 다시 시도해주세요.</Text>
      {onRefresh && (
        <TouchableOpacity onPress={onRefresh} style={styles.button} testID="refresh">
          <Text style={styles.mediumText}>새로고침</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "lightgray",
  },
  headlineText: {
    fontSize: 24,
  },
  mediumText: {
    fontSize: 16,
  },
});
