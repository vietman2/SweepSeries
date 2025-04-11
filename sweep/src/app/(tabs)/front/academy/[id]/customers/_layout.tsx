import { Stack } from "expo-router";

export default function AcademyCustomersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[studentid]" />
    </Stack>
  );
}
