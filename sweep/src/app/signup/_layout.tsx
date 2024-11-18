import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export default function SignupLayout() {
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
    <Stack
      screenOptions={{
        headerLeft: BackButton,
        headerTitle: "회원가입",
      }}
      initialRouteName="1"
    >
      <Stack.Screen name="1" />
      <Stack.Screen name="2" />
      <Stack.Screen name="3" />
    </Stack>
  );
}
