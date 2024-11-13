import { Stack } from "expo-router";

import { CustomLogo } from "@components/Icons";
import { useTheme } from "@contexts/theme";

export default function FrontLayout() {
  const { theme } = useTheme();

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <CustomLogo
              image="https://picsum.photos/200"
              color={theme.logo}
              text="Catch B Academy"
            />
          ),
          headerTitle: "",
        }}
      />
    </Stack>
  );
}
