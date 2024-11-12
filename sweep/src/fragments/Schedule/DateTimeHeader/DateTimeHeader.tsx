import { StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Line } from "react-native-svg";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  selectedStartDateTime: Date;
  selectedEndDateTime: Date;
  mode: "start" | "end";
  handleStartMode: () => void;
  handleEndMode: () => void;
  isAllDay: boolean;
}

export function DateTimeHeader({
  selectedStartDateTime,
  selectedEndDateTime,
  mode,
  handleStartMode,
  handleEndMode,
  isAllDay,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.left, isAllDay && { paddingVertical: 8 }]}
        onPress={handleStartMode}
      >
        <Text
          style={[
            styles.headerText,
            mode === "start" && { color: theme.highEmphasis },
          ]}
        >
          {selectedStartDateTime.toLocaleDateString("ko-KR", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
        {isAllDay ? null : (
          <Text
            style={[
              styles.headerText,
              mode === "start" && { color: theme.highEmphasis },
            ]}
          >
            {selectedStartDateTime.toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
        )}
      </TouchableOpacity>
      <Svg height="100%" width="20%">
        <Line
          x1="65%"
          y1="0"
          x2="35%"
          y2="100%"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="1"
        ></Line>
      </Svg>
      <TouchableOpacity
        style={[styles.right, isAllDay && { paddingVertical: 8 }]}
        onPress={handleEndMode}
      >
        <Text
          style={[
            styles.headerText,
            mode === "end" && { color: theme.highEmphasis },
          ]}
        >
          {selectedEndDateTime.toLocaleDateString("ko-KR", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
        {isAllDay ? null : (
          <Text
            style={[
              styles.headerText,
              mode === "end" && { color: theme.highEmphasis },
            ]}
          >
            {selectedEndDateTime.toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    left: {
      flex: 1,
      alignItems: "flex-start",
      gap: 4,
    },
    right: {
      flex: 1,
      alignItems: "flex-end",
      gap: 4,
    },
    headerText: {
      fontSize: 18,
      color: theme.lowEmphasis,
    },
  });
