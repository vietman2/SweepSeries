import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

import { BackButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import {
  CoachIntroduction,
  CoachProfileImage,
  CoachSNS,
} from "@fragments/Coach";
import { ReviewSimple, ReviewsSummary } from "@fragments/Review";
import { CoachDetailType, ReviewResponseType } from "@models/products";
import {
  getCoachDetails,
  getCoachReviews,
  likeCoach,
} from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function CoachDetail() {
  const [coach, setCoach] = useState<CoachDetailType>();
  const [reviews, setReviews] = useState<ReviewResponseType>();

  const [refreshCount, setRefreshCount] = useState<number>(0);
  const { coachid } = useLocalSearchParams<{ coachid: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleLikePress = async () => {
    const repsonse = await likeCoach(coach?.uuid);

    if (repsonse) {
      handleRefresh();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getCoachDetails(coachid);
      const response2 = await getCoachReviews(coachid);

      if (response1 && response2) {
        setCoach(response1);
        setReviews(response2);
      }
    };

    fetchData();
  }, [refreshCount]);

  if (!coach || !reviews) {
    return null;
  }

  return (
    <Scroll style={styles.container}>
      <BackButton onPress={() => router.back()} />
      <View style={styles.header}>
        <CoachProfileImage coach={coach} />
        <NameLikeShare>
          <Text style={styles.title}>
            {`${coach.name} `}
            <Text style={styles.sub}>코치</Text>
          </Text>
          <TouchableOpacity onPress={handleLikePress} testID="like-button">
            <AppIcon
              icon={coach.is_liked ? "heart" : "heart-outline"}
              size={20}
              color={theme.primary}
            />
          </TouchableOpacity>
        </NameLikeShare>
        <Horizontal>
          <AppIcon icon="person-check" size={20} color={theme.lowEmphasis} />
          <Text style={styles.professions}>
            {coach.professions.map((p) => p.kor_name).join(", ")}
          </Text>
        </Horizontal>
        <Horizontal>
          <AppIcon icon="star" size={20} color="#F2B517" />
          <Text style={styles.ratings}>
            {coach.rating.toFixed(2)} ({coach.num_reviews})
          </Text>
        </Horizontal>
      </View>
      <Divider />
      <CoachIntroduction introduction={coach.introduction} />
      <Divider />
      <CoachSNS instagram={coach.instagram} blog={coach.blog} />
      <Divider />
      <Reviews>
        <ReviewsSummary summary={reviews.summary} />
        <Divider />
        {reviews.results.map((review) => (
          <View key={review.id}>
            <ReviewSimple review={review} />
            <Divider />
          </View>
        ))}
      </Reviews>
    </Scroll>
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
    header: {
      paddingHorizontal: 8,
      gap: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    sub: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    professions: {
      fontSize: 14,
      color: theme.primary,
    },
    ratings: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
  });

const Reviews = styled.View`
  gap: 16px;
`;

const Horizontal = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const NameLikeShare = styled(Horizontal)`
  justify-content: space-between;
`;
