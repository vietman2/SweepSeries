import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider, VerticalDivider } from "@components/Dividers";
import { ErrorPage } from "@components/Fallbacks";
import { ScrollView } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAcademyFront, useCoachFront, useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { ReviewsSummary, ReviewSimple } from "@fragments/Review";
import { ReviewResponseType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyReviewManagement() {
  const { activeProfile } = useFront();
  const { reviews, loading, refresh } = useAcademyFront();

  if (activeProfile.mode !== "academy") return null;

  if (!reviews) return <ErrorPage />;

  return <Content reviewsData={reviews} loading={loading} refresh={refresh} />;
}

export function CoachReviewManagement() {
  const { activeProfile } = useFront();
  const { reviews, loading, refresh } = useCoachFront();

  if (activeProfile.mode !== "coach") return null;

  if (!reviews) return <ErrorPage />;

  return <Content reviewsData={reviews} loading={loading} refresh={refresh} />;
}

interface Props {
  reviewsData: ReviewResponseType;
  loading: boolean;
  refresh: () => void;
}

function Content({ reviewsData, loading, refresh }: Readonly<Props>) {
  const [selectedTab, setSelectedTab] = useState<"전체" | "미답변">("전체");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      refreshing={loading}
      onRefresh={refresh}
      style={styles.container}
    >
      <View style={styles.wrapper}>
        <ReviewsSummary summary={reviewsData.summary} />
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
              전체 ({reviewsData.summary.summary.total})
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
        {reviewsData.results.map((review) => (
          <View key={review.id}>
            <ReviewSimple review={review} />
            <Divider />
          </View>
        ))}
      </View>
    </ScrollView>
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
