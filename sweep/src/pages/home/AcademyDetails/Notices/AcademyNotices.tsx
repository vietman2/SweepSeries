import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Empty } from "@components/Fallbacks";
import { useAcademyDetail } from "@contexts/academy";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

export function AcademyNotices() {
  const { academy, notices, selectNotice } = useAcademyDetail();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!academy) return null;

  const handleNoticePress = (notice: NoticeSimpleType) => {
    selectNotice(academy.uuid, notice);
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
        <Empty message="등록된 공지가 없습니다." type={2} />
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
  });
