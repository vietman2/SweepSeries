import { Dimensions, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { TabBar } from "@components/Tabs";

function Placeholder() {
  return <View />;
}

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Front() {
  return (
    <Tab.Navigator
      initialRouteName="profile"
      initialLayout={{ width: screenWidth, height: screenHeight }}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen
        name="profile"
        component={Placeholder}
        options={{
          title: "프로필",
        }}
      />
      <Tab.Screen
        name="programs"
        component={Placeholder}
        options={{ title: "프로그램" }}
      />
      <Tab.Screen
        name="customers"
        component={Placeholder}
        options={{ title: "고객관리" }}
      />
      <Tab.Screen
        name="reviews"
        component={Placeholder}
        options={{ title: "리뷰관리" }}
      />
      <Tab.Screen
        name="employees"
        component={Placeholder}
        options={{ title: "직원관리" }}
      />
    </Tab.Navigator>
  );
}
