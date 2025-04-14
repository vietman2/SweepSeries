import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Slot, router, usePathname } from "expo-router";

import { ScrollView } from "@components/ScrollView";
import { AcademyDetailProvider, useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { AcademyProfile } from "@fragments/Academy";
import { ThemeColorType } from "@themes/colors";

export function AcademyDetailLayout() {
  return (
    <AcademyDetailProvider>
      <AcademyDetail />
    </AcademyDetailProvider>
  );
}

type AcademyDetailTabType = {
  name: string;
  pathname:
    | "/home/academy/[id]/information"
    | "/home/academy/[id]/programs"
    | "/home/academy/[id]/coaches"
    | "/home/academy/[id]/notices"
    | "/home/academy/[id]/reviews";
  relativePath: string;
};

const tabs: AcademyDetailTabType[] = [
  {
    name: "소개",
    pathname: "/home/academy/[id]/information",
    relativePath: "information",
  },
  {
    name: "프로그램",
    pathname: "/home/academy/[id]/programs",
    relativePath: "programs",
  },
  {
    name: "코치",
    pathname: "/home/academy/[id]/coaches",
    relativePath: "coaches",
  },
  {
    name: "소식",
    pathname: "/home/academy/[id]/notices",
    relativePath: "notices",
  },
  {
    name: "리뷰",
    pathname: "/home/academy/[id]/reviews",
    relativePath: "reviews",
  },
];

function AcademyDetail() {
  const { academy, loading, refresh } = useAcademyDetail();
  const pathname = usePathname();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isTabActive = (tab: AcademyDetailTabType) => {
    return pathname.includes(tab.relativePath);
  };

  if (!academy) {
    return null;
  }

  const handleTabPress = (tab: AcademyDetailTabType) => {
    router.replace({
      pathname: tab.pathname,
      params: { id: academy?.uuid },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView onRefresh={refresh} refreshing={loading}>
        <AcademyProfile academy={academy} />
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tab, isTabActive(tab) && styles.selectedTab]}
              onPress={() => handleTabPress(tab)}
              testID={`tab-${tab.relativePath}`}
            >
              <Text
                style={[
                  styles.tabText,
                  isTabActive(tab) && styles.selectedTabText,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Slot />
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: theme.background,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.lowEmphasis,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
    },
    selectedTab: {
      borderBottomWidth: 3,
      borderBottomColor: theme.primary,
    },
    tabText: {
      color: theme.lowEmphasis,
      fontSize: 18,
      fontWeight: "bold",
    },
    selectedTabText: {
      color: theme.primary,
    },
  });
