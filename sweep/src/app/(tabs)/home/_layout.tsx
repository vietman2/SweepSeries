import { TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";

import { AppIcon, HorizontalLogo } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export default function HomeLayout() {
  const { theme } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const BackButton = () => {
    return (
      <TouchableOpacity onPress={handleBackPress} style={{ padding: 8 }}>
        <AppIcon icon="chevron-left" size={20} color={theme.highEmphasis} />
      </TouchableOpacity>
    );
  };

  return (
    <Stack
      screenOptions={{
        headerLeft: () => <BackButton />,
        headerShadowVisible: false,
        headerTitle: "",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <HorizontalLogo size={30} />,
        }}
      />
      <Stack.Screen
        name="academy/my"
        options={{
          headerTitle: "내 아카데미",
        }}
      />
      <Stack.Screen name="academy/coach/[id]" />
      <Stack.Screen name="academy/[id]" />
    </Stack>
  );
}
