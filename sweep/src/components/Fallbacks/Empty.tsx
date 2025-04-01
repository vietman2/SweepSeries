import { StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  message: string;
  type?: 1 | 2;
  color?: string;
}

export function Empty({
  message,
  type = 1,
  color = "#14863E",
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (type === 1) {
    return (
      <View style={styles.empty}>
        <AppIcon icon="warning-circle" size={48} color={color} />
        <Text style={styles.warningText}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      gap: 8,
    },
    warningText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.lowEmphasis,
      lineHeight: 32,
    },
    wrapper: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 100,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
  });
