import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CalendarType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  calendar: CalendarType;
}

export function CalendarOptions({ calendar }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>{calendar.title}</Text>
        <AppIcon icon="chevron-right" size={14} color={theme.lowEmphasis} />
      </View>
      <Divider />
      <View style={styles.row}>
        <Text style={styles.text}>캘린더 색상</Text>
        <View style={styles.horizontal}>
          <View style={[styles.fill, { backgroundColor: calendar.color }]} />
          <AppIcon icon="chevron-right" size={14} color={theme.lowEmphasis} />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.highEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    fill: {
      width: 30,
      height: 20,
      borderRadius: 8,
    },
  });
