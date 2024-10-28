import { Tabs } from 'expo-router';

import { AppIcon } from '@components/Icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#14863E",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <AppIcon icon="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "캘린더",
          tabBarIcon: ({ color }) => <AppIcon icon="calendar-number" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "커뮤니티",
          tabBarIcon: ({ color }) => <AppIcon icon="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "MY",
          tabBarIcon: ({ color }) => (
            <AppIcon icon="person-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
