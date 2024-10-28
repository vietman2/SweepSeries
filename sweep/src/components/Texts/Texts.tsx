import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  title: string;
  subtitle?: string;
}

export function InputTitle({ title, subtitle }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

export function Callout({ title }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.calloutContainer}>
      <Text style={styles.calloutText}>{title}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 14,
      color: "#666666",
    },
    calloutContainer: {
      paddingVertical: 4,
      paddingHorizontal: 16,
      backgroundColor: theme.border,
      borderRadius: 16,
    },
    calloutText: {
      color: theme.lowEmphasis,
    },
  });
