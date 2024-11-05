import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  rating: number;
}

export function ReviewsHeader({ rating }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <AppIcon icon="star" size={50} color="#F2B517" />
        <Text style={styles.rating}>
          {rating.toFixed(2)}
          <Text style={styles.secondaryText}> / 5</Text>
        </Text>
      </View>
      <View style={styles.details}>
        <ProgressBar rating={5} number={25} total={35} />
        <ProgressBar rating={4} number={7} total={35} />
        <ProgressBar rating={3} number={2} total={35} />
        <ProgressBar rating={2} number={1} total={35} />
        <ProgressBar rating={1} number={0} total={35} />
      </View>
    </View>
  );
}

interface BarProps {
  rating: number;
  number: number;
  total: number;
}

function ProgressBar({ rating, number, total }: BarProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const progress = (number / total) * 100;

  console.log(progress)

  return (
    <View style={styles.progressbar}>
      <Text style={styles.barText}>{rating}점</Text>
      <View style={styles.bar}>
        {progress > 0 ? (
          <View style={[styles.progress, { width: `${progress}%` }]}>
            {progress > 10 ? (
              <AppIcon icon="star" color="white" size={7.5} />
            ) : null}
          </View>
        ) : null}
      </View>
      <Text style={styles.count}>{number}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
      backgroundColor: "#fff",
    },
    summary: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    rating: {
      fontSize: 35,
      fontWeight: "bold",
    },
    secondaryText: {
      fontSize: 20,
      color: theme.lowEmphasis,
    },
    details: {
      flex: 1,
      gap: 8,
    },
    progressbar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderRadius: 4,
    },
    bar: {
      flex: 5,
      height: 8,
      backgroundColor: theme.backgroundGray,
      borderRadius: 4,
    },
    progress: {
      height: 8,
      alignItems: "flex-end",
      justifyContent: "center",
      backgroundColor: theme.primary,
      paddingRight: 2,
      borderRadius: 4,
    },
    barText: {
      flex: 1,
      color: theme.highEmphasis,
    },
    count: {
      flex: 1,
      color: theme.lowEmphasis,
      textAlign: "right",
    },
  });
