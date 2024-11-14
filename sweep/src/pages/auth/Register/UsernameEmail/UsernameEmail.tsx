import { useState } from "react";
import { Keyboard, StyleSheet, Pressable, View } from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { MainLogo } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { checkUsernameEmail } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function UsernameEmail() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isButtonActive = !!username && !!email;

  const handleUsernameEmailCheck = async () => {
    const response = await checkUsernameEmail(username, email);

    if (response.status === 200) {
      router.push("/signup/3");
    } else {
      setError(response.data.message);
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.background}>
        <MainLogo color={theme.logo} blur />
      </View>
      <View style={styles.page}>
        <Text style={styles.title}>아이디와 이메일 주소를 입력해주세요!</Text>
        <View>
          <Text style={styles.subtitle}>아이디</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="로그인 시 사용할 아이디를 입력해주세요."
            returnKeyType="next"
          />
        </View>
        <View>
          <Text style={styles.subtitle}>이메일</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해주세요."
            type="email-address"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </View>
      <TextButton
        text="다음으로"
        backgroundColor={theme.primary}
        onPress={handleUsernameEmailCheck}
        fontSize={18}
        active={isButtonActive}
      />
    </Pressable>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 36,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    page: {
      flex: 1,
      paddingVertical: 16,
      gap: 16,
      backgroundColor: "transparent",
    },
    title: {
      marginBottom: 16,
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    error: {
      marginTop: 8,
      color: "rgba(255, 0, 0, 0.8)",
      fontSize: 14,
      textAlign: "left",
    },
  });
