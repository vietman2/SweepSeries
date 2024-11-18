import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

const { width } = Dimensions.get("window");

export function MainPage() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleGuest = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <AppIcon icon="calendar" color={theme.primary} size={50} />
          <Text>일하러 가기</Text>
        </TouchableOpacity>
      </View>
      <Image
        src="https://kr.object.ncloudstorage.com/sweepdev/icons/mainlogo_large.png"
        style={styles.image}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <AppIcon icon="baseball" color={theme.primary} size={50} />
          <Text>야구하러 가기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.helper}>이미 계정이 있습니까?</Text>
        <TextButton
          text="로그인"
          onPress={handleLogin}
          color={theme.primary}
          backgroundColor={theme.background}
          fontSize={18}
        />
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
      paddingTop: 80,
      paddingBottom: 16,
      gap: 8,
    },
    image: {
      flex: 0.75,
      width: "55%",
      resizeMode: "contain",
    },
    wrapper: {
      flex: 0.75,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: width * 0.5,
      height: width * 0.5,
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
      elevation: 2,
    },
    footer: {
      flex: 1,
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
