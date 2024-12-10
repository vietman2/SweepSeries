import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, Redirect } from "expo-router";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  me as getProfile,
  login as kakaoLogin,
  isLogined as isKakaoLoggedIn,
} from "@react-native-kakao/user";
import NaverLogin from "@react-native-seoul/naver-login";

import { KakaoButton, NaverButton, TextButton } from "@components/Buttons";
import { MainLogo } from "@components/Icons";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { naverLogin as naverLoginRequest } from "@services/auth";
import { ThemeColorType } from "@themes/colors";

export function Login() {
  const { login, selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleGuest = () => {
    router.replace("/home");
  };

  const handleKakaoLogin = async () => {
    // 1. 카카오 로그인 요청
    const fetchProfile = async () => {
      await getProfile();
    };

    try {
      const isLoggedIn = await isKakaoLoggedIn();
      if (isLoggedIn) {
        await fetchProfile();
      } else {
        await kakaoLogin();
        await fetchProfile();
      }
    } catch {
      alert(
        "카카오 로그인 실패",
        "카카오 로그인에 실패했습니다. 다시 시도해주세요."
      );
    }
    // TODO: Finish Kakao Login
    /*const result = await kakaoLogin();

    if (result) {
      console.log(result);
      // 2. 카카오 로그인 성공 시 프로필 요청
      const profile = await getProfile();

      if (profile) {
        console.log(profile);
      }
    }*/
  };

  const handleNaverLogin = async () => {
    const result = await NaverLogin.login();

    try {
      const token = result.successResponse?.accessToken;
      if (!token) {
        alert(
          "네이버 로그인 실패",
          "네이버 로그인에 실패했습니다. 다시 시도해주세요."
        );
        return;
      }
      const profile = await NaverLogin.getProfile(token);

      const response = await naverLoginRequest(profile);
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

  useEffect(() => {
    const initializeKakao = async () => {
      const kakaoAppKey = process.env.EXPO_PUBLIC_KAKAO_APP_KEY;
      initializeKakaoSDK(kakaoAppKey || "");
    };

    const initializeNaver = async () => {
      const naverAppKey = process.env.EXPO_PUBLIC_NAVER_CONSUMER_KEY;
      const naverAppSecret = process.env.EXPO_PUBLIC_NAVER_CONSUMER_SECRET;

      NaverLogin.initialize({
        appName: "Catch B",
        consumerKey: naverAppKey || "",
        consumerSecret: naverAppSecret || "",
        serviceUrlSchemeIOS: "catchb",
      });
    };

    /*const reset = async () => {
      try {
        await unlink();
        await NaverLogin.deleteToken();
      } catch (e) {
        console.log(e);
      }
    };
    reset();*/

    initializeKakao();
    initializeNaver();
  }, []);

  if (selectedProfile) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MainLogo />
        <Text style={styles.headerText}>
          {"지금 로그인하고\nCatch B에서 야구를 즐겨보세요!"}
        </Text>
      </View>
      <View style={styles.buttons}>
        <KakaoButton onPress={handleKakaoLogin} />
        <NaverButton onPress={handleNaverLogin} />
        <TextButton
          text="비회원으로 둘러보기"
          onPress={handleGuest}
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
      gap: 48,
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
    helper: {
      textAlign: "center",
      marginBottom: 8,
      fontSize: 16,
      color: theme.lowEmphasis,
    },
  });
