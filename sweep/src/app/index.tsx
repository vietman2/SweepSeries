import { ImageBackground, StyleSheet, View } from "react-native";

import { MainButton } from "@components/Buttons";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@assets/images/splash.png")}
        style={styles.container}
      >
        <MainButton icon="calendar" text="일하러 가기" />
        <MainButton icon="baseball" text="야구하러 가기" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    gap: 64,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
