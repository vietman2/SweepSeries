import { StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
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

interface CalloutProps {
  text: string;
}

export function CalloutSmall({ text }: Readonly<CalloutProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.calloutSmall}>
      <Text style={styles.calloutText}>{text}</Text>
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
    calloutSmall: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: theme.backgroundGray,
      borderRadius: 8,
    },
    calloutText: {
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
