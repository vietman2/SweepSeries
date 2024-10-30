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
        name="recentlyviewed"
        options={{
          headerTitle: "최근 본 아카데미/코치",
        }}
      />
      <Stack.Screen
        name="liked"
        options={{
          headerTitle: "좋아요 목록",
        }}
      />
      <Stack.Screen
        name="customerservice"
        options={{
          headerTitle: "1:1 문의",
        }}
      />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
