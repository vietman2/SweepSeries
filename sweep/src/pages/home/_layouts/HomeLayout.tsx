import { TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";

import { AppIcon, HorizontalLogo } from "@components/Icons";
import { HomeProvider } from "@contexts/home";
import { useTheme } from "@contexts/theme";

export function HomeLayout() {
  const { theme } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const BackButton = () => {
    return (
      <TouchableOpacity
        onPress={handleBackPress}
        style={{ padding: 8 }}
        testID="back-button"
      >
        <AppIcon icon="chevron-left" size={20} color={theme.highEmphasis} />
      </TouchableOpacity>
    );
  };

  return (
    <HomeProvider>
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
        <Stack.Screen name="academy/[id]" />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerTitle: "레슨 상세",
          }}
        />
        <Stack.Screen
          name="reserve/[id]"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </HomeProvider>
  );
}
