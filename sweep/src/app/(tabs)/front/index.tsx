import { Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { TabBar } from "@components/Tabs";
import {
  CustomerManagement,
  EmployeeManagement,
  NoticeManagement,
  ProfileManagement,
  ProgramManagement,
  ReviewManagement,
} from "@pages/front";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Front() {
  return (
    <Tab.Navigator
      initialRouteName="profile"
      initialLayout={{ width: screenWidth, height: screenHeight }}
      tabBar={(props) => <TabBar {...props} scrollable />}
      screenOptions={{
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen
        name="profile"
        component={ProfileManagement}
        options={{
          title: "프로필",
        }}
      />
      <Tab.Screen
        name="programs"
        component={ProgramManagement}
        options={{ title: "프로그램" }}
      />
      <Tab.Screen
        name="customers"
        component={CustomerManagement}
        options={{ title: "고객관리" }}
      />
      <Tab.Screen
        name="reviews"
        component={ReviewManagement}
        options={{ title: "리뷰관리" }}
      />
      <Tab.Screen
        name="employees"
        component={EmployeeManagement}
        options={{ title: "직원관리" }}
      />
      <Tab.Screen
        name="notices"
        component={NoticeManagement}
        options={{ title: "소식관리" }}
      />
    </Tab.Navigator>
  );
}
