import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AvailableTimesType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  options: AvailableTimesType[] | null;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export function TimeSelector({
  options,
  selectedTime,
  setSelectedTime,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.availableTimes}>
      {options === null ? (
        <Text style={styles.closedText}>아카데미 휴무일입니다.</Text>
      ) : (
        <>
          {options.map((time) => (
            <View key={time.time}>
              {time.is_available ? (
                <TouchableOpacity
                  style={[
                    styles.timeChip,
                    selectedTime === time.time && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setSelectedTime(time.time)}
                  testID={`time-${time.time}`}
                >
                  <Text
                    style={
                      selectedTime === time.time && {
                        color: theme.background,
                      }
                    }
                  >
                    {time.time}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.disabledChip}>
                  <Text style={styles.disabledText}>{time.time}</Text>
                </View>
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    availableTimes: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      alignSelf: "center",
      padding: 16,
      rowGap: 8,
      columnGap: 16,
    },
    timeChip: {
      alignItems: "center",
      justifyContent: "center",
      width: 72,
      height: 28,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    closedText: {
      paddingVertical: 36,
      fontSize: 14,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    disabledChip: {
      alignItems: "center",
      justifyContent: "center",
      width: 72,
      height: 28,
      borderRadius: 4,
      backgroundColor: theme.border,
    },
    disabledText: {
      color: theme.lowEmphasis,
    },
  });
