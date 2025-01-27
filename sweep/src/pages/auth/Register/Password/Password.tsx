import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useSignup } from "@contexts/signup";
import { useTheme } from "@contexts/theme";
import { SignUpForm } from "@fragments/SignUp";
import { checkPassword } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function Password() {
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { setPasswords } = useSignup();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isButtonActive = !!password && !!password2;

  const handlePasswordCheck = async () => {
    const response = await checkPassword(password, password2);

    if (response.status === 200) {
      setPasswords(password, password2);
      router.push("/signup/phone");
    } else {
      setError(response.data.error);
    }
  };

  return (
    <SignUpForm
      title="비밀번호를 설정해주세요!"
      subtitle={"영문+숫자+특수문자 조합으로\n8자리 이상 입력해주세요."}
      buttonText="다음으로"
      buttonOnPress={handlePasswordCheck}
      buttonDisabled={!isButtonActive}
    >
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
    </SignUpForm>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
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
