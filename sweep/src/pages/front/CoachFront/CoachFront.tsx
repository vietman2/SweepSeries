import { Dimensions, View } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";

import { CoachProfile } from "./CoachProfile/CoachProfile";
import { TabBar } from "@components/Tabs";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Placeholder = () => <View />;

export function CoachFront() {
  return (
    <Tab.Navigator
      initialRouteName="profile"
      initialLayout={{ width: screenWidth, height: screenHeight }}
      tabBar={(props: MaterialTopTabBarProps) => (
        <TabBar {...props} scrollable />
      )}
      screenOptions={{
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen
        name="profile"
        component={CoachProfile}
        options={{
          title: "프로필",
        }}
      />
      <Tab.Screen
        name="customers"
        component={Placeholder}
        options={{
          title: "고객관리",
        }}
      />
      <Tab.Screen
        name="reviews"
        component={Placeholder}
        options={{
          title: "리뷰관리",
        }}
      />
    </Tab.Navigator>
  );
}
