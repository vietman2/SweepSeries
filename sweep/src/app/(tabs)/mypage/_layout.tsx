import { TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";

import { AppIcon, HorizontalLogo } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export default function MyPageLayout() {
  const { theme } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const BackButton = () => {
    return (
      <TouchableOpacity onPress={handleBackPress}>
        <AppIcon icon="chevron-left" size={18} color={theme.lowEmphasis} />
      </TouchableOpacity>
    );
  };

  return (
    <Stack
      screenOptions={{
        headerLeft: () => <BackButton />,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <HorizontalLogo size={30} />,
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="editprofile"
        options={{
          headerTitle: "프로필 수정",
        }}
      />
      <Stack.Screen
        name="lessons"
        options={{
          headerTitle: "레슨 기록",
        }}
      />
      <Stack.Screen
        name="liked"
        options={{
          headerTitle: "좋아요 목록",
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          headerTitle: "리뷰 관리",
        }}
      />
      <Stack.Screen
        name="customerservice"
        options={{
          headerTitle: "1:1 문의",
        }}
      />
      <Stack.Screen
        name="bulletin"
        options={{
          headerTitle: "공지사항",
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          headerTitle: "자주 묻는 질문",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "알림 맞춤 설정",
        }}
      />
    </Stack>
  );
}
