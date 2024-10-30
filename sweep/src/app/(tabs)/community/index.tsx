import { Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { TabBar } from "@components/Tabs";
import { Dugout, Draft, Market } from "@pages/community";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CommunityList() {
  return (
    <Tab.Navigator
      initialRouteName="dugout"
      initialLayout={{ width: screenWidth, height: screenHeight }}
      tabBar={(props) => <TabBar {...props} />}
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
