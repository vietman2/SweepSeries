import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { TextButton } from "@components/Buttons";
import { VerticalDivider } from "@components/Dividers";
import { AuthLogo } from "@components/Icons";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { login as loginRequest } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleBack = () => {
    router.back();
  };

  const handleLogin = async () => {
    const response = await loginRequest(username, password);

    if (response) {
      login(response.user.mode, response.user.profile);
      router.dismissAll();
      router.replace("/home");
    } else {
      alert("로그인 실패", "로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      <AuthLogo />
      <View style={styles.inputs}>
        <TextInput
          placeholder="아이디"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor={theme.lowEmphasis}
          style={styles.input}
          testID="아이디"
        />
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.lowEmphasis}
          style={styles.input}
          testID="비밀번호"
        />
        <TextButton
          text="로그인"
          onPress={handleLogin}
          fontSize={16}
          backgroundColor={theme.primary}
          color={theme.background}
        />
        <View style={styles.row}>
          <TouchableOpacity>
            <Text style={styles.helpText}>아이디 찾기</Text>
          </TouchableOpacity>
          <VerticalDivider width={1} color={theme.border} />
          <TouchableOpacity>
            <Text style={styles.helpText}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.wrapper}>
        <TextButton
          text="돌아가기"
          onPress={handleBack}
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
      justifyContent: "center",
      backgroundColor: theme.background,
      gap: 8,
    },
    inputs: {
      width: "100%",
      marginVertical: 8,
      paddingHorizontal: 24,
    },
    input: {
      width: "100%",
      height: 40,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: theme.border,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      gap: 24,
    },
    helpText: {
      color: theme.lowEmphasis,
      fontSize: 16,
      textAlign: "center",
    },
    wrapper: {
      width: "100%",
      justifyContent: "center",
      paddingHorizontal: 24,
      gap: 8,
    },
  });
