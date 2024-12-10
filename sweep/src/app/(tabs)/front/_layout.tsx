import { Stack } from "expo-router";

export default function FrontLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="academy/[id]" />
    </Stack>
  );
}
