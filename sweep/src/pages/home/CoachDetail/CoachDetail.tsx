import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
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
    <Scroll style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Profile>
            <Image src={coach.profile_image} style={styles.image} />
          </Profile>
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
        <View style={styles.content}>
          <Text style={styles.subtitle}>코치 소개</Text>
          <Text style={styles.introduction}>{coach.introduction}</Text>
        </View>
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
      </View>
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      paddingTop: 24,
      paddingHorizontal: 16,
      gap: 16,
    },
    header: {
      paddingHorizontal: 8,
      gap: 4,
    },
    profile: {
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
      gap: 8,
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
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    professions: {
      fontSize: 14,
      color: theme.primary,
    },
    ratings: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    content: {
      paddingHorizontal: 8,
      gap: 8,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    introduction: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.mediumEmphasis,
    },
  });

const Reviews = styled.View`
  gap: 16px;
`;

const Profile = styled.View`
  align-items: center;
  justify-content: center;
`;

const Horizontal = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const NameLikeShare = styled(Horizontal)`
  justify-content: space-between;
`;
