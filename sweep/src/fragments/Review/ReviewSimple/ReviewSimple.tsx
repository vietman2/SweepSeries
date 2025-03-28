import { Image, StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademyReviewType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  review: AcademyReviewType;
}

export function ReviewSimple({ review }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerWrapper}>
          <Image
            src={review.reviewer.profile_image}
            style={styles.authorProfile}
          />
          <Text style={styles.authorNickname}>{review.reviewer.name}</Text>
          <Text style={styles.date}>{review.created_at}</Text>
        </View>
      </View>
      <RatingDisplay rating={review.academy_rating} />
      <View style={styles.tags}>
        {review.academy_tags.map((tag) => (
          <Tag key={tag.id} text={tag.tag} />
        ))}
      </View>
      <Scroll horizontal>
        {review.academy_images.map((image) => (
          <Image key={image} src={image} style={styles.image} />
        ))}
      </Scroll>
      <Text style={styles.content}>{review.academy_comment}</Text>
      {review.reply && (
        <View style={styles.reply}>
          <Text style={styles.replyAuthor}>{review.reply.author_name}</Text>
          <Text style={styles.replyContent}>{review.reply.content}</Text>
        </View>
      )}
    </View>
  );
}

interface TagProps {
  text: string;
}

function Tag({ text }: Readonly<TagProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

interface RatingProps {
  rating: number;
}

function RatingDisplay({ rating }: Readonly<RatingProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.rating}>
      <AppIcon icon="star" size={16} color="#F2B517" />
      <AppIcon
        icon={rating >= 2 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
      <AppIcon
        icon={rating >= 3 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
      <AppIcon
        icon={rating >= 4 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
      <AppIcon
        icon={rating == 5 ? "star" : "star-outline"}
        size={16}
        color="#F2B517"
      />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 4,
      marginBottom: 16,
      gap: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    authorProfile: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    authorNickname: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    date: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    information: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    informationText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    tags: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    tag: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    tagText: {
      fontSize: 12,
      color: theme.primary,
    },
    image: {
      width: 110,
      height: 110,
      marginTop: 4,
      marginRight: 16,
      borderRadius: 4,
    },
    content: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.mediumEmphasis,
    },
    reply: {
      marginHorizontal: 8,
      padding: 16,
      gap: 8,
      backgroundColor: theme.backgroundGray,
      borderRadius: 4,
    },
    replyAuthor: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    replyContent: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.highEmphasis,
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });
