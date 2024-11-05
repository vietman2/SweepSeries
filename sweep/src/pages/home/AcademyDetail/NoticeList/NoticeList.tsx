import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { useTheme } from "@contexts/theme";
import { NoticeSimple } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { sampleNotices } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function NoticeList() {
  const [notices, setNotices] = useState<NoticeSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setNotices(sampleNotices);
  }, []);

  return (
    <View style={styles.container}>
      {notices.map((notice) => (
        <View key={notice.id} style={styles.notice}>
          <NoticeSimple key={notice.id} notice={notice} />
          <Divider />
        </View>
      ))}
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
