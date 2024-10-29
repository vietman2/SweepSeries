import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.container}>
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

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
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
  });
