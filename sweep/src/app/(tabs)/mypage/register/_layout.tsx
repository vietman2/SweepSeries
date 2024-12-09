import { TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export default function ProModeRegisterLayout() {
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
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="academy"
        options={{
          headerTitle: "아카데미 등록",
        }}
      />
      <Stack.Screen
        name="coach"
        options={{
          headerTitle: "코치 등록",
        }}
      />
    </Stack>
  );
}
