import { forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarHeaderProps } from "react-native-calendars/src/calendar/header";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export function CalendarHeader({
  selectedMonth,
  setSelectedMonth,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatMonth = () => {
    const [year, monthNum] = selectedMonth.split("-");
    return `${year}년 ${monthNum}월`;
  };

  const handleAddMonth = (value: number) => {
    const [year, monthNum] = selectedMonth.split("-");
    const newMonth = parseInt(monthNum) + value;
    if (newMonth === 0) {
      setSelectedMonth(`${parseInt(year) - 1}-12`);
    } else if (newMonth === 13) {
      setSelectedMonth(`${parseInt(year) + 1}-01`);
    } else {
      setSelectedMonth(`${year}-${newMonth < 10 ? `0${newMonth}` : newMonth}`);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => handleAddMonth(-1)}
        style={styles.arrow}
        testID="decrement"
      >
        <AppIcon icon="chevron-left" size={24} color={theme.lowEmphasis} />
      </TouchableOpacity>
      <Text style={styles.text}>{formatMonth()}</Text>
      <TouchableOpacity
        onPress={() => handleAddMonth(1)}
        style={styles.arrow}
        testID="increment"
      >
        <AppIcon icon="chevron-right" size={24} color={theme.lowEmphasis} />
      </TouchableOpacity>
    </View>
  );
}

export const CustomHeader = forwardRef((props: CalendarHeaderProps, ref) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleAddMonth = () => {
    props.addMonth?.(1);
  };

  const handleSubtractMonth = () => {
    props.addMonth?.(-1);
  };

  const formatMonth = () => {
    return `${props.month.getFullYear()}년 ${props.month.getMonth()+1}월`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSubtractMonth}
          style={styles.arrow}
          testID="decrement"
        >
          <AppIcon icon="chevron-left" size={16} color={theme.lowEmphasis} />
        </TouchableOpacity>
        <Text style={styles.text}>{formatMonth()}</Text>
        <TouchableOpacity
          onPress={handleAddMonth}
          style={styles.arrow}
          testID="increment"
        >
          <AppIcon icon="chevron-right" size={16} color={theme.lowEmphasis} />
        </TouchableOpacity>
      </View>
      <View style={styles.days}>
        <Text style={styles.dayText}>일</Text>
        <Text style={styles.dayText}>월</Text>
        <Text style={styles.dayText}>화</Text>
        <Text style={styles.dayText}>수</Text>
        <Text style={styles.dayText}>목</Text>
        <Text style={styles.dayText}>금</Text>
        <Text style={styles.dayText}>토</Text>
      </View>
    </View>
  );
});

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      gap: 48,
    },
    text: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    arrow: {
      paddingHorizontal: 16,
    },
    days: {
      flexDirection: "row",
      alignItems: "center",
    },
    dayText: {
      flex: 1,
      paddingVertical: 8,
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
  });
