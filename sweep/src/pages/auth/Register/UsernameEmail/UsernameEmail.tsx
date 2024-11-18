import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { SignUpForm } from "@fragments/SignUp";
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
    <SignUpForm
      title="아이디와 이메일 주소를 입력해주세요!"
      buttonText="다음으로"
      buttonOnPress={handleUsernameEmailCheck}
      buttonDisabled={!isButtonActive}
    >
      <View style={styles.wrapper}>
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
    </SignUpForm>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    wrapper: {
      marginVertical: 16,
      gap: 8,
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
