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
      <Stack.Screen
        name="addtodo"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "할 일 추가",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="addmemo"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "메모 추가",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="search"
      />
      <Stack.Screen
        name="daily/[date]"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
