import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useTheme } from "@contexts/theme";
import { Dugout, Draft, Market } from "@pages/community";

const Tab = createMaterialTopTabNavigator();

export default function CommunityList() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarIndicatorStyle: { backgroundColor: theme.primary },
        tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="dugout"
        component={Dugout}
        options={{ title: "덕아웃" }}
      />
      <Tab.Screen
        name="draft"
        component={Draft}
        options={{ title: "드래프트" }}
      />
      <Tab.Screen
        name="market"
        component={Market}
        options={{ title: "마켓" }}
      />
    </Tab.Navigator>
  );
}
