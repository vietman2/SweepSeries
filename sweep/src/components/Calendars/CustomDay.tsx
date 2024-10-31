import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { DateData } from "react-native-calendars";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  date: DateData;
  schedule?: {
    text: string;
    type: number;
  };
}

const { width, height } = Dimensions.get("window");

export function CustomDay({ date, schedule }: Readonly<Props>) {
  const today = useMemo(() => new Date(), []);

  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isToday = useMemo(
    () =>
      today.getDate() === date.day &&
      today.getMonth() + 1 === date.month &&
      today.getFullYear() === date.year,
    [today, date]
  );

  return (
    <View style={[styles.container, isToday && styles.today]}>
      <Text
        style={
          (styles.text,
          { color: isToday ? theme.highEmphasis : theme.lowEmphasis })
        }
      >
        {date.day}
      </Text>
      {schedule && (
        <View
          style={[
            styles.chip,
            {
              backgroundColor:
                schedule.type === 1 ? theme.primary : theme.secondary,
            },
          ]}
        >
          <Text style={styles.chipText}>{schedule.text}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      width: width / 7,
      height: height * 0.1,
      alignItems: "center",
      paddingTop: 8,
      borderRadius: 8,
    },
    today: {
      backgroundColor: theme.backgroundGray,
    },
    text: {
      fontSize: 14,
      fontWeight: "bold",
    },
    chip: {
      marginTop: 4,
      padding: 4,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    chipText: {
      fontSize: 10,
      color: theme.background,
    },
  });
