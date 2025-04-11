import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Empty } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { ReviewsSummary, ReviewSimple } from "@fragments/Review";
import { ThemeColorType } from "@themes/colors";

export function AcademyReviews() {
  const { reviews } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!reviews) {
    return null;
  }

  const handleMore = async () => {
    // TODO: Implement pagination
  };

  return (
    <View style={styles.container}>
      <ReviewsSummary summary={reviews.summary} />
      <Divider />
      {/*TODO: Filter and Sort */}
      {reviews.results.length > 0 ? (
        <>
          {reviews.results.map((review) => (
            <View key={review.id}>
              <ReviewSimple review={review} />
              <Divider />
            </View>
          ))}
        </>
      ) : (
        <Empty message="등록된 리뷰가 없습니다." type={2} />
      )}
      {reviews.next && (
        <TouchableOpacity
          onPress={handleMore}
          style={styles.moreButton}
          testID="load-more"
        >
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
