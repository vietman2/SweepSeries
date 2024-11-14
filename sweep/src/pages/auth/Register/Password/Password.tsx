import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
//import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { MainLogo } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { checkPassword } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function Password() {
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isButtonActive = !!password && !!password2;

  const handlePasswordCheck = async () => {
    const response = await checkPassword(password, password2);

    if (response.status === 200) {
      //router.push("/signup/4");
      console.log("password check success");
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
        <View style={styles.header}>
          <Text style={styles.title}>비밀번호를 설정해주세요!</Text>
          <Text style={styles.title2}>
            {"영문+숫자+특수문자 조합으로\n8자리 이상 입력해주세요."}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle}>비밀번호</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력해주세요."
            returnKeyType="next"
            secureTextEntry
          />
        </View>
        <View>
          <Text style={styles.subtitle}>비밀번호 확인</Text>
          <TextInput
            value={password2}
            onChangeText={setPassword2}
            placeholder="비밀번호를 다시 한 번 입력해주세요."
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </View>
      <TextButton
        text="다음으로"
        backgroundColor={theme.primary}
        onPress={handlePasswordCheck}
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
    header: {
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    title2: {
      fontSize: 16,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    error: {
      marginTop: 10,
      color: "rgba(255, 0, 0, 0.8)",
      fontSize: 14,
      textAlign: "left",
    },
  });
