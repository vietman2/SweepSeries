import { router, usePathname, withLayoutContext } from "expo-router";
import {
  EventArg,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";

import { CoachFrontProvider, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

type RelativePathType = "profile" | "customers" | "reviews";

export default function CoachFrontLayout() {
  const { activeProfile } = useFront();
  const pathname = usePathname();
  const { theme } = useTheme();

  const handleTabPress = (
    e: EventArg<"tabPress", true, undefined>,
    relativePath: RelativePathType
  ) => {
    e.preventDefault();

    if (pathname.includes(relativePath) && !pathname.endsWith(relativePath)) {
      router.back();
    } else if (!pathname.endsWith(relativePath)) {
      router.replace(`/front/coach/${activeProfile.uuid}/${relativePath}`);
    } else {
    }
  };

  return (
    <CoachFrontProvider>
      <MaterialTopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.background,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.lowEmphasis,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
            paddingHorizontal: 0,
            width: 80,
          },
          tabBarLabelStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.primary,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.lowEmphasis,
          tabBarScrollEnabled: true,
          swipeEnabled: false,
        }}
        initialRouteName="profile"
      >
        <MaterialTopTabs.Screen
          name="profile"
          options={{ title: "프로필" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "profile"),
          }}
        />
        <MaterialTopTabs.Screen
          name="customers"
          options={{ title: "고객관리" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "customers"),
          }}
        />
        <MaterialTopTabs.Screen
          name="reviews"
          options={{ title: "리뷰관리" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "reviews"),
          }}
        />
      </MaterialTopTabs>
    </CoachFrontProvider>
  );
}
