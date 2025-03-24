import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { useTheme } from "@contexts/theme";
import { ReviewsHeader, ReviewSimple } from "@fragments/Review";
import { ReviewType } from "@models/products";
import { sampleReviews } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyReviews() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setReviews(sampleReviews);
  }, []);

  return (
    <View style={styles.container}>
      <ReviewsHeader rating={4.5} />
      <Divider />
      {/*TODO: Filter and Sort */}
      {reviews.map((review) => (
        <View key={review.id}>
          <ReviewSimple review={review} />
          <Divider />
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 16,
      backgroundColor: theme.background,
    },
  });
