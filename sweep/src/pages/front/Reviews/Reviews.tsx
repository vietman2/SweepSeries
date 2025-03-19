import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider, VerticalDivider } from "@components/Dividers";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ReviewsHeader, ReviewSimple } from "@fragments/Review";
import { ReviewType } from "@models/products";
import { sampleReviews } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function ReviewManagement() {
  const [selectedTab, setSelectedTab] = useState<"전체" | "미답변">("전체");
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (selectedTab === "전체") {
      setReviews(sampleReviews);
    } else {
      setReviews([]);
    }
  }, [selectedTab]);

  return (
    <Scroll style={styles.container}>
      <View style={styles.wrapper}>
        <ReviewsHeader rating={4.82} />
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
