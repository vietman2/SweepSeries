import { Stack } from "expo-router";

export default function MyPageLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
