import { Image, StyleSheet, View } from "react-native";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { NoticeSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  notice: NoticeSimpleType;
}

export function NoticeSimple({ notice }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Image source={{ uri: notice.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.wrapper}>
          <Text style={styles.title} numberOfLines={2}>
            {`[${notice.type}] ${notice.title}`}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {notice.content}
          </Text>
        </View>
        <Text style={styles.date}>{notice.date}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 8,
    },
    image: {
      width: 115,
      height: 115,
      borderRadius: 8,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
    },
    wrapper: {
      gap: 4,
    },
    title: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.highEmphasis,
    },
    date: {
      textAlignVertical: "bottom",
      color: theme.lowEmphasis,
    },
  });
