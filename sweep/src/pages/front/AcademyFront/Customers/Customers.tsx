import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Scroll } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function CustomerManagement() {
  const [query, setQuery] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Scroll style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.horizontal}>
            <Text style={styles.title}>수강생 목록</Text>
            <Text style={styles.subtitle}>인원 (121)</Text>
          </View>
        </View>
        <View style={styles.searchWrapper}>
          <Searchbar
            placeholder="이름으로 검색하세요"
            value={query}
            onChange={setQuery}
            onSubmit={() => {}}
          />
        </View>
      </View>
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 8,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    subtitle: {
      fontSize: 16,
      color: theme.lowEmphasis,
    },
    searchWrapper: {
      flexDirection: "row",
    },
  });
