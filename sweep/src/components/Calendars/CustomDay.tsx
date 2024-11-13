import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { DateData } from "react-native-calendars";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ScheduleSimpleType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  date: DateData;
  schedules?: ScheduleSimpleType[];
}

const { width, height } = Dimensions.get("window");

export function CustomDay({ date, schedules }: Readonly<Props>) {
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
      {schedules && (
        <View style={styles.chipWrapper}>
          {schedules.map((schedule) => (
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: schedule.color,
                },
              ]}
              key={schedule.short_text}
            >
              <Text
                style={styles.chipText}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {schedule.short_text}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      width: width / 7,
      height: height * 0.12,
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
    chipWrapper: {
      width: "85%",
    },
    chip: {
      marginTop: 4,
      paddingHorizontal: 2,
      paddingVertical: 1,
      borderRadius: 2,
      backgroundColor: theme.primary,
    },
    chipText: {
      fontSize: 12,
      color: theme.background,
    },
  });
