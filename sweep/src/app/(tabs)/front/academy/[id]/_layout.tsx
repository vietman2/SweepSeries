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

import { AcademyFrontProvider, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

type RelativePathType =
  | "profile"
  | "programs"
  | "customers"
  | "reviews"
  | "employees"
  | "notices";

export default function AcademyFrontLayout() {
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
      router.replace(`/front/academy/${activeProfile.uuid}/${relativePath}`);
    } else {
    }
  };

  return (
    <AcademyFrontProvider>
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
      >
        <MaterialTopTabs.Screen
          name="profile"
          options={{ title: "프로필" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "profile"),
          }}
        />
        <MaterialTopTabs.Screen
          name="programs"
          options={{ title: "프로그램" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "programs"),
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
        <MaterialTopTabs.Screen
          name="employees"
          options={{ title: "직원관리" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "employees"),
          }}
        />
        <MaterialTopTabs.Screen
          name="notices"
          options={{ title: "소식관리" }}
          listeners={{
            tabPress: (e) => handleTabPress(e, "notices"),
          }}
        />
      </MaterialTopTabs>
    </AcademyFrontProvider>
  );
}
