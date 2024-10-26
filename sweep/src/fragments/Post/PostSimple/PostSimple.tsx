import { Image, StyleSheet, View } from "react-native";

import { Tag } from "../Tag/Tag";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { PostSimpleType } from "@models/community";
import { ThemeColorType } from "@themes/colors";

interface Props {
  post: PostSimpleType;
}

export function PostSimple({ post }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Divider />
      <View style={styles.horizontal}>
        <View style={styles.main}>
          <Tag tag={post.tag} />
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {post.title}
          </Text>
          <Text style={styles.content} numberOfLines={3} ellipsizeMode="tail">
            {post.content}
          </Text>
          <Text style={styles.grayText}>{post.created_at}</Text>
        </View>
        {post.image !== null ? (
          <Image src={post.image} style={styles.image} />
        ) : null}
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.horizontal}>
          <View style={styles.placeholder} />
          <Text style={styles.authorText}>{post.author_nickname}</Text>
        </View>
        <View style={styles.horizontal}>
          <View style={styles.count}>
            <AppIcon icon="eye" size={18} color={theme.lowEmphasis} />
            <Text style={styles.countText}>{post.num_clicks}</Text>
          </View>
          <View style={styles.count}>
            <AppIcon icon="heart" size={16} color={theme.lowEmphasis} />
            <Text style={styles.countText}>{post.num_likes}</Text>
          </View>
          <View style={styles.count}>
            <AppIcon icon="chat-round" size={18} color={theme.lowEmphasis} />
            <Text style={styles.countText}>{post.num_comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginVertical: 4,
    },
    main: {
      flex: 1,
      marginTop: 12,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      marginVertical: 8,
    },
    content: {
      fontSize: 14,
      marginTop: 4,
      marginBottom: 10,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
    bottomBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.border,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    placeholder: {
      width: 18,
      height: 18,
      marginRight: 5,
      borderRadius: 9,
      backgroundColor: theme.lowEmphasis,
    },
    image: {
      width: 75,
      height: 75,
      marginTop: 8,
      marginLeft: 4,
      borderRadius: 8,
    },
    count: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginLeft: 8,
      gap: 4,
    },
    countText: {
      color: "gray",
    },
    authorText: {
      color: theme.highEmphasis,
    },
  });
