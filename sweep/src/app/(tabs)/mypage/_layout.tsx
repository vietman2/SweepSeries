import { Stack } from "expo-router";

import { HorizontalLogo } from "@components/Icons";

export default function MyPageLayout() {
  const HeaderLeft = () => <HorizontalLogo size={30} />;

  return (
    <Stack
      screenOptions={{
        headerLeft: HeaderLeft,
        headerTitle: "",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
