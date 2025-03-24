import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { getNotices } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyNotices() {
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);

  const { academy, selectNotice } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      if (!academy) return;

      const response = await getNotices(academy.uuid);

      if (response) {
        setNotices(response);
      } else {
        setNotices([]);
      }
    };

    fetchData();
  }, []);

  if (!academy) return null;

  const handleNoticePress = (notice: NoticeSimpleType) => {
    selectNotice(notice);
  };

  return (
    <View style={styles.container}>
      {notices.length > 0 ? (
        <>
          {notices.map((notice) => (
            <TouchableOpacity
              key={notice.id}
              style={styles.notice}
              onPress={() => handleNoticePress(notice)}
              testID={`notice-${notice.id}`}
            >
              <NoticeSimple key={notice.id} notice={notice} />
              <Divider />
            </TouchableOpacity>
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
    },
  });
