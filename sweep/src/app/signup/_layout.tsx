import { TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { SignupProvider } from "@contexts/signup";
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
    <SignupProvider>
      <Stack
        screenOptions={{
          headerLeft: BackButton,
          headerTitle: "회원가입",
        }}
        initialRouteName="terms/index"
      >
        <Stack.Screen name="terms/[id]" />
        <Stack.Screen name="terms/index" />
        <Stack.Screen name="username" />
        <Stack.Screen name="password" />
        <Stack.Screen name="phone" />
        <Stack.Screen name="extras" />
      </Stack>
    </SignupProvider>
  );
}
