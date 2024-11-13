import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function CalendarSearch() {
  const [query, setQuery] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/calendar");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.wrapper} testID="back">
          <AppIcon icon="chevron-left" size={18} color={theme.highEmphasis} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="일정, 할 일, 메모 검색"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.wrapper}>
          <AppIcon icon="search" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 40,
      height: 120,
    },
    wrapper: {
      padding: 16,
    },
    inputWrapper: {
      flex: 1,
    },
  });
