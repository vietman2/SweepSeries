import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";

import { AppIcon, HorizontalLogo } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function CalendarLayout() {
  const { theme } = useTheme();

  const handleSettingsPress = () => {
    router.push("/calendar/settings");
  };

  const SettingButton = () => (
    <TouchableOpacity onPress={handleSettingsPress}>
      <AppIcon icon="settings" size={24} color={theme.primary} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <HorizontalLogo size={30} />,
          headerTitle: "",
          headerRight: () => <SettingButton />,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
    </Stack>
  );
}
