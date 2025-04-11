import { Stack } from "expo-router";

export default function AcademyNoticesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[noticeid]" />
    </Stack>
  );
}
