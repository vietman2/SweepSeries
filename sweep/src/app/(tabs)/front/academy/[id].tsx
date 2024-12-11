import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { CustomLogo } from "@components/Icons";
import { TabBar } from "@components/Tabs";
import { useTheme } from "@contexts/theme";
import { AcademyDetailType } from "@models/products";
import {
  CustomerManagement,
  EmployeeManagement,
  NoticeManagement,
  ProfileManagement,
  ProgramManagement,
  ReviewManagement,
} from "@pages/front";
import { getAcademyDetail } from "@services/products";
import { ThemeColorType } from "@themes/colors";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AcademyFront() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [academy, setAcademy] = useState<AcademyDetailType>();
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyDetail(id);

      if (response) {
        setAcademy(response);
      }
    };

    fetchData();
  }, [refreshCount]);

  if (!academy) return null;

  const Profile = () => (
    <ProfileManagement academy={academy} onRefresh={handleRefresh} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrapper}>
        <CustomLogo image={academy.logo} text={academy.name} color="black" />
      </View>
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
          component={Profile}
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
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    logoWrapper: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  });
