import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { getNotices } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function NoticeList() {
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotices(id);

      if (response) {
        setNotices(response);
      } else {
        setNotices([]);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {notices.length > 0 ? (
        <>
          {notices.map((notice) => (
            <View key={notice.id} style={styles.notice}>
              <NoticeSimple key={notice.id} notice={notice} />
              <Divider />
            </View>
          ))}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>소식이 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
      backgroundColor: theme.background,
    },
    notice: {
      gap: 16,
    },
    emptyContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 24,
      color: theme.mediumEmphasis,
    }
  });
