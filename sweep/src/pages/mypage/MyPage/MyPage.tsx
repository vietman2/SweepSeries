import { StyleSheet, Text, View } from "react-native";

import { Link, SvgIconButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { LoginNeeded } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { MainProfile } from "@fragments/Profile";
import { ThemeColorType } from "@themes/colors";

export function MyPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRecentlyViewedPress = () => {};
  const handleLikedListPress = () => {};
  const handleReviewPress = () => {};
  const handleEventsPress = () => {};
  const handleBulletinPress = () => {};
  const handleAskPress = () => {};
  const handleFAQPress = () => {};
  const handleSettingsPress = () => {};
  const handleLogoutPress = () => {};
  const handleDeleteAccountPress = () => {};

  if (!token) return <LoginNeeded />;

  return (
    <>
      <Scroll style={styles.container}>
        <View style={styles.profile}>
          <MainProfile />
        </View>
        <Subtitle text="내 활동" />
        <SvgIconButton
          icon="recent"
          text="최근 본 아카데미/코치"
          onPress={handleRecentlyViewedPress}
        />
        <SvgIconButton
          icon="heart-outline"
          text="좋아요 목록"
          onPress={handleLikedListPress}
        />
        <SvgIconButton
          icon="chatbox-outline"
          text="내가 쓴 리뷰"
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
        />
        <SvgIconButton
          icon="person-minus"
          text="회원탈퇴"
          onPress={handleDeleteAccountPress}
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
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },
    profile: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
      marginVertical: 20,
    },
    subtitle: {
      marginTop: 10,
      marginBottom: 7.5,
      fontWeight: "bold",
      fontSize: 20,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    dividerWrapper: {
      marginVertical: 7.5,
    },
  });
