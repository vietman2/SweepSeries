import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function Register() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleAcademyRegister = () => {
    router.push("/mypage/register/academy");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleAcademyRegister} testID="academy">
        <Text>아카데미 등록</Text>
      </TouchableOpacity>
      <View style={styles.button}>
        <Text>코치 등록</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: theme.background,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: 150,
      height: 150,
      borderRadius: 30,
      backgroundColor: theme.background,
      shadowColor: theme.highEmphasis,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });
