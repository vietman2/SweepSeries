import { Image, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function MainProfile() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <View style={styles.wrapper}>
        <Image
          source={require("@assets/images/hong.jpg")}
          style={styles.image}
        />
      </View>
      <View style={styles.nickname}>
        <Text style={styles.nicknameText}>홍길동</Text>
      </View>
      <View style={styles.edit}>
        <AppIcon icon="pencil" size={24} color={theme.primary} />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    wrapper: {
      padding: 10,
      borderWidth: 10,
      borderColor: theme.border,
      borderRadius: 95,
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    nickname: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: -36,
      paddingVertical: 12,
      backgroundColor: theme.primary,
      borderRadius: 24,
    },
    nicknameText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.background,
    },
    edit: {
      position: "absolute",
      right: -10,
      top: 24,
      alignItems: "center",
      justifyContent: "center",
      width: 50,
      height: 50,
      backgroundColor: theme.background,
      borderRadius: 25,
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
  });
