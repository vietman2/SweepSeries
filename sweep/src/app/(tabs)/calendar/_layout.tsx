import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function CalendarLayout() {
  const { theme } = useTheme();

  const goBack = () => {
    router.dismiss();
  };

  const CloseButton = () => (
    <TouchableOpacity onPress={goBack}>
      <AppIcon icon="close" size={24} color={theme.highEmphasis} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="addschedule"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "일정 추가",
          headerShadowVisible: false,
          headerRight: () => null,
        }}
      />
    </Stack>
  );
}
