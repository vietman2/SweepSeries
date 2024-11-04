import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { TabName } from "react-native-collapsible-tab-view/lib/typescript/src/types";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function CollapsibleTab(props: TabBarProps<TabName>) {
  const [selectedTab, setSelectedTab] = useState<TabName>(
    props.focusedTab.value
  );

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleTabPress = (tab: TabName) => {
    setSelectedTab(tab);
    props.onTabPress(tab);
  };

  return (
    <View style={styles.tabContainer}>
      {props.tabNames.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.selectedTab]}
          onPress={() => handleTabPress(tab)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab && styles.selectedTabText,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    tabContainer: {
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
      fontSize: 20,
      fontWeight: "bold",
    },
    selectedTabText: {
      color: theme.primary,
    },
  });
