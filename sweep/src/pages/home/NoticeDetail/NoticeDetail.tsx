import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { LoadingComponent } from "@components/Fallbacks";
import { useTheme } from "@contexts/theme";
import { NoticeSimpleType } from "@models/products";
import { getNotice } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function NoticeDetail() {
  const [notice, setNotice] = useState<NoticeSimpleType>();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotice(id);

      if (response) {
        setNotice(response);
      }
    };

    fetchData();
  }, [id]);

  if (!notice) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.date}>{notice.updated_at}</Text>
        <Text style={styles.title}>[공지] {notice.title}</Text>
        <Text style={styles.content}>{notice.content}</Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
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
