import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function MainPage() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@assets/images/splash.png")}
        style={styles.container}
      >
        <Link href="/home">
          <View style={styles.button}>
            <AppIcon icon="calendar" color={theme.primary} size={50} />
            <Text>일하러 가기</Text>
          </View>
        </Link>
        <Link href="/login">
          <View style={styles.button}>
            <AppIcon icon="baseball" color={theme.primary} size={50} />
            <Text>야구하러 가기</Text>
          </View>
        </Link>
      </ImageBackground>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
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
      backgroundColor: theme.background,
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
  });
