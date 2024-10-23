import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import { AppIcon } from "@components/Icons";

export function MainPage() {
  // TODO: 화면 구현
  // 일단 자동로그인
  // if 성공: tabs로 이동
  // else: 아래 화면

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@assets/images/splash.png")}
        style={styles.container}
      >
        <Link href="/login">
          <View style={styles.button}>
            <AppIcon icon="calendar" color="#14863E" size={50} />
            <Text>일하러 가기</Text>
          </View>
        </Link>
        <Link href="/login">
          <View style={styles.button}>
            <AppIcon icon="baseball" color="#14863E" size={50} />
            <Text>야구하러 가기</Text>
          </View>
        </Link>
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    gap: 8,
    borderRadius: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
