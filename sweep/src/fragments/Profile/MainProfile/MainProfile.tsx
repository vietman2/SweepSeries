import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function MainProfile() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleEditProfile = () => {
    router.push("/mypage/editprofile");
  };

  return (
    <View>
      <View style={styles.wrapper}>
        <Image
          src="https://kr.object.ncloudstorage.com/sweepdev/test_images/hong.jpg"
          style={styles.image}
        />
      </View>
      <LinearGradient
        colors={["#00BF60", "#00592D"]}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.nickname}
      >
        <Text style={styles.nicknameText}>홍길동</Text>
      </LinearGradient>
      <TouchableOpacity
        style={styles.edit}
        onPress={handleEditProfile}
        activeOpacity={0.75}
        testID="edit-profile"
      >
        <AppIcon icon="pencil" size={24} color={theme.primary} />
      </TouchableOpacity>
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
