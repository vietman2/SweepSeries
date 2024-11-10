import { StyleSheet, View } from "react-native";
import Svg, { Line } from "react-native-svg";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function DatetimeHeader() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.text}>일정 시작</Text>
        <Text style={styles.text}>시간</Text>
      </View>
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
      <View style={styles.right}>
        <Text style={styles.text}>일정 종료</Text>
        <Text style={styles.text}>시간</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
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
      gap: 8,
    },
    right: {
      flex: 1,
      alignItems: "flex-end",
      gap: 8,
    },
    text: {
      fontSize: 16,
    },
  });
