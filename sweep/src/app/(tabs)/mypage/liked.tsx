import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions } from "react-native";

import { TabBar } from "@components/Tabs";
import { LikedAcademies, LikedCoaches } from "@pages/mypage";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function Dummy() {
  return <></>;
}

export default function RecentlyViewed() {
  return (
    <Tab.Navigator
      initialRouteName="academies"
      initialLayout={{ width: screenWidth, height: screenHeight }}
      tabBar={(props) => <TabBar {...props} />}
      backBehavior="none"
    >
      <Tab.Screen
        name="academies"
        component={LikedAcademies}
        options={{ title: "아카데미" }}
      />
      <Tab.Screen
        name="coaches"
        component={LikedCoaches}
        options={{ title: "코치" }}
      />
      <Tab.Screen
        name="community"
        component={Dummy}
        options={{ title: "커뮤니티" }}
      />
    </Tab.Navigator>
  );
}
