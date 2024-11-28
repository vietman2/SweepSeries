import { Image, StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { UserProfileType } from "@models/auth";
import { ThemeColorType } from "@themes/colors";

interface Props {
  author: UserProfileType | null;
  imageOnly?: boolean;
}

export function AuthorProfile({ author, imageOnly = false }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!author) {
    return null;
  }

  return (
    <View style={styles.container}>
      {author.profile_image ? (
        <Image src={author.profile_image} style={styles.image} />
      ) : (
        <View style={[styles.iconWrapper, { backgroundColor: author.color }]}>
          <AppIcon icon="default_profile" size={24} color={author.color} />
        </View>
      )}
      {imageOnly ? null : (
        <Text style={styles.authorText}>{author.nickname}</Text>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    image: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    iconWrapper: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundGray,
    },
    authorText: {
      fontSize: 14,
      color: theme.highEmphasis,
    },
  });
