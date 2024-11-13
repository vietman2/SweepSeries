import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Link, SvgIconButton, TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { LoginNeeded } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { MainProfile } from "@fragments/Profile";
import { ThemeColorType } from "@themes/colors";

export function MyPage() {
  const { mode, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLessonsPress = () => {
    router.push("/mypage/lessons");
  };

  const handleLikedListPress = () => {
    router.push("/mypage/liked");
  };

  const handleReviewPress = () => {
    router.push("/mypage/reviews");
  };

  const handleBulletinPress = () => {
    router.push("/mypage/bulletin");
  };

  const handleAskPress = () => {
    router.push("/mypage/customerservice");
  };

  const handleFAQPress = () => {
    router.push("/mypage/faq");
  };

  const handleSettingsPress = () => {
    router.push("/mypage/settings");
  };

  const handleEventsPress = () => {};
  const handleLogoutPress = () => {
    // TODO: integrate logout with the backend
    logout();
    if (router.canDismiss()) router.dismissAll();
    router.replace("/");
  };
  const handleDeleteAccountPress = () => {};

  if (!isAuthenticated) return <LoginNeeded />;

  return (
    <>
      <Scroll style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <MainProfile />
          <TextButton
            text={
              mode === "pro"
                ? "캐치비 베이스볼 아카데미"
                : "아카데미/코치로 등록하기"
            }
            onPress={() => {}}
            color={theme.primary}
            backgroundColor={theme.background}
          />
        </View>
        <Subtitle text="내 활동" />
        <SvgIconButton
          icon="recent"
          text="레슨 기록"
          onPress={handleLessonsPress}
        />
        <SvgIconButton
          icon="heart-outline"
          text="좋아요 목록"
          onPress={handleLikedListPress}
        />
        <SvgIconButton
          icon="chatbox-outline"
          text="리뷰 관리"
          onPress={handleReviewPress}
        />
        <View style={styles.dividerWrapper}>
          <Divider bold />
        </View>
        <Subtitle text="이벤트 & 리워드" />
        <SvgIconButton
          icon="giftbox"
          text="이벤트"
          onPress={handleEventsPress}
        />
        <View style={styles.dividerWrapper}>
          <Divider bold />
        </View>
        <Subtitle text="고객센터 및 설정" />
        <SvgIconButton
          icon="lightbulb"
          text="공지사항"
          onPress={handleBulletinPress}
        />
        <SvgIconButton icon="chat" text="1:1 문의" onPress={handleAskPress} />
        <SvgIconButton
          icon="questionmark-circle"
          text="자주 묻는 질문"
          onPress={handleFAQPress}
        />
        <SvgIconButton
          icon="bell"
          text="알림 맞춤 설정"
          onPress={handleSettingsPress}
        />
        <View style={styles.dividerWrapper}>
          <Divider bold />
        </View>
        <SvgIconButton
          icon="logout"
          text="로그아웃"
          onPress={handleLogoutPress}
          color={theme.lowEmphasis}
        />
        <SvgIconButton
          icon="person-minus"
          text="회원탈퇴"
          onPress={handleDeleteAccountPress}
          color={theme.lowEmphasis}
        />
      </Scroll>
      <View style={styles.footer}>
        <Link text="개인정보 처리방침" onPress={() => {}} />
        <Link text="이용약관" onPress={() => {}} />
        <Text>현재 버전 Beta.0.1</Text>
      </View>
      {/* 
      <Withdrawal
        bottomSheetRef={withdrawalSheetRef}
        onWithdrawal={handleDeleteAccountConfirmPress}
      />*/}
    </>
  );
}

interface TextProps {
  text: string;
}

function Subtitle({ text }: Readonly<TextProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return <Text style={styles.subtitle}>{text}</Text>;
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    profile: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      marginVertical: 24,
      gap: 8,
    },
    subtitle: {
      marginTop: 8,
      marginBottom: 8,
      fontWeight: "bold",
      fontSize: 20,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    dividerWrapper: {
      marginVertical: 8,
    },
  });
