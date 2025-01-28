import { StyleSheet, Text, View } from "react-native";
import { router, Redirect } from "expo-router";
import {
  me as getKakaoProfile,
  login as kakaoLogin,
  isLogined as isKakaoLoggedIn,
} from "@react-native-kakao/user";
import NaverLogin from "@react-native-seoul/naver-login";

import { KakaoButton, NaverButton, TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { AuthLogo } from "@components/Icons";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { socialLogin } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function Landing() {
  const { login, selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSignup = () => {
    router.push({
      pathname: "/signup/terms",
      params: { mode: "catchb" },
    });
  };

  const handleGuest = () => {
    router.replace("/home");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleKakaoLogin = async () => {
    // 1. 카카오 로그인 요청
    try {
      const isLoggedIn = await isKakaoLoggedIn();
      if (!isLoggedIn) {
        await kakaoLogin();
      }

      const profile = await getKakaoProfile();

      const response = await socialLogin(profile.id);

      if (response === "REDIRECT") {
        alert("회원가입 필요", "회원가입이 필요합니다. 계속 진행해주세요.");
        router.push({
          pathname: "/signup/terms",
          params: {
            mode: "kakao",
            username: profile.id,
            email: profile.email,
            name: "",
            phone: "",
            birthday: profile.birthday || "",
            birthyear: profile.birthyear || "",
            gender: profile.gender || "",
            nickname: profile.nickname || "",
            profileImage: profile.profileImageUrl || "",
          },
        });
        return;
      }

      if (response) {
        login(response.user.mode, response.user.profile);
        router.replace("/home");
      } else {
        alert(
          "카카오 로그인 실패",
          "카카오 로그인에 실패했습니다. 다시 시도해주세요."
        );
      }
    } catch {
      alert(
        "카카오 로그인 실패",
        "카카오 로그인에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleNaverLogin = async () => {
    try {
      const result = await NaverLogin.login();

      const token = result.successResponse?.accessToken;
      if (!token) {
        alert(
          "네이버 로그인 실패",
          "네이버 로그인에 실패했습니다. 다시 시도해주세요."
        );
        return;
      }
      const profile = await NaverLogin.getProfile(token);

      const response = await socialLogin(profile.response.id);
      if (response === "REDIRECT") {
        alert("회원가입 필요", "회원가입이 필요합니다. 계속 진행해주세요.");
        router.push({
          pathname: "/signup/terms",
          params: {
            mode: "naver",
            username: profile.response.id,
            email: profile.response.email,
            name: profile.response.name,
            phone: profile.response.mobile || "",
            birthday: profile.response.birthday || "",
            birthyear: profile.response.birthyear || "",
            gender: profile.response.gender || "",
            nickname: profile.response.nickname || "",
            profileImage: profile.response.profile_image || "",
          },
        });
        return;
      }
      if (response) {
        login(response.user.mode, response.user.profile);
        router.replace("/home");
      } else {
        alert(
          "네이버 로그인 실패",
          "네이버 로그인에 실패했습니다. 다시 시도해주세요."
        );
      }
    } catch {
      alert(
        "네이버 로그인 실패",
        "네이버 로그인에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  if (selectedProfile) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container}>
      <AuthLogo />
      <View style={styles.buttons}>
        <KakaoButton onPress={handleKakaoLogin} />
        <NaverButton onPress={handleNaverLogin} />
        <TextButton onPress={handleLogin} text="이메일로 로그인" />
      </View>
      <View style={styles.dividerWrapper}>
        <Divider color={theme.border} />
      </View>
      <View style={styles.buttons}>
        <Text style={styles.text}>
          아직<Text style={styles.emphasis}> Catch B </Text>회원이 아니신가요?
        </Text>
        <TextButton
          text="이메일로 가입하기"
          onPress={handleSignup}
          fontSize={16}
          backgroundColor={theme.background}
          color={theme.lowEmphasis}
        />
        <TextButton
          text="비회원으로 둘러보기"
          onPress={handleGuest}
          fontSize={16}
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
      gap: 16,
    },
    header: {
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
    },
    headerText: {
      fontSize: 20,
      textAlign: "center",
    },
    buttons: {
      width: "100%",
      justifyContent: "center",
      paddingHorizontal: 24,
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
    dividerWrapper: {
      width: "100%",
      paddingHorizontal: 24,
    },
    text: {
      marginBottom: 8,
      color: theme.mediumEmphasis,
      fontSize: 16,
      textAlign: "center",
    },
    emphasis: {
      color: theme.primary,
      fontWeight: "bold",
    },
  });
