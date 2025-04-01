import { Image, StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  coach: CoachSimpleType;
}

export function CoachSimple({ coach }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Image source={{ uri: coach.profile_image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            <Text style={styles.bold}>{coach.name}</Text> {coach.career}
          </Text>
          <AppIcon
            icon={coach.is_liked ? "heart" : "heart-outline"}
            size={20}
            color={theme.primary}
          />
        </View>
        <Text numberOfLines={2} style={styles.intro}>{coach.introduction}</Text>
        <View style={styles.professions}>
          {coach.professions.map((profession) => (
            <View key={profession.id} style={styles.profession}>
              <Text style={styles.professionText}>{profession.kor_name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.ratings}>
          <AppIcon icon="star" size={16} color="#F2B517" />
          <Text style={styles.ratingText}>
            {coach.rating.toFixed(1)}
            <Text style={styles.grayText}> ({coach.num_reviews})</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingVertical: 16,
      paddingHorizontal: 16,
      gap: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
    },
    image: {
      width: 90,
      height: 120,
      borderRadius: 8,
    },
    content: {
      flex: 1,
      gap: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      color: theme.highEmphasis,
    },
    bold: {
      fontSize: 20,
      fontWeight: "bold",
    },
    intro: {
      fontSize: 14,
      lineHeight: 20,
    },
    professions: {
      flexDirection: "row",
      gap: 4,
    },
    profession: {
      paddingVertical: 4,
      paddingHorizontal: 4,
      backgroundColor: theme.background,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    professionText: {
      fontSize: 12,
      color: theme.lowEmphasis,
    },
    ratings: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      fontSize: 16,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
  });
