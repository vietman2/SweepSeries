import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions } from "react-native";

import { TabBar } from "@components/Tabs";
import { RecentAcademies, RecentCoaches } from "@pages/mypage";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth } = Dimensions.get("window");

export default function RecentlyViewed() {
  return (
    <Tab.Navigator
      initialRouteName="academies"
      initialLayout={{ width: screenWidth }}
      tabBar={(props) => <TabBar {...props} />}
      backBehavior="none"
    >
      <Tab.Screen
        name="academies"
        component={RecentAcademies}
        options={{ title: "아카데미" }}
      />
      <Tab.Screen
        name="coaches"
        component={RecentCoaches}
        options={{ title: "코치" }}
      />
    </Tab.Navigator>
  );
}
