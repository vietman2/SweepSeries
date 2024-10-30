import { StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  message: string;
  color?: string;
}

export function Empty({ message, color = "#14863E" }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.empty}>
      <AppIcon icon="warning-circle" size={48} color={color} />
      <Text style={styles.warningText}>{message}</Text>
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
  });
