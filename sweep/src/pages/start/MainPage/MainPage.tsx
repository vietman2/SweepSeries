import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function MainPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleProLogin = () => {
    login("pro");
    router.replace("/home");
  };

  const handleNormalLogin = () => {
    login("normal");
    router.replace("/home");
  };

  /*const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };*/

  const handleGuest = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button} onPress={handleProLogin}>
          <AppIcon icon="calendar" color={theme.primary} size={50} />
          <Text>일하러 가기</Text>
        </TouchableOpacity>
      </View>
      <Image
        src="https://kr.object.ncloudstorage.com/sweepdev/icons/mainlogo_large.png"
        style={styles.image}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button} onPress={handleNormalLogin}>
          <AppIcon icon="baseball" color={theme.primary} size={50} />
          <Text>야구하러 가기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        {/*
        <TextButton
          text="로그인"
          onPress={handleLogin}
          color={theme.primary}
          backgroundColor={theme.background}
          fontSize={18}
        />*/}
        <TextButton
          text="비회원으로 둘러보기"
          onPress={handleGuest}
          fontSize={18}
          backgroundColor={theme.background}
          color={theme.lowEmphasis}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.background,
      paddingVertical: 64,
      gap: 16,
    },
    image: {
      flex: 1,
      width: 300,
      resizeMode: "contain",
    },
    wrapper: {
      flex: 2,
      alignItems: "center",
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
      elevation: 4,
    },
    footer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      paddingHorizontal: 24,
      gap: 16,
    },
  });
