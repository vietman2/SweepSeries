import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachDetailType } from "@models/products";
import { getCoachDetails, likeCoach } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function CoachDetail() {
  const [coach, setCoach] = useState<CoachDetailType>();

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
      const response = await getCoachDetails(coachid);

      if (response) {
        setCoach(response);
      }
    };

    fetchData();
  }, [refreshCount]);

  if (!coach) {
    return null;
  }

  return (
    <Scroll style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <Image src={coach.profile_image} style={styles.image} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>
              {`${coach.name} `}
              <Text style={styles.sub}>코치</Text>
            </Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={handleLikePress} testID="like-button">
                <AppIcon
                  icon={coach.is_liked ? "heart" : "heart-outline"}
                  size={20}
                  color={theme.primary}
                />
              </TouchableOpacity>
              <AppIcon icon="share" size={20} color={theme.lowEmphasis} />
            </View>
          </View>
          <View style={styles.horizontal}>
            <AppIcon icon="person-check" size={20} color={theme.lowEmphasis} />
            <Text style={styles.professions}>
              {coach.professions.map((p) => p.kor_name).join(", ")}
            </Text>
          </View>
          <View style={styles.horizontal}>
            <AppIcon icon="star" size={20} color="#F2B517" />
            <Text style={styles.ratings}>
              {coach.rating.toFixed(2)} ({coach.num_reviews})
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.content}>
          <Text style={styles.subtitle}>코치 소개</Text>
          <Text style={styles.introduction}>{coach.introduction}</Text>
        </View>
        <Divider />
        <View />
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
      fontSize: 16,
      lineHeight: 24,
      color: theme.mediumEmphasis,
    },
  });
