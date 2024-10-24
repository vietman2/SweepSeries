import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { KakaoButton, NaverButton, TextButton } from "@components/Buttons";
import { VerticalDivider } from "@components/Dividers";
import { LoadingComponent } from "@components/Fallbacks";
import { MainLogo } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { GSScroll } from "@components/ScrollView";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogin = async () => {
    setIsLoading(true);
    /*

    const response = await login(username, password);

    if (response.status === 200) {
      setError("");
      await dispatch(setUserState(response.data));

      const profile: ProfileType = {
        type: "user",
        uuid: response.data.user.uuid,
        name: response.data.user.profile.nickname,
        profile_image: response.data.user.profile.profile_image,
      };

      await dispatch(addUserProfile(profile));

      navigation.navigate("Main");
    } else if (response.status === 400) {
      const error = response.data;
      if (error.password) {
        setError("비밀번호를 입력해주세요.");
      } else if (error.non_field_errors[0].includes("username")) {
        setError("아이디를 입력해주세요.");
      } else {
        setError("아이디와 비밀번호를 확인해주세요.");
      }
    } else {
      setError("서버와의 연결이 원활하지 않습니다.");
    }*/

    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    login();
    router.dismissAll();
    router.replace("/home");
  };

  const handleKakaoLogin = () => {
    // 1. 카카오 로그인 요청
    setError("카카오 로그인 기능은 아직 구현되지 않았습니다.");
  };

  const handleNaverLogin = () => {
    // 1. 네이버 로그인 요청
    setError("네이버 로그인 기능은 아직 구현되지 않았습니다.");
  };

  const handleUsernameFind = () => {
    setError("아이디 찾기 기능은 아직 구현되지 않았습니다.");
  };

  const handlePasswordFind = () => {
    setError("비밀번호 찾기 기능은 아직 구현되지 않았습니다.");
  };

  return (
    <GSScroll style={styles.mainContainer}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.header}>
          <MainLogo />
          <Text style={styles.headerText}>
            {"지금 로그인하고\nCatch B에서 야구를 즐겨보세요!"}
          </Text>
        </View>
        <View style={styles.textinputs}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Catch B 아이디 입력"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호 입력"
            secureTextEntry
          />
        </View>
        <View style={styles.error}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <View style={styles.buttons}>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <TextButton text="로그인" onPress={handleLogin} fontSize={20} />
          )}
          <View style={styles.troubleshoot}>
            <TouchableOpacity
              onPress={handleUsernameFind}
              testID="find-username"
            >
              <Text style={styles.findButton}>아이디 찾기</Text>
            </TouchableOpacity>
            <VerticalDivider width={1} />
            <TouchableOpacity
              onPress={handlePasswordFind}
              testID="find-password"
            >
              <Text style={styles.findButton}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
          <KakaoButton onPress={handleKakaoLogin} />
          <NaverButton onPress={handleNaverLogin} />
        </View>
      </KeyboardAvoidingView>
    </GSScroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    buttons: {
      justifyContent: "center",
      marginTop: 20,
      marginBottom: 10,
    },
    error: {
      alignItems: "flex-end",
    },
    errorText: {
      color: "rgba(255, 0, 0, 0.8)",
      marginTop: 5,
    },
    header: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 120,
    },
    headerText: {
      marginTop: 15,
      fontSize: 20,
      textAlign: "center",
    },
    troubleshoot: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginVertical: 10,
      paddingHorizontal: 60,
    },
    textinputs: {
      marginTop: 15,
    },
    findButton: {
      color: theme.lowEmphasis,
    },
  });
