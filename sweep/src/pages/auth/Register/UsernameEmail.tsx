import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { TextButton } from "@components/Buttons";
import { MainLogo } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function UsernameEmail() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isButtonActive = !!username && !!email;

  const handleUsernameEmailCheck = async () => {
    /*
    const response = await checkUsernameEmail(username, email);

    if (response.status === 200) {
      setStep(2);
    } else {
      setError(response.data.error);
    }*/
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.background}>
          <MainLogo color={theme.lowEmphasis} />
        </View>
        <View style={styles.page}>
          <View>
            <View style={styles.body}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="로그인 시 사용할 아이디를 입력해주세요."
              />
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    background: {
      position: "absolute",
      top: 200,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    page: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: "transparent",
      paddingHorizontal: 20,
    },
    body: {
      marginTop: 20,
    },
    error: {
      marginTop: 10,
      color: "rgba(255, 0, 0, 0.8)",
      fontSize: 14,
      textAlign: "left",
    },
  });
