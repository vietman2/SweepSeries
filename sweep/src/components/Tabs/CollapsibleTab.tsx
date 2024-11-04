import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  tabs: string[];
  selectedIdx: number;
  setSelectedTab: (idx: number) => void;
}

export function CollapsibleTab({ tabs, selectedIdx, setSelectedTab }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedIdx === index && styles.selectedTab]}
          onPress={() => setSelectedTab(index)}
        >
          <Text
            style={[
              styles.tabText,
              selectedIdx === index && styles.selectedTabText,
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
