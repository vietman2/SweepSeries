import { StyleSheet, Text, View } from "react-native";

export function LoginNeeded() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인이 필요한 서비스입니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
