import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function LoginNeeded() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogin = () => {
    if (router.canDismiss()) router.dismissAll();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <AppIcon icon="warning-circle" size={50} color={theme.primary} />
      <Text style={styles.text}>로그인이 필요한 서비스입니다.</Text>
      <View style={styles.button}>
        <TextButton
          text="로그인 하러가기"
          onPress={handleLogin}
          color={theme.primary}
          backgroundColor={theme.background}
          fontSize={18}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      backgroundColor: theme.background,
    },
    text: {
      fontSize: 20,
      fontWeight: "bold",
    },
    button: {
      width: "100%",
      marginTop: 36,
      paddingHorizontal: 24,
    },
  });
