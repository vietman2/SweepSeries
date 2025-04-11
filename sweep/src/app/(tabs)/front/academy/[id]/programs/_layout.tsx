import { Stack } from "expo-router";

export default function AcademyProgramsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[programid]" />
      <Stack.Screen name="create" />
    </Stack>
  );
}
