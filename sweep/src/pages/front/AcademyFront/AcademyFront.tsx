import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { ProfileManagement } from "./Profile/Profile";
import { ProgramManagement } from "./Programs/Programs";
import { CustomerManagement } from "./Customers/Customers";
import { ReviewManagement } from "./Reviews/Reviews";
import { EmployeeManagement } from "./Employees/Employees";
import { NoticeManagement } from "./Notices/Notices";
import { TabBar } from "@components/Tabs";
import { AcademyDetailType } from "@models/products";
import { getAcademyDetail } from "@services/products";

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Props {
  uuid: string;
}

export function AcademyFront({ uuid }: Readonly<Props>) {
  const [academy, setAcademy] = useState<AcademyDetailType>();
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademyDetail(uuid);

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

  const Employees = () => (
    <EmployeeManagement uuid={uuid} />
  );

  const Notices = () => <NoticeManagement uuid={uuid} />;

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
        component={Employees}
        options={{ title: "직원관리" }}
      />
      <Tab.Screen
        name="notices"
        component={Notices}
        options={{ title: "소식관리" }}
      />
    </Tab.Navigator>
  );
}
