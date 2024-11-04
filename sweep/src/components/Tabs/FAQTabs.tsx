import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function FAQTabs({
  tabs,
  selectedTab,
  setSelectedTab,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const width = (Dimensions.get("window").width - 90) / 3;

  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelectedTab(tab)}
          style={[
            styles.tab,
            { width },
            tab === selectedTab && { backgroundColor: theme.primary },
          ]}
          activeOpacity={0.1}
        >
          <Text
            style={[styles.text, tab === selectedTab && styles.selectedText]}
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
    tabs: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginVertical: 8,
      backgroundColor: theme.background,
    },
    tab: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 4,
      marginHorizontal: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    text: {
      fontSize: 18,
    },
    selectedText: {
      fontSize: 18,
      color: theme.background,
    },
  });
