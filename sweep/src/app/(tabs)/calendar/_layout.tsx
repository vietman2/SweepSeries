import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { CalendarProvider } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function CalendarLayout() {
  const { theme } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const BackButton = () => {
    return (
      <TouchableOpacity onPress={handleBackPress}>
        <AppIcon icon="chevron-left" size={20} color={theme.highEmphasis} />
      </TouchableOpacity>
    );
  };

  return (
    <CalendarProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
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
          name="addlesson/[date]"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "레슨 추가",
          }}
        />
        <Stack.Screen
          name="addschedule/[date]"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "일정 추가",
          }}
        />
        <Stack.Screen
          name="addtodo/[date]"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "할 일 추가",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <Stack.Screen name="search" />
        <Stack.Screen name="requests" />
        <Stack.Screen
          name="daily/[date]"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerShown: true,
            headerLeft: () => <BackButton />,
            headerTitle: "레슨 상세",
          }}
        />
      </Stack>
    </CalendarProvider>
  );
}
