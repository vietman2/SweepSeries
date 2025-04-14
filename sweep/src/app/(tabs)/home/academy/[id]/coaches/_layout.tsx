import { Stack } from "expo-router";

export default function AcademyCoachLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="[coachid]"
      />
    </Stack>
  );
}
