import { StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface CalloutProps {
  text: string;
  color?: string;
  align?: "flex-start" | "center";
}

export function CalloutSmall({
  text,
  color,
  align = "flex-start",
}: Readonly<CalloutProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.calloutSmall, { alignItems: align }]}>
      <Text style={[styles.calloutText, color && { color }]}>{text}</Text>
    </View>
  );
}

export function CalloutLarge({ text }: Readonly<CalloutProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.calloutLarge}>
      <View style={styles.icon}>
        <AppIcon icon="quote" size={16} color="#8F8F8F" />
      </View>
      <Text style={styles.calloutText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    calloutSmall: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundGray,
      borderRadius: 8,
    },
    calloutText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
    calloutLarge: {
      marginHorizontal: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.backgroundGray,
      shadowColor: "black",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.24,
      shadowRadius: 1,
      elevation: 1,
    },
    icon: {
      position: "absolute",
      top: -8,
      left: 8,
    },
  });
