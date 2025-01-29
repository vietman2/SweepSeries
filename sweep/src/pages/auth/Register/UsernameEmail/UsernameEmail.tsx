import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useSignup } from "@contexts/signup";
import { useTheme } from "@contexts/theme";
import { SignUpForm } from "@fragments/SignUp";
import { checkUsernameEmail } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function UsernameEmail() {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");

  const [error, setError] = useState<string>("");

  const { setUsernameEmail } = useSignup();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isButtonActive = !!usernameInput && !!emailInput;

  const handleUsernameEmailCheck = async () => {
    const response = await checkUsernameEmail(usernameInput, emailInput);

    if (response.status === 200) {
      setUsernameEmail(usernameInput, emailInput);
      router.push("/signup/password");
    } else {
      setError(response.data.error);
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
            value={usernameInput}
            onChangeText={setUsernameInput}
            placeholder="로그인 시 사용할 아이디를 입력해주세요."
            returnKeyType="next"
          />
        </View>
        <View>
          <Text style={styles.subtitle}>이메일</Text>
          <TextInput
            value={emailInput}
            onChangeText={setEmailInput}
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
