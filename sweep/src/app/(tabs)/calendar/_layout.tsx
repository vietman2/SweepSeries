import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function CalendarLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="addschedule"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "일정 추가",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
