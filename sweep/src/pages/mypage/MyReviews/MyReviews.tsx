import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function MyReviews() {
  //const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [num_reviews, setNumReviews] = useState<number>(0);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    //setReviews([]);
    setNumReviews(0);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내가 쓴 리뷰 총 {num_reviews}개</Text>
        <Text style={styles.subtitle}>미작성한 리뷰가 {0}개 있어요!</Text>
      </View>
      <Divider />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: 24,
      color: theme.lowEmphasis,
    },
  });
