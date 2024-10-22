import React from 'react';
import { Tabs } from 'expo-router';

import { AppIcon } from '@components/Icons';
import { useClientOnlyValue } from '@hooks/useClientOnlyValue';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#14863E",
        headerShown: useClientOnlyValue(false, true),
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
        name="steal"
        options={{
          title: "스틸",
          tabBarIcon: ({ color }) => <AppIcon icon="film" color={color} />,
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
          title: "마이",
          tabBarIcon: ({ color }) => <AppIcon icon="person-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
