import { Stack } from "expo-router";

import { HorizontalLogo } from "@components/Icons";

export default function MyPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <HorizontalLogo size={30} />,
        headerTitle: "",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
