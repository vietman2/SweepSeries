import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { CalendarHeaderProps } from "react-native-calendars/src/calendar/header";
import styled from "styled-components/native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function LessonDateSelector({
  selectedDate,
  setSelectedDate,
}: Readonly<Props>) {
  const { theme } = useTheme();

  const dayComponent = ({ date }: { date: DateData }) => {
    const isSelectedDate = useMemo(
      () => date.dateString === selectedDate,
      [date, selectedDate]
    );

    return (
      <Day
        onPress={() => setSelectedDate(date.dateString)}
        testID={`day-${date.dateString}`}
        style={
          isSelectedDate && {
            backgroundColor: theme.primary,
          }
        }
      >
        <Text style={isSelectedDate && { color: theme.background }}>
          {date.day}
        </Text>
      </Day>
    );
  };

  return (
    <Calendar
      initialDate={selectedDate}
      customHeader={CustomHeaderModal}
      dayComponent={dayComponent}
      hideExtraDays
    />
  );
}

function CustomHeaderModal(props: CalendarHeaderProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleAddMonth = () => {
    props.addMonth?.(1);
  };

  const handleSubtractMonth = () => {
    props.addMonth?.(-1);
  };

  const formatMonth = () => {
    return `${props.month.getMonth() + 1}월`;
  };

  return (
    <View>
      <View style={styles.wide}>
        <TouchableOpacity
          onPress={handleSubtractMonth}
          style={styles.arrow}
          testID="decrement"
        >
          <AppIcon icon="chevron-left" size={16} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.text}>{formatMonth()}</Text>
        <TouchableOpacity
          onPress={handleAddMonth}
          style={styles.arrow}
          testID="increment"
        >
          <AppIcon icon="chevron-right" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.days}>
        <Text style={styles.greenDay}>일</Text>
        <Text style={styles.greenDay}>월</Text>
        <Text style={styles.greenDay}>화</Text>
        <Text style={styles.greenDay}>수</Text>
        <Text style={styles.greenDay}>목</Text>
        <Text style={styles.greenDay}>금</Text>
        <Text style={styles.greenDay}>토</Text>
      </View>
    </View>
  );
}

const Day = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 4px 0;
  border-radius: 12px;
`;

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    wide: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 36,
    },
    days: {
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    arrow: {
      paddingHorizontal: 16,
    },
    greenDay: {
      flex: 1,
      paddingVertical: 8,
      textAlign: "center",
      fontSize: 16,
      color: theme.primary,
    },
  });
