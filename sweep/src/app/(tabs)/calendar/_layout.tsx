import { Stack } from "expo-router";

import { HorizontalLogo } from "@components/Icons";

export default function CalendarLayout() {
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
        }}
      />
    </Stack>
  );
}
