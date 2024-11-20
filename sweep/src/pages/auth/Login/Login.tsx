import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { KakaoButton, NaverButton, TextButton } from "@components/Buttons";
import { MainLogo } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function Login() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleGuest = () => {
    router.replace("/home");
  };

  const handleKakaoLogin = () => {
    // 1. 카카오 로그인 요청
  };

  const handleNaverLogin = async () => {
    // 1. 네이버 로그인 요청
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MainLogo />
        <Text style={styles.headerText}>
          {"지금 로그인하고\nCatch B에서 야구를 즐겨보세요!"}
        </Text>
      </View>
      <View style={styles.buttons}>
        <KakaoButton onPress={handleKakaoLogin} />
        <NaverButton onPress={handleNaverLogin} />
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
      justifyContent: "center",
      backgroundColor: theme.background,
      gap: 48,
    },
    header: {
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
    },
    headerText: {
      fontSize: 20,
      textAlign: "center",
    },
    buttons: {
      width: "100%",
      justifyContent: "center",
      paddingHorizontal: 24,
      gap: 8,
    },
    helper: {
      textAlign: "center",
      marginBottom: 8,
      fontSize: 16,
      color: theme.lowEmphasis,
    },
  });
