import { Dimensions } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";

import { ProfileManagement } from "./ProfileManagement/ProfileManagement";
import { ProgramManagement } from "./ProgramManagement/ProgramManagement";
import { CustomerManagement } from "./CustomerManagement/CustomerManagement";
import { ReviewManagement } from "./ReviewManagement/ReviewManagement";
import { EmployeeManagement } from "./EmployeeManagement/EmployeeManagement";
import { NoticeManagement } from "./NoticeManagement/NoticeManagement";
import { TabBar } from "@components/Tabs";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import { LoadingComponent } from "@components/Fallbacks";
import { useFront } from "@contexts/front";

export function FrontTopTabs() {
  const { mode } = useFront();

  if (mode === null) return <LoadingComponent />;

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
        component={ProfileManagement}
        options={{
          title: "프로필",
        }}
      />
      {mode === "academy" && (
        <Tab.Screen
          name="programs"
          component={ProgramManagement}
          options={{ title: "프로그램" }}
        />
      )}
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
      {mode === "academy" && (
        <Tab.Screen
          name="employees"
          component={EmployeeManagement}
          options={{ title: "직원관리" }}
        />
      )}
      {mode === "academy" && (
        <Tab.Screen
          name="notices"
          component={NoticeManagement}
          options={{ title: "소식관리" }}
        />
      )}
    </Tab.Navigator>
  );
}
