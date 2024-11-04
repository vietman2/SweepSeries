import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { WorkingHoursType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  workingHours: WorkingHoursType[];
}

export function WorkingHours({ workingHours }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {workingHours.map((workingHour) => (
        <View key={workingHour.label} style={styles.row}>
          <Text style={styles.workingHoursTitle}>{workingHour.label}</Text>
          <Text style={styles.workingHours}>{workingHour.hours}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 4,
    },
    row: {
      flexDirection: "row",
    },
    workingHoursTitle: {
      flex: 2,
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    workingHours: {
      flex: 7,
      fontSize: 14,
      color: theme.lowEmphasis,
    },
  });
