import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  done: number;
  total: number;
}

export function Progressbar({ done, total }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getPercent = () => {
    if (total === 0) return 0;

    return Math.floor((done / total) * 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <LinearGradient
          colors={["#00BF60", "#00592D"]}
          start={[0, 0]}
          end={[1, 1]}
          style={[styles.fill, { width: `${getPercent()}%` }]}
        />
      </View>
      <Text style={styles.text}>
        {done}/{total} ({getPercent()}%)
      </Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    bar: {
      width: "75%",
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.border,
    },
    fill: {
      height: 10,
      borderRadius: 5,
    },
    text: {
      marginLeft: 8,
      color: theme.primary,
    },
  });
