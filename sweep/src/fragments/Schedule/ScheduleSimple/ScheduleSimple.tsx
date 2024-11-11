import { StyleSheet, View } from "react-native";

import { VerticalDivider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ScheduleSimpleType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  schedule: ScheduleSimpleType;
}

export function ScheduleSimple({ schedule }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{schedule.time}</Text>
      <View style={styles.horizontal}>
        <View style={[styles.chip, { backgroundColor: schedule.color }]}>
          <Text style={styles.chipText}>{schedule.type}</Text>
        </View>
        <VerticalDivider color={schedule.color} width={2} />
        <View style={styles.content}>
          <Text style={styles.title}>{schedule.name}</Text>
          {schedule.type === "레슨" && (
            <Text style={styles.detail}>{schedule.detail}</Text>
          )}
        </View>
      </View>
      {schedule.note && <Text style={styles.notes}>{schedule.note}</Text>}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 8,
    },
    time: {
      fontSize: 12,
      color: theme.lowEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    chip: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
    },
    chipText: {
      fontWeight: "bold",
      color: theme.background,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    content: {
      gap: 4,
    },
    detail: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    notes: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
  });
