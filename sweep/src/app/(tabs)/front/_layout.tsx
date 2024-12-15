import { Stack } from "expo-router";

export default function FrontLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="program/create"
        options={{
          presentation: "modal",
          headerTitle: "프로그램 등록",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
