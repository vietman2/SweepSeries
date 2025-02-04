import { Image, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { NoticeSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  notice: NoticeSimpleType;
}

export function NoticeBlock({ notice }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.date}>{notice.updated_at}</Text>
      <Text style={styles.title}>{notice.title}</Text>
      <Text style={styles.content}>{notice.content}</Text>
      {notice.image && (
        <Image
          source={{ uri: notice.image }}
          style={{ width: "100%", height: 200 }}
        />
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      gap: 16,
    },
    date: {
      color: theme.lowEmphasis,
    },
    title: {
      fontSize: 18,
      color: theme.highEmphasis,
      lineHeight: 24,
    },
    content: {
      fontSize: 16,
      color: theme.mediumEmphasis,
      lineHeight: 24,
    },
  });
