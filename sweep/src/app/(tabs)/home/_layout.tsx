import { Stack } from "expo-router";

import { HorizontalLogo } from "@components/Icons";

export default function HomeLayout() {
  return (
    <Stack>
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
