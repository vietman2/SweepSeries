import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { ReviewsSummary, ReviewSimple } from "@fragments/Review";
import {
  AcademyReviewSummaryType,
  ReviewResponseType,
  AcademyReviewType,
} from "@models/products";
import { getAcademyReviews, getAcademyReviewSummary } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyReviews() {
  const [result, setResult] = useState<ReviewResponseType>();
  const [reviews, setReviews] = useState<AcademyReviewType[]>([]);
  const [summary, setSummary] = useState<AcademyReviewSummaryType>();

  const { academy } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      if (!academy) return;

      const response1 = await getAcademyReviewSummary(academy.uuid);
      const response2 = await getAcademyReviews(academy.uuid);

      if (response1 && response2) {
        setSummary(response1);
        setReviews(response2.results);
        setResult(response2);
      }
    };

    fetchData();
  }, []);

  if (!academy || !summary || !result) return null;

  const handleMore = async () => {
    // TODO: Implement pagination
  };

  return (
    <View style={styles.container}>
      <ReviewsSummary summary={summary} />
      <Divider />
      {/*TODO: Filter and Sort */}
      {reviews.map((review) => (
        <View key={review.id}>
          <ReviewSimple review={review} />
          <Divider />
        </View>
      ))}
      {result.next && (
        <TouchableOpacity onPress={handleMore} style={styles.moreButton} testID="load-more">
          <AppIcon icon="plus" size={16} color={theme.primary} />
          <Text style={styles.buttonText}>더보기</Text>
        </TouchableOpacity>
      )}
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
    moreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      backgroundColor: theme.background,
    },
    buttonText: {
      color: theme.primary,
      fontSize: 14,
      marginLeft: 8,
    },
  });
