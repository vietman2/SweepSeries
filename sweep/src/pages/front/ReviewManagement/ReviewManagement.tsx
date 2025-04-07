import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider, VerticalDivider } from "@components/Dividers";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ReviewsSummary, ReviewSimple } from "@fragments/Review";
import {
  ReviewType,
  ReviewResponseType,
  ReviewSummaryType,
} from "@models/products";
import { getAcademyReviews, getAcademyReviewSummary } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function ReviewManagement() {
  const [selectedTab, setSelectedTab] = useState<"전체" | "미답변">("전체");

  const [result, setResult] = useState<ReviewResponseType>();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [summary, setSummary] = useState<ReviewSummaryType>();

  const { uuid } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getAcademyReviewSummary(uuid);
      const response2 = await getAcademyReviews(uuid);

      if (response1 && response2) {
        setSummary(response1);
        setReviews(response2.results);
        setResult(response2);
      }
    };

    fetchData();
  }, [selectedTab]);

  if (!summary || !result || !reviews) {
    return null;
  }

  return (
    <Scroll style={styles.container}>
      <View style={styles.wrapper}>
        <ReviewsSummary summary={summary} />
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setSelectedTab("전체")}
            testID="tab-all"
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "전체" && { color: theme.primary },
              ]}
            >
              전체 (1)
            </Text>
          </TouchableOpacity>
          <VerticalDivider width={1} />
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setSelectedTab("미답변")}
            testID="tab-unanswered"
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "미답변" && { color: theme.primary },
              ]}
            >
              미답변 (0)
            </Text>
          </TouchableOpacity>
        </View>
        <Divider />
        {reviews.map((review) => (
          <View key={review.id}>
            <ReviewSimple review={review} />
            <Divider />
          </View>
        ))}
      </View>
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 16,
    },
    tabs: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: -4,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 4,
    },
    tabText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
  });
