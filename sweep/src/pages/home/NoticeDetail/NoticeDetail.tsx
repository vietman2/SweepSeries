import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { LoadingComponent } from "@components/Fallbacks";
import { useTheme } from "@contexts/theme";
import { NoticeBlock } from "@fragments/Notice";
import { NoticeSimpleType } from "@models/products";
import { getNotice } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function NoticeDetail() {
  const [notice, setNotice] = useState<NoticeSimpleType>();

  const { id, noticeid } = useLocalSearchParams<{
    id: string;
    noticeid: string;
  }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotice(id, noticeid);

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
      <NoticeBlock notice={notice} />
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
  });
